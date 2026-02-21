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

/**
 * Extract current_period_end from a raw webhook subscription payload.
 * Stripe SDK v20 removed this from the typed Subscription interface,
 * but the webhook JSON payload still includes it.
 */
function extractPeriodEnd(rawObject: Record<string, unknown>): Date | null {
  const ts = rawObject.current_period_end;
  if (typeof ts !== "number" || ts <= 0) return null;
  const d = new Date(ts * 1000);
  return Number.isNaN(d.getTime()) ? null : d;
}

function resolveEmail(session: Stripe.Checkout.Session): string | null {
  return session.customer_email ?? session.customer_details?.email ?? null;
}

async function findSubscriptionForUser(userId: string | undefined, email: string | null) {
  if (userId) {
    const record = await prisma.subscriptions.findFirst({ where: { user_id: userId } });
    if (record) return { record, resolvedUserId: userId };
  }

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

        // event.data.object is the raw webhook JSON — current_period_end exists here
        const rawObject = event.data.object as unknown as Record<string, unknown>;
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        if (!subscription.items.data[0]) {
          throw new Error("No items in subscription");
        }

        const priceId = subscription.items.data[0].price.id;
        const currentPeriodEnd = extractPeriodEnd(rawObject);

        console.log("📊 Subscription raw data:", {
          customerId,
          priceId,
          status: subscription.status,
          raw_current_period_end: rawObject.current_period_end,
          parsed_current_period_end: currentPeriodEnd,
        });

        if (!currentPeriodEnd) {
          throw new Error("Missing current_period_end from Stripe webhook payload");
        }

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

        const subscription = event.data.object as Stripe.Subscription;
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

        // Retrieve subscription with expanded latest_invoice to get period_end
        const stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
          { expand: ["latest_invoice"] }
        );

        if (!stripeSubscription.items.data[0]) {
          throw new Error("No items in Stripe subscription");
        }

        const priceId = stripeSubscription.items.data[0].price.id;

        // Get current_period_end from the latest invoice's period_end (reliable in SDK v20+),
        // then fall back to the raw subscription object in case it's still present at runtime.
        const rawSub = stripeSubscription as unknown as Record<string, unknown>;
        const latestInvoice = stripeSubscription.latest_invoice as Stripe.Invoice | null;
        const periodEndFromInvoice = latestInvoice?.period_end;
        const periodEndFromRaw = rawSub.current_period_end;

        const periodEndTimestamp = periodEndFromInvoice ?? periodEndFromRaw;

        console.log("📊 Period end sources:", {
          from_invoice_period_end: periodEndFromInvoice,
          from_raw_current_period_end: periodEndFromRaw,
          resolved: periodEndTimestamp,
        });

        let currentPeriodEnd: Date;
        if (typeof periodEndTimestamp === "number" && periodEndTimestamp > 0) {
          currentPeriodEnd = new Date(periodEndTimestamp * 1000);
        } else {
          console.error("❌ Could not resolve period end from Stripe. Using 1 month from now as fallback.");
          currentPeriodEnd = new Date();
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        }

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
