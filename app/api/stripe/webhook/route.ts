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
 * Extract the effective period end from a raw webhook subscription payload.
 * Prioritises trial_end (if the sub is trialing) over current_period_end.
 * Stripe SDK v20 removed current_period_end from the typed interface,
 * but the webhook JSON payload still includes it.
 */
function extractPeriodEnd(rawObject: Record<string, unknown>): Date | null {
  const trialEnd = rawObject.trial_end;
  if (typeof trialEnd === "number" && trialEnd > 0) {
    const d = new Date(trialEnd * 1000);
    if (!Number.isNaN(d.getTime())) return d;
  }

  const ts = rawObject.current_period_end;
  if (typeof ts !== "number" || ts <= 0) return null;
  const d = new Date(ts * 1000);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Returns true when the given date is less than 1 hour from now,
 * indicating Stripe hasn't moved it to the real billing-cycle end yet.
 */
function isPeriodEndPlaceholder(date: Date): boolean {
  return date.getTime() < Date.now() + 3_600_000;
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
      case "customer.subscription.created": {
        console.log("🔔 Handling customer.subscription.created event");

        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const rawObject = event.data.object as unknown as Record<string, unknown>;

        console.log("📊 Subscription created (status may still be incomplete):", {
          customerId,
          status: subscription.status,
          raw_current_period_end: rawObject.current_period_end,
        });

        const subscriptionRecord = await prisma.subscriptions.findUnique({
          where: { stripe_customer_id: customerId },
        });

        if (subscriptionRecord) {
          // Only update status — do NOT finalize current_period_end yet.
          // The date Stripe sends here is often "now" because payment hasn't
          // been confirmed. invoice.paid will carry the real future date.
          await prisma.subscriptions.update({
            where: { stripe_customer_id: customerId },
            data: { subscription_status: subscription.status },
          });
          console.log("✅ Subscription status synced (period_end deferred to invoice.paid)");
        } else {
          console.log("⏸️ Subscription not found by customer ID (pending link in checkout.session.completed)");
        }

        break;
      }

      case "customer.subscription.updated": {
        console.log("🔔 Handling customer.subscription.updated event");

        const rawObject = event.data.object as unknown as Record<string, unknown>;
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        if (!subscription.items.data[0]) {
          throw new Error("No items in subscription");
        }

        const priceId = subscription.items.data[0].price.id;
        const currentPeriodEnd = extractPeriodEnd(rawObject);

        console.log("📊 Subscription updated:", {
          customerId,
          priceId,
          status: subscription.status,
          raw_current_period_end: rawObject.current_period_end,
          parsed_current_period_end: currentPeriodEnd,
        });

        const subscriptionRecord = await prisma.subscriptions.findUnique({
          where: { stripe_customer_id: customerId },
        });

        if (subscriptionRecord) {
          const data: Record<string, unknown> = {
            stripe_price_id: priceId,
            subscription_status: subscription.status,
          };

          // Only write period_end when it's a real future date
          if (currentPeriodEnd && !isPeriodEndPlaceholder(currentPeriodEnd)) {
            data.current_period_end = currentPeriodEnd;
          }

          await prisma.subscriptions.update({
            where: { stripe_customer_id: customerId },
            data,
          });
          console.log("✅ Subscription updated successfully");
        } else {
          console.log("⏸️ Subscription not found by customer ID (pending link in checkout.session.completed)");
        }

        break;
      }

      case "invoice.paid": {
        console.log("🔔 Handling invoice.paid event");

        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (!customerId) {
          console.log("⏭️ invoice.paid has no customer — skipping");
          break;
        }

        const subscriptionId =
          typeof invoice.parent?.subscription_details?.subscription === "string"
            ? invoice.parent.subscription_details.subscription
            : invoice.parent?.subscription_details?.subscription?.id ?? null;

        if (!subscriptionId) {
          console.log("⏭️ invoice.paid is not for a subscription — skipping");
          break;
        }

        // Retrieve the subscription so we get the authoritative period_end
        // now that payment has succeeded.
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        const rawSub = stripeSubscription as unknown as Record<string, unknown>;
        const currentPeriodEnd = extractPeriodEnd(rawSub);

        console.log("📊 invoice.paid subscription data:", {
          customerId,
          subscriptionId,
          status: stripeSubscription.status,
          raw_current_period_end: rawSub.current_period_end,
          parsed_current_period_end: currentPeriodEnd,
        });

        if (!currentPeriodEnd) {
          console.error("❌ Could not resolve period_end after invoice.paid");
          break;
        }

        const priceId = stripeSubscription.items.data[0]?.price.id;

        const subscriptionRecord = await prisma.subscriptions.findUnique({
          where: { stripe_customer_id: customerId },
        });

        if (subscriptionRecord) {
          await prisma.subscriptions.update({
            where: { stripe_customer_id: customerId },
            data: {
              ...(priceId ? { stripe_price_id: priceId } : {}),
              subscription_status: stripeSubscription.status,
              current_period_end: currentPeriodEnd,
            },
          });
          console.log("✅ Subscription period_end updated via invoice.paid");
        } else {
          console.log("⏸️ Subscription not found by customer ID for invoice.paid");
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

        const stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        if (!stripeSubscription.items.data[0]) {
          throw new Error("No items in Stripe subscription");
        }

        const priceId = stripeSubscription.items.data[0].price.id;

        const rawSub = stripeSubscription as unknown as Record<string, unknown>;
        let currentPeriodEnd = extractPeriodEnd(rawSub);

        console.log("📊 checkout.session.completed period end:", {
          raw_current_period_end: rawSub.current_period_end,
          parsed: currentPeriodEnd,
          subscription_status: stripeSubscription.status,
        });

        // If the period_end is essentially "now" (less than 1 hour in the
        // future), Stripe hasn't finalised the billing cycle yet — the real
        // date will arrive via invoice.paid. Use a +1 month fallback so the
        // user isn't immediately locked out.
        if (!currentPeriodEnd || isPeriodEndPlaceholder(currentPeriodEnd)) {
          console.log("⚠️ period_end is a placeholder — applying +1 month fallback");
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
