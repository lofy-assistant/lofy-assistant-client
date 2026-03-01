import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/database";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface SuccessResponse {
  success: true;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST() {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      return NextResponse.json<ErrorResponse>({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json<ErrorResponse>({ error: "Invalid session" }, { status: 401 });
    }

    // ── Resolve subscription from DB (never trust client-supplied IDs) ────────
    const localSub = await prisma.subscriptions.findFirst({
      where: { user_id: session.userId },
      select: {
        id: true,
        stripe_customer_id: true,
        subscription_status: true,
        current_period_end: true,
      },
    });

    if (!localSub?.stripe_customer_id) {
      return NextResponse.json<ErrorResponse>(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Guard: don't allow double-cancellation
    if (
      localSub.subscription_status === "canceled" ||
      localSub.subscription_status === "cancel_at_period_end"
    ) {
      return NextResponse.json<ErrorResponse>(
        { error: "Subscription is already canceled or pending cancellation" },
        { status: 409 }
      );
    }

    // ── Find the active Stripe subscription for this customer ─────────────────
    // Try "active" first; fall back to any non-canceled status (e.g. trialing, past_due)
    const activeList = await stripe.subscriptions.list({
      customer: localSub.stripe_customer_id,
      status: "active",
      limit: 5,
    });

    let targetSub = activeList.data[0];

    if (!targetSub) {
      const allList = await stripe.subscriptions.list({
        customer: localSub.stripe_customer_id,
        limit: 10,
      });
      targetSub = allList.data.find((s) => s.status !== "canceled") ?? null!;
    }

    if (!targetSub) {
      return NextResponse.json<ErrorResponse>(
        { error: "No active Stripe subscription found" },
        { status: 404 }
      );
    }

    // ── Cancel at period end (graceful — user keeps access until billing end) ─
    const updated = await stripe.subscriptions.update(targetSub.id, {
      cancel_at_period_end: true,
    });

    const rawUpdated = updated as unknown as Record<string, unknown>;
    const periodEndTs = rawUpdated.current_period_end;
    const periodEnd =
      typeof periodEndTs === "number" && periodEndTs > 0
        ? new Date(periodEndTs * 1000)
        : localSub.current_period_end;

    // ── Sync DB optimistically; webhook (customer.subscription.updated) will
    //    also fire and keep everything consistent via the existing handler ──────
    await prisma.subscriptions.update({
      where: { id: localSub.id },
      data: {
        // We use a custom internal status to distinguish "active but will cancel"
        // from "active and will renew". The GET route exposes this to the client.
        subscription_status: "cancel_at_period_end",
        current_period_end: periodEnd,
      },
    });

    return NextResponse.json<SuccessResponse>({
      success: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: periodEnd.toISOString(),
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json<ErrorResponse>(
      { error: error instanceof Error ? error.message : "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
