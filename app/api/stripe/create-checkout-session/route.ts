import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { prisma } from '@/lib/database';
import { plans, resolveCurrencyFromIP } from "@/lib/stripe-plans";

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
    let existingStripeCustomerId: string | undefined;

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

          // Check for existing subscription with valid Stripe Customer ID
          const subscription = await prisma.subscriptions.findFirst({
            where: { user_id: user.id },
            select: { stripe_customer_id: true }
          });

          if (subscription?.stripe_customer_id && subscription.stripe_customer_id.startsWith('cus_')) {
            existingStripeCustomerId = subscription.stripe_customer_id;
          }
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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Same price_id; Stripe picks amount from currency_options (USD/MYR) per session currency.
    // Country from body (pricing page) or fallback to IP geo (Vercel x-vercel-ip-country).
    const currency = resolveCurrencyFromIP(country);

    // Payment methods based on currency
    // Note: FPX and GrabPay don't support subscription mode, only one-time payments
    // Apple Pay and Google Pay are automatically enabled with "card"
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ["card", "link"];

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: paymentMethodTypes,
      currency,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      ...(existingStripeCustomerId ? { customer: existingStripeCustomerId } : (customerEmail && { customer_email: customerEmail })),
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


