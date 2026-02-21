import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from '@/lib/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

interface WebhookErrorResponse {
  error: string;
}

interface WebhookSuccessResponse {
  success: boolean;
}

interface ExtendedSubscription extends Stripe.Subscription {
  current_period_end: number;
  current_period_start: number;
}

function toDate(epochSeconds: number | undefined | null): Date | null {
  if (!epochSeconds) return null;
  const d = new Date(epochSeconds * 1000);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Resolve the customer email from a checkout session.
 * `customer_email` is only set if we passed it at session creation.
 * `customer_details.email` is always populated after the customer completes checkout.
 */
function resolveEmail(session: Stripe.Checkout.Session): string | null {
  return session.customer_email ?? session.customer_details?.email ?? null;
}

/**
 * Find a user's pre-filled subscription record.
 * Tries userId first (from metadata), then falls back to email lookup.
 */
async function findSubscriptionForUser(userId: string | undefined, email: string | null) {
  // 1. By userId from metadata (most reliable)
  if (userId) {
    const record = await prisma.subscriptions.findFirst({ where: { user_id: userId } });
    if (record) return { record, resolvedUserId: userId };
  }

  // 2. By email → user → subscription
  if (email) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (user) {
      const record = await prisma.subscriptions.findFirst({ where: { user_id: user.id } });
      return { record: record ?? null, resolvedUserId: user.id };
    }
  }

  return { record: null, resolvedUserId: undefined };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      throw new Error("Missing signature or webhook secret");
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed. ${errorMessage}`);
    return NextResponse.json<WebhookErrorResponse>({ error: errorMessage }, { status: 400 });
  }

  const eventType = event.type;

  try {
    switch (eventType) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        console.log(`🔔 Handling ${eventType} event`);

        const subscription = event.data.object as ExtendedSubscription;
        const customerId = subscription.customer as string;

        if (!subscription.items.data[0]) {
          throw new Error("No items in subscription");
        }

        const priceId = subscription.items.data[0].price.id;
        const currentPeriodEnd = toDate(subscription.current_period_end);
        if (!currentPeriodEnd) {
          throw new Error("Invalid or missing current_period_end from Stripe");
        }

        console.log("📊 Subscription:", {
          customerId,
          priceId,
          status: subscription.status,
          currentPeriodEnd,
        });

        // Find subscription by Stripe customer ID (only works after it's been linked)
        const subscriptionRecord = await prisma.subscriptions.findUnique({
          where: { stripe_customer_id: customerId },
        });

        if (subscriptionRecord) {
          await prisma.subscriptions.update({
            where: { stripe_customer_id: customerId },
            data: {
              stripe_price_id: priceId,
              subscription_status: subscription.status,
              current_period_end: currentPeriodEnd,
            },
          });
          console.log("✅ Subscription updated successfully");
        } else {
          console.log("⏸️ Subscription not found by customer ID (pending link in checkout.session.completed)");
        }

        break;
      }

      case "customer.subscription.deleted": {
        console.log("🔔 Handling customer.subscription.deleted event");

        const subscription = event.data.object as ExtendedSubscription;
        const customerId = subscription.customer as string;

        await prisma.subscriptions.updateMany({
          where: { stripe_customer_id: customerId },
          data: { subscription_status: "canceled" },
        });

        console.log("✅ Subscription canceled successfully");
        break;
      }

      case "checkout.session.completed": {
        console.log("🔔 Checkout session completed");

        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.subscription) break;

        const userId = session.metadata?.userId;
        const email = resolveEmail(session);

        console.log("📋 Session:", {
          customerId: session.customer,
          metadataUserId: userId,
          customerEmail: session.customer_email,
          customerDetailsEmail: session.customer_details?.email,
          resolvedEmail: email,
          subscription: session.subscription,
        });

        // Fetch full subscription details from Stripe
        const stripeSubscription = (await stripe.subscriptions.retrieve(
          session.subscription as string
        )) as unknown as ExtendedSubscription;

        if (!stripeSubscription.items.data[0]) {
          throw new Error("No items in Stripe subscription");
        }

        const priceId = stripeSubscription.items.data[0].price.id;
        const currentPeriodEnd = toDate(stripeSubscription.current_period_end) ?? new Date();

        // Find the user's pre-filled subscription (by userId or email)
        const { record: subscriptionRecord, resolvedUserId } = await findSubscriptionForUser(userId, email);

        if (subscriptionRecord) {
          console.log("📝 Updating pre-filled subscription for user...");
          await prisma.subscriptions.update({
            where: { id: subscriptionRecord.id },
            data: {
              stripe_customer_id: session.customer as string,
              stripe_price_id: priceId,
              subscription_status: stripeSubscription.status,
              current_period_end: currentPeriodEnd,
            },
          });
          console.log("✅ Subscription linked and updated with Stripe details");
        } else if (resolvedUserId) {
          // Pre-filled subscription missing (edge case) — create a new one
          console.log("➕ No pre-filled subscription found. Creating new...");
          await prisma.subscriptions.create({
            data: {
              user_id: resolvedUserId,
              stripe_customer_id: session.customer as string,
              stripe_price_id: priceId,
              subscription_status: stripeSubscription.status,
              current_period_end: currentPeriodEnd,
            },
          });
          console.log("✅ New subscription created successfully");
        } else {
          console.error("❌ Could not resolve user. metadata.userId:", userId, "email:", email);
        }

        break;
      }

      default:
        console.log(`⏭️ Unhandled event type: ${eventType}`);
    }
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error("stripe error: " + errorMessage + " | EVENT TYPE: " + eventType);
    return NextResponse.json<WebhookErrorResponse>({ error: errorMessage }, { status: 500 });
  }

  return NextResponse.json<WebhookSuccessResponse>({ success: true });
}
