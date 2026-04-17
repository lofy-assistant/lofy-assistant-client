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
  /** Stripe Price id (typically USD). */
  priceId: string;
  /** When set, MY checkout uses this Price (MYR) instead of `priceId`. */
  priceIdMyr?: string;
  priceUsd: number;
  priceMyr: number;
  duration: string;
  link: string;
}

const isDev = process.env.NODE_ENV === "development";

/** Live: Lofy Assistant Pro (Monthly) prod_Tr92JzpBMcbseh */
const LIVE_PRO_MONTHLY_USD = "price_1TNKMUPXWy5Z5igtzipoeYLU";
const LIVE_PRO_MONTHLY_MYR = "price_1TNKPWPXWy5Z5igtBitYRzrI";
const LIVE_PRO_MONTHLY_PAYMENT_LINK = "https://buy.stripe.com/6oU9AV8XC1Xe8yV1jCdEs0a";
/** Live: Lofy Assistant Pro (Quarterly) prod_UM2TQ3eFebLolk */
const LIVE_PRO_QUARTERLY_USD = "price_1TNKOCPXWy5Z5igtqIZFTPql";
const LIVE_PRO_QUARTERLY_MYR = "price_1TNKPYPXWy5Z5igtTZwhXlMC";
const LIVE_PRO_QUARTERLY_PAYMENT_LINK = "https://buy.stripe.com/dRmeVfgq47hy02pd2kdEs08";
/** Live: Lofy Assistant Pro (Yearly) prod_Tr92L47uQWWpLk */
const LIVE_PRO_YEARLY_USD = "price_1TNKKJPXWy5Z5igtkoMyPMkE";
const LIVE_PRO_YEARLY_MYR = "price_1TNKPYPXWy5Z5igtPzfO5XYi";
const LIVE_PRO_YEARLY_PAYMENT_LINK = "https://buy.stripe.com/4gM3cx2ze59q3eB6DWdEs09";

function proStripePlans(): StripeSubscriptionPlan[] {
  const p = TIER_LIST_PRICES.pro!;
  const monthlyUsd =
    process.env.STRIPE_PRICE_PRO_MONTHLY ||
    (isDev ? "price_1StNzuBSILEw5PUUDdMQudxW" : LIVE_PRO_MONTHLY_USD);
  const monthlyMyr =
    process.env.STRIPE_PRICE_PRO_MONTHLY_MYR ||
    (isDev ? undefined : LIVE_PRO_MONTHLY_MYR);

  const rows: StripeSubscriptionPlan[] = [
    {
      tierId: "pro",
      tierName: "Pro",
      billingCycle: "monthly",
      priceId: monthlyUsd,
      priceIdMyr: monthlyMyr,
      priceUsd: p.monthly.usd,
      priceMyr: p.monthly.myr,
      duration: "/month",
      link: isDev
        ? "https://buy.stripe.com/test_4gM00i40H5qWarl9fD2VG00"
        : LIVE_PRO_MONTHLY_PAYMENT_LINK,
    },
  ];

  const quarterlyUsd =
    process.env.STRIPE_PRICE_PRO_QUARTERLY || LIVE_PRO_QUARTERLY_USD;
  const quarterlyMyr =
    process.env.STRIPE_PRICE_PRO_QUARTERLY_MYR ||
    (!isDev ? LIVE_PRO_QUARTERLY_MYR : undefined);

  rows.push({
    tierId: "pro",
    tierName: "Pro",
    billingCycle: "quarterly",
    priceId: quarterlyUsd,
    priceIdMyr: quarterlyMyr,
    priceUsd: p.quarterly.usd,
    priceMyr: p.quarterly.myr,
    duration: "/3 months",
    link: LIVE_PRO_QUARTERLY_PAYMENT_LINK,
  });

  const yearlyUsd =
    process.env.STRIPE_PRICE_PRO_YEARLY ||
    (isDev ? "price_1StO0RBSILEw5PUU1o2Xt1BT" : LIVE_PRO_YEARLY_USD);
  const yearlyMyr =
    process.env.STRIPE_PRICE_PRO_YEARLY_MYR || (!isDev ? LIVE_PRO_YEARLY_MYR : undefined);

  rows.push({
    tierId: "pro",
    tierName: "Pro",
    billingCycle: "yearly",
    priceId: yearlyUsd,
    priceIdMyr: yearlyMyr,
    priceUsd: p.yearly.usd,
    priceMyr: p.yearly.myr,
    duration: "/year",
    link: isDev
      ? "https://buy.stripe.com/test_fZu14mdBh1aGdDxezX2VG01"
      : LIVE_PRO_YEARLY_PAYMENT_LINK,
  });

  return rows;
}

function optionalPremiumStripePlans(): StripeSubscriptionPlan[] {
  const monthlyId =
    process.env.STRIPE_PRICE_PREMIUM_MONTHLY ?? process.env.STRIPE_PRICE_BUSINESS_MONTHLY;
  const yearlyId =
    process.env.STRIPE_PRICE_PREMIUM_YEARLY ?? process.env.STRIPE_PRICE_BUSINESS_YEARLY;
  const quarterlyId = process.env.STRIPE_PRICE_PREMIUM_QUARTERLY;
  const p = TIER_LIST_PRICES.premium!;
  const out: StripeSubscriptionPlan[] = [];
  if (monthlyId) {
    out.push({
      tierId: "premium",
      tierName: "Premium",
      billingCycle: "monthly",
      priceId: monthlyId,
      priceUsd: p.monthly.usd,
      priceMyr: p.monthly.myr,
      duration: "/month",
      link: "",
    });
  }
  if (quarterlyId) {
    out.push({
      tierId: "premium",
      tierName: "Premium",
      billingCycle: "quarterly",
      priceId: quarterlyId,
      priceUsd: p.quarterly.usd,
      priceMyr: p.quarterly.myr,
      duration: "/3 months",
      link: "",
    });
  }
  if (yearlyId) {
    out.push({
      tierId: "premium",
      tierName: "Premium",
      billingCycle: "yearly",
      priceId: yearlyId,
      priceUsd: p.yearly.usd,
      priceMyr: p.yearly.myr,
      duration: "/year",
      link: "",
    });
  }
  return out;
}

/** Stripe-backed rows only (Enterprise is always sales-led). */
export const stripeSubscriptionPlans: StripeSubscriptionPlan[] = [
  ...proStripePlans(),
  ...optionalPremiumStripePlans(),
];

/** @deprecated Prefer stripeSubscriptionPlans */
export const plans = stripeSubscriptionPlans;

export function getStripePlan(
  tierId: SubscriptionTierId,
  billingCycle: BillingCycle
): StripeSubscriptionPlan | undefined {
  return stripeSubscriptionPlans.find((p) => p.tierId === tierId && p.billingCycle === billingCycle);
}

/** Webhook stores whichever Price id was used (USD or MYR). */
export function planUsesStripePriceId(plan: StripeSubscriptionPlan, stripePriceId: string): boolean {
  return plan.priceId === stripePriceId || plan.priceIdMyr === stripePriceId;
}

export function checkoutAvailableFor(tierId: SubscriptionTierId, billingCycle: BillingCycle): boolean {
  if (tierId === "enterprise") return false;
  return stripeSubscriptionPlans.some((p) => p.tierId === tierId && p.billingCycle === billingCycle);
}

/** True if the tier has at least one Stripe-backed checkout option. */
export function checkoutAvailableForTier(tierId: SubscriptionTierId): boolean {
  if (tierId === "enterprise") return false;
  return stripeSubscriptionPlans.some((p) => p.tierId === tierId);
}
