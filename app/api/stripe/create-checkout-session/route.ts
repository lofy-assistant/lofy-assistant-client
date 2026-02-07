import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { prisma } from '@/lib/database';
import { plans, resolveCurrency, resolveCurrencyFromIP } from "@/lib/stripe-plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { billingCycle } = body;
    const country =
      body.country ??
      req.headers.get("x-vercel-ip-country")?.toUpperCase() ??
      undefined;

    // Optional: get user from session (guests can checkout without auth)
    let customerEmail: string | undefined;
    let userId: string | undefined;

    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (token) {
      const session = await verifySession(token);
      if (session) {
        const user = await prisma.users.findUnique({
          where: { id: session.userId },
          select: { id: true, email: true },
        });
        if (user?.email) {
          customerEmail = user.email;
          userId = user.id;
        }
      }
    }

    // Find the plan based on billing cycle
    const plan = plans.find((p) => p.billingCycle === billingCycle);

    if (!plan) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
      "http://localhost:3000";

    // Same price_id; Stripe picks amount from currency_options (USD/MYR) per session currency.
    // Country from body (pricing page) or fallback to IP geo (Vercel x-vercel-ip-country).
    const currency = resolveCurrencyFromIP(country);

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_collection: "if_required",
      currency,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      subscription_data: {
        trial_period_days: 14,
      },
      ...(customerEmail && { customer_email: customerEmail }),
      ...(userId && { metadata: { userId } }),
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}


