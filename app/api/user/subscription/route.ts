import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/database";
import { plans } from "@/lib/stripe-plans";

interface SubscriptionResponse {
  subscription: {
    id: string;
    status: string;
    priceId: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    billingCycle: "monthly" | "yearly" | null;
    planLabel: string;
  } | null;
}

interface ErrorResponse {
  error: string;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      return NextResponse.json<ErrorResponse>({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json<ErrorResponse>({ error: "Invalid session" }, { status: 401 });
    }

    const record = await prisma.subscriptions.findFirst({
      where: { user_id: session.userId },
      select: {
        id: true,
        stripe_price_id: true,
        subscription_status: true,
        current_period_end: true,
      },
    });

    if (!record) {
      return NextResponse.json<SubscriptionResponse>({ subscription: null });
    }

    const matchedPlan = plans.find((p) => p.priceId === record.stripe_price_id);

    // cancel_at_period_end is reflected as status "active" in Stripe until the
    // period ends, so we read it directly from Stripe only when needed. For
    // display purposes we surface the raw status field and let the UI decide.
    // If the user just hit cancel, the webhook will have updated the status to
    // reflect "active" with cancel_at_period_end = true — we encode that as a
    // separate field by checking our own DB or relying on Stripe status values.
    // We also expose a derived `cancelAtPeriodEnd` flag based on the status
    // stored after our cancel endpoint fires (we set it to "cancel_at_period_end").
    const isCancelingAtPeriodEnd = record.subscription_status === "cancel_at_period_end";

    return NextResponse.json<SubscriptionResponse>({
      subscription: {
        id: record.id,
        status: isCancelingAtPeriodEnd ? "active" : record.subscription_status,
        priceId: record.stripe_price_id,
        currentPeriodEnd: record.current_period_end.toISOString(),
        cancelAtPeriodEnd: isCancelingAtPeriodEnd,
        billingCycle: matchedPlan?.billingCycle ?? null,
        planLabel: matchedPlan
          ? `Pro (${matchedPlan.billingCycle === "monthly" ? "Monthly" : "Annual"})`
          : "Pro",
      },
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json<ErrorResponse>(
      { error: error instanceof Error ? error.message : "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
