import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { prisma } from '@/lib/database';
import { getStripeSubscriptionPlans, type BillingCycle } from "@/lib/stripe-plans";
import type { SubscriptionTierId } from "@/lib/pricing-model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutRequestBody {
  billingCycle: string;
  /** Defaults to pro when omitted (older clients). */
  tierId?: SubscriptionTierId;
  country?: string;
  email?: string;
}

interface CheckoutSuccessResponse {
  url: string | null;
}

interface CheckoutErrorResponse {
  error: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequestBody = await req.json();
    const rawBc = body.billingCycle;
    const billingCycle: BillingCycle =
      rawBc === "monthly" || rawBc === "quarterly" || rawBc === "yearly" ? rawBc : "monthly";
    const rawTier = body.tierId;
    const tierId: SubscriptionTierId =
      rawTier === "pro" || rawTier === "premium" || rawTier === "enterprise"
        ? rawTier
        : rawTier === "business"
          ? "premium"
          : "pro";
    let customerEmail: string | undefined;
    let userId: string | undefined;
    let existingStripeCustomerId: string | undefined;

    // 1. Try to resolve user from session (logged-in user)
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (token) {
      const session = await verifySession(token);
      if (session) {
        const user = await prisma.users.findUnique({
          where: { id: session.userId },
          select: { id: true, email: true },
        });
        if (user) {
          userId = user.id;
          customerEmail = user.email ?? undefined;

          const subscription = await prisma.subscriptions.findFirst({
            where: { user_id: user.id },
            select: { stripe_customer_id: true },
          });

          if (subscription?.stripe_customer_id?.startsWith('cus_')) {
            existingStripeCustomerId = subscription.stripe_customer_id;
          }
        }
      }
    }

    // 2. Fallback: use email from request body (non-logged-in user)
    if (!customerEmail && body.email) {
      customerEmail = body.email;

      // Try to resolve userId from the provided email
      const user = await prisma.users.findUnique({
        where: { email: body.email },
        select: { id: true },
      });
      if (user) {
        userId = user.id;

        const subscription = await prisma.subscriptions.findFirst({
          where: { user_id: user.id },
          select: { stripe_customer_id: true },
        });

        if (subscription?.stripe_customer_id?.startsWith('cus_')) {
          existingStripeCustomerId = subscription.stripe_customer_id;
        }
      }
    }

    const plan = getStripeSubscriptionPlans().find(
      (p) => p.billingCycle === billingCycle && p.tierId === tierId
    );
    if (!plan) {
      return NextResponse.json<CheckoutErrorResponse>(
        { error: "Invalid billing cycle or tier, or checkout not enabled for this tier yet" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const priceId = plan.priceId;

    // Apple Pay and Google Pay are automatically enabled with "card"
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ["card", "link"];

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: paymentMethodTypes,
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_options: {
        card: { request_three_d_secure: "automatic" },
      },
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
    };

    // Attach customer: reuse existing Stripe customer, or pre-fill email
    if (existingStripeCustomerId) {
      sessionParams.customer = existingStripeCustomerId;
    } else if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    // Always pass userId in metadata when available so webhook can find the user
    if (userId) {
      sessionParams.metadata = { userId, tierId: plan.tierId };
    }

    const stripeSession = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json<CheckoutSuccessResponse>({ url: stripeSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json<CheckoutErrorResponse>(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
