import type { SubscriptionTierId } from "@/lib/pricing-model";
import { TIER_LIST_PRICES } from "@/lib/pricing-model";

/** Resolve Stripe currency from country (use country, not locale). */
export function resolveCurrency(country?: string): string {
  return country === "MY" ? "myr" : "usd";
}

/** Resolve currency from IP-derived country (e.g. Vercel x-vercel-ip-country). */
export function resolveCurrencyFromIP(country?: string): "myr" | "usd" {
  if (country === "MY") return "myr";
  return "usd";
}

export type BillingCycle = "monthly" | "quarterly" | "yearly";

export interface StripeSubscriptionPlan {
  tierId: SubscriptionTierId;
  tierName: string;
  billingCycle: BillingCycle;
  /** Stripe Price id (single catalog price; presentment may be localized in Stripe / Payment Links). */
  priceId: string;
  priceUsd: number;
  priceMyr: number;
  duration: string;
  link: string;
}

/**
 * True when using live-mode Stripe catalog (live price ids).
 * Server: prefers STRIPE_SECRET_KEY prefix so catalog matches the API key.
 * Client: STRIPE_SECRET_KEY is absent, so uses NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, then NODE_ENV.
 */
export function stripeCatalogLive(): boolean {
  const sk = process.env.STRIPE_SECRET_KEY ?? "";
  if (sk.startsWith("sk_live_")) return true;
  if (sk.startsWith("sk_test_")) return false;

  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  if (pk.startsWith("pk_live_")) return true;
  if (pk.startsWith("pk_test_")) return false;

  return process.env.NODE_ENV !== "development";
}

/** Test mode (Stripe test dashboard) — Pro product prices */
const DEV_PRO_MONTHLY_USD = "price_1StNzuBSILEw5PUUDdMQudxW";
const DEV_PRO_YEARLY_USD = "price_1StO0RBSILEw5PUU1o2Xt1BT";

/** Live: Lofy Assistant Pro (Monthly) prod_Tr92JzpBMcbseh */
const LIVE_PRO_MONTHLY_USD = "price_1TNKMUPXWy5Z5igtzipoeYLU";
const LIVE_PRO_MONTHLY_PAYMENT_LINK = "https://buy.stripe.com/6oU9AV8XC1Xe8yV1jCdEs0a";
/** Live: Lofy Assistant Pro (Quarterly) prod_UM2TQ3eFebLolk */
const LIVE_PRO_QUARTERLY_USD = "price_1TNKOCPXWy5Z5igtqIZFTPql";
const LIVE_PRO_QUARTERLY_PAYMENT_LINK = "https://buy.stripe.com/dRmeVfgq47hy02pd2kdEs08";
/** Live: Lofy Assistant Pro (Yearly) prod_Tr92L47uQWWpLk */
const LIVE_PRO_YEARLY_USD = "price_1TNKKJPXWy5Z5igtkoMyPMkE";
const LIVE_PRO_YEARLY_PAYMENT_LINK = "https://buy.stripe.com/4gM3cx2ze59q3eB6DWdEs09";

function proStripePlans(): StripeSubscriptionPlan[] {
  const live = stripeCatalogLive();
  const p = TIER_LIST_PRICES.pro!;
  const monthlyUsd = live ? LIVE_PRO_MONTHLY_USD : DEV_PRO_MONTHLY_USD;

  const rows: StripeSubscriptionPlan[] = [
    {
      tierId: "pro",
      tierName: "Pro",
      billingCycle: "monthly",
      priceId: monthlyUsd,
      priceUsd: p.monthly.usd,
      priceMyr: p.monthly.myr,
      duration: "/month",
      link: live ? LIVE_PRO_MONTHLY_PAYMENT_LINK : "https://buy.stripe.com/test_4gM00i40H5qWarl9fD2VG00",
    },
  ];

  if (live) {
    rows.push({
      tierId: "pro",
      tierName: "Pro",
      billingCycle: "quarterly",
      priceId: LIVE_PRO_QUARTERLY_USD,
      priceUsd: p.quarterly.usd,
      priceMyr: p.quarterly.myr,
      duration: "/3 months",
      link: LIVE_PRO_QUARTERLY_PAYMENT_LINK,
    });
  }

  const yearlyUsd = live ? LIVE_PRO_YEARLY_USD : DEV_PRO_YEARLY_USD;

  rows.push({
    tierId: "pro",
    tierName: "Pro",
    billingCycle: "yearly",
    priceId: yearlyUsd,
    priceUsd: p.yearly.usd,
    priceMyr: p.yearly.myr,
    duration: "/year",
    link: live ? LIVE_PRO_YEARLY_PAYMENT_LINK : "https://buy.stripe.com/test_fZu14mdBh1aGdDxezX2VG01",
  });

  return rows;
}

/**
 * Premium self-serve checkout: add Stripe price ids here when ready (same pattern as Pro).
 * Until then, Premium stays sales-led / "Coming soon" on the pricing page.
 */
function optionalPremiumStripePlans(): StripeSubscriptionPlan[] {
  return [];
}

/** Resolves plans for the current Stripe mode (test vs live). Call on each server request. */
export function getStripeSubscriptionPlans(): StripeSubscriptionPlan[] {
  return [...proStripePlans(), ...optionalPremiumStripePlans()];
}

/** @deprecated Use getStripeSubscriptionPlans() */
export function plans(): StripeSubscriptionPlan[] {
  return getStripeSubscriptionPlans();
}

export function getStripePlan(
  tierId: SubscriptionTierId,
  billingCycle: BillingCycle
): StripeSubscriptionPlan | undefined {
  return getStripeSubscriptionPlans().find((p) => p.tierId === tierId && p.billingCycle === billingCycle);
}

/** Webhook stores the Stripe Price id used at checkout. */
export function planUsesStripePriceId(plan: StripeSubscriptionPlan, stripePriceId: string): boolean {
  return plan.priceId === stripePriceId;
}

export function checkoutAvailableFor(tierId: SubscriptionTierId, billingCycle: BillingCycle): boolean {
  if (tierId === "enterprise") return false;
  return getStripeSubscriptionPlans().some((p) => p.tierId === tierId && p.billingCycle === billingCycle);
}

/** True if the tier has at least one Stripe-backed checkout option. */
export function checkoutAvailableForTier(tierId: SubscriptionTierId): boolean {
  if (tierId === "enterprise") return false;
  return getStripeSubscriptionPlans().some((p) => p.tierId === tierId);
}
