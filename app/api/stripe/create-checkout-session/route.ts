import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { billingCycle } = await req.json();

    // Get user from session
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "User not found or email missing" },
        { status: 404 }
      );
    }

    // Define prices - you can create products in Stripe and replace these with price IDs
    const amount = billingCycle === "monthly" ? 500 : 4500; // in cents
    const interval = billingCycle === "monthly" ? "month" : "year";

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Lofy Pro Plan",
              description: "Everything you need to stay organized and productive",
            },
            unit_amount: amount,
            recurring: {
              interval: interval as "month" | "year",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      subscription_data: {
        trial_period_days: 14,
      },
      allow_promotion_codes: true,
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
