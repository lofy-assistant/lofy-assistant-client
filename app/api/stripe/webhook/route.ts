import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from '@/lib/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
  } catch (err: any) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const eventType = event.type;

  try {
    switch (eventType) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        // Only update if subscription already exists
        // Creation happens in checkout.session.completed after we link the user
        console.log(`🔔 Handling ${eventType} event`);

        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        if (!subscription.items.data[0]) {
          throw new Error("No items in subscription");
        }

        const priceId = subscription.items.data[0].price.id;

        // Convert timestamp correctly - handle null/undefined
        const periodEndTimestamp = (subscription as any).current_period_end;
        
        if (!periodEndTimestamp) {
          console.warn("⚠️ No current_period_end, defaulting to 14 days from now");
          // Default to 14 days from now if not available
          var currentPeriodEnd = new Date();
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
        let subscriptionRecord = await prisma.subscriptions.findUnique({
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
          // Skip creating here - will be created in checkout.session.completed
          console.log("⏸️ Subscription will be created in checkout.session.completed event");
        }

        break;
      }

      case "customer.subscription.deleted": {
        // ❌ Revoke access to the product
        console.log("🔔 Handling customer.subscription.deleted event");

        const subscription = event.data.object as Stripe.Subscription;
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

        if (session.subscription && session.customer_email) {
          console.log("📋 Session:", {
            customerId: session.customer,
            email: session.customer_email,
            subscription: session.subscription,
          });

          // Find user by email
          const user = await prisma.users.findUnique({
            where: { email: session.customer_email },
          });

          if (user) {
            // Fetch subscription details
            const stripeSubscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );

            if (!stripeSubscription.items.data[0]) {
              throw new Error("No items in Stripe subscription");
            }

            const priceId = stripeSubscription.items.data[0].price.id;
            const periodEndTimestamp = (stripeSubscription as any).current_period_end;
            
            let currentPeriodEnd = new Date();
            if (periodEndTimestamp) {
              currentPeriodEnd = new Date(periodEndTimestamp * 1000);
            } else {
              currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 14);
            }

            // Check if subscription exists
            let subscriptionRecord = await prisma.subscriptions.findUnique({
              where: {
                stripe_customer_id: session.customer as string,
              },
            });

            if (subscriptionRecord) {
              // Update existing
              console.log("📝 Updating subscription with user...");
              await prisma.subscriptions.update({
                where: { stripe_customer_id: session.customer as string },
                data: {
                  user_id: user.id,
                  stripe_price_id: priceId,
                  subscription_status: stripeSubscription.status,
                  current_period_end: currentPeriodEnd,
                },
              });
              console.log("✅ Subscription updated with user");
            } else {
              // Create new
              console.log("➕ Creating subscription...");
              await prisma.subscriptions.create({
                data: {
                  user_id: user.id,
                  stripe_customer_id: session.customer as string,
                  stripe_price_id: priceId,
                  subscription_status: stripeSubscription.status,
                  current_period_end: currentPeriodEnd,
                },
              });
              console.log("✅ Subscription created successfully");
            }
          }
        }

        break;
      }

      default:
        // Unhandled event type
        console.log(`⏭️ Unhandled event type: ${eventType}`);
    }
  } catch (e: any) {
    console.error("stripe error: " + e.message + " | EVENT TYPE: " + eventType);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  return NextResponse.json({});
}
