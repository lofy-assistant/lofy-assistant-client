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

// Fix missing properties in Stripe.Subscription type definition
interface ExtendedSubscription extends Stripe.Subscription {
  current_period_end: number;
  current_period_start: number;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event: Stripe.Event;

  // Verify Stripe event is legit
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
        // Only update if subscription already exists
        // Creation happens in checkout.session.completed after we link the user
        console.log(`🔔 Handling ${eventType} event`);

        const subscription = event.data.object as ExtendedSubscription;
        const customerId = subscription.customer as string;

        if (!subscription.items.data[0]) {
          throw new Error("No items in subscription");
        }

        const priceId = subscription.items.data[0].price.id;

        // Convert timestamp correctly - handle null/undefined
        const periodEndTimestamp = subscription.current_period_end;
        
        let currentPeriodEnd: Date;
        if (!periodEndTimestamp) {
          console.warn("⚠️ No current_period_end, defaulting to 14 days from now");
          // Default to 14 days from now if not available
          currentPeriodEnd = new Date();
          currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 14);
        } else {
          currentPeriodEnd = new Date(periodEndTimestamp * 1000);
        }

        if (Number.isNaN(currentPeriodEnd.getTime())) {
          throw new Error("Invalid current_period_end from Stripe");
        }

        console.log("📊 Subscription:", {
          customerId,
          priceId,
          status: subscription.status,
          currentPeriodEnd,
          timestamp: periodEndTimestamp,
        });

        // Find subscription by Stripe customer ID
        const subscriptionRecord = await prisma.subscriptions.findUnique({
          where: {
            stripe_customer_id: customerId,
          },
        });

        if (subscriptionRecord) {
          // Update existing
          console.log("📝 Updating subscription...");
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
          // If not found, it might be because checkout.session.completed hasn't run yet to link the user.
          // We can't do much here without the user link.
          console.log("⏸️ Subscription not found by customer ID (likely pending link in checkout.session.completed)");
        }

        break;
      }

      case "customer.subscription.deleted": {
        // ❌ Revoke access to the product
        console.log("🔔 Handling customer.subscription.deleted event");

        const subscription = event.data.object as ExtendedSubscription;
        const customerId = subscription.customer as string;

        await prisma.subscriptions.updateMany({
          where: {
            stripe_customer_id: customerId,
          },
          data: {
            subscription_status: "canceled",
          },
        });

        console.log("✅ Subscription canceled successfully");
        break;
      }

      case "checkout.session.completed": {
        // Create/link subscription after finding user
        console.log("🔔 Checkout session completed");

        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (session.subscription) {
          console.log("📋 Session:", {
            customerId: session.customer,
            email: session.customer_email,
            subscription: session.subscription,
            userId: userId,
          });

          // Fetch full subscription details from Stripe
          const stripeSubscription = (await stripe.subscriptions.retrieve(
            session.subscription as string
          )) as unknown as ExtendedSubscription;

          if (!stripeSubscription.items.data[0]) {
            throw new Error("No items in Stripe subscription");
          }

          const priceId = stripeSubscription.items.data[0].price.id;
          const periodEndTimestamp = stripeSubscription.current_period_end;
          
          let currentPeriodEnd = new Date();
          if (periodEndTimestamp) {
            currentPeriodEnd = new Date(periodEndTimestamp * 1000);
          } else {
            currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 14);
          }

          let subscriptionRecord = null;

          // 1. Try to find by User ID (preferred, from metadata)
          if (userId) {
             // Find the user's pre-filled subscription
             // We use findFirst because user_id is not unique in schema, but we expect one relevant record
             subscriptionRecord = await prisma.subscriptions.findFirst({
               where: { user_id: userId },
             });
          }

          // 2. Fallback: Try to find by email if no userId in metadata
          if (!subscriptionRecord && session.customer_email) {
             const user = await prisma.users.findUnique({
               where: { email: session.customer_email },
             });
             if (user) {
               subscriptionRecord = await prisma.subscriptions.findFirst({
                 where: { user_id: user.id },
               });
             }
          }

          if (subscriptionRecord) {
            // Update existing pre-filled subscription
            console.log("📝 Updating existing pre-filled subscription for user...");
            await prisma.subscriptions.update({
              where: { id: subscriptionRecord.id }, // Use PK to update
              data: {
                stripe_customer_id: session.customer as string,
                stripe_price_id: priceId,
                subscription_status: stripeSubscription.status,
                current_period_end: currentPeriodEnd,
              },
            });
            console.log("✅ Subscription linked and updated with Stripe details");
          } else if (userId || session.customer_email) {
             // If for some reason the pre-filled subscription is missing, create a new one
             // (This covers the case where maybe the pre-fill logic failed or didn't run)
             console.log("➕ No pre-filled subscription found. Creating new...");
             
             // Need to resolve user ID again if we only have email
             let targetUserId = userId;
             if (!targetUserId && session.customer_email) {
                const user = await prisma.users.findUnique({ where: { email: session.customer_email }});
                targetUserId = user?.id;
             }

             if (targetUserId) {
                await prisma.subscriptions.create({
                  data: {
                    user_id: targetUserId,
                    stripe_customer_id: session.customer as string,
                    stripe_price_id: priceId,
                    subscription_status: stripeSubscription.status,
                    current_period_end: currentPeriodEnd,
                  },
                });
                console.log("✅ New subscription created successfully");
             } else {
                console.error("❌ Could not find user to create subscription for");
             }
          } else {
             console.error("❌ No user ID in metadata and no email to link subscription");
          }
        }

        break;
      }

      default:
        // Unhandled event type
        console.log(`⏭️ Unhandled event type: ${eventType}`);
    }
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error("stripe error: " + errorMessage + " | EVENT TYPE: " + eventType);
    return NextResponse.json<WebhookErrorResponse>({ error: errorMessage }, { status: 500 });
  }

  return NextResponse.json<WebhookSuccessResponse>({ success: true });
}
