import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@/lib/generated/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const prisma = new PrismaClient();

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  // If webhook secret is configured, verify the signature
  if (webhookSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }
  } else {
    // For development without webhook secret, parse the body directly
    // WARNING: This should only be used in development!
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch (err) {
      console.error("Failed to parse webhook body:", err);
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Get user_id from metadata or try to find by email
          let userId = session.metadata?.userId;
          
          if (!userId && session.customer_email) {
            // Find user by email if userId not in metadata
            const user = await prisma.users.findUnique({
              where: { email: session.customer_email },
            });
            userId = user?.id;
          }

          if (userId) {
            await prisma.subscriptions.create({
              data: {
                user_id: userId,
                stripe_customer_id: session.customer as string,
                stripe_price_id: subscription.items.data[0].price.id,
                subscription_status: subscription.status,
                current_period_end: new Date((subscription as any).current_period_end * 1000),
              },
            });
          } else {
            console.error("Could not associate subscription with user");
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscriptions.updateMany({
          where: {
            stripe_customer_id: subscription.customer as string,
          },
          data: {
            subscription_status: subscription.status,
            current_period_end: new Date((subscription as any).current_period_end * 1000),
            stripe_price_id: subscription.items.data[0].price.id,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscriptions.updateMany({
          where: {
            stripe_customer_id: subscription.customer as string,
          },
          data: {
            subscription_status: "canceled",
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
