/**
 * Three-tier pricing: Pro (self-serve), Premium (self-serve when Stripe is configured),
 * Enterprise (contact sales). List prices are marketing only; Stripe billing uses one
 * Price id per plan in stripe-plans.ts (Pro: monthly, quarterly, yearly). Checkout may
 * show RM vs $ on this site from geo; Stripe handles charge currency for that price.
 */

export const TRIAL_DAYS = 14;

export type SubscriptionTierId = "pro" | "premium" | "enterprise";

export type BillingCycleKey = "monthly" | "quarterly" | "yearly";

export interface MoneyPair {
  usd: number;
  myr: number;
}

export interface SubscriptionTierDefinition {
  id: SubscriptionTierId;
  name: string;
  shortDescription: string;
  tierHighlights: readonly string[];
}

export const SUBSCRIPTION_TIERS: readonly SubscriptionTierDefinition[] = [
  {
    id: "pro",
    name: "Pro",
    shortDescription: "For individuals who want Lofy on WhatsApp with smart context and social features.",
    tierHighlights: [
      "Context-aware AI: uses your timezone, profile, and conversation so answers and actions stay relevant",
      "RAG knowledge base: pulls from what you saved so answers stay grounded in your own facts",
      "Apps integration: WhatsApp plus calendar providers (for example Google Calendar; more as they ship)",
      "Friends: reminders to accepted friends and sharing memories you own",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    shortDescription: "For power users and small teams who want automation beyond single-shot commands.",
    tierHighlights: [
      "Everything in Pro",
      "Recipes: reusable workflows you can save, tweak, and run again",
      "Execution agent: multi-step runs that plan, use tools, and report outcomes back to you",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    shortDescription: "For organizations that need governance, priority support, and a tailored rollout.",
    tierHighlights: [
      "Everything in Premium",
      "Dedicated onboarding and a named success contact",
      "SLA-style response targets and priority support routing",
      "Security and scale: SSO or SAML path, audit-friendly exports, custom terms and integrations where needed",
    ],
  },
] as const;

/** null = custom / contact sales (Enterprise). */
export const TIER_LIST_PRICES: Record<
  SubscriptionTierId,
  Record<BillingCycleKey, MoneyPair> | null
> = {
  pro: {
    monthly: { usd: 4.99, myr: 14.99 },
    quarterly: { usd: 13.49, myr: 40.49 },
    yearly: { usd: 44.99, myr: 134.99 },
  },
  premium: {
    monthly: { usd: 14.99, myr: 44.99 },
    quarterly: { usd: 40.99, myr: 122.99 },
    yearly: { usd: 139.99, myr: 419.99 },
  },
  enterprise: null,
};

export function getListPriceMoney(
  tierId: SubscriptionTierId,
  cycle: BillingCycleKey
): MoneyPair | null {
  const row = TIER_LIST_PRICES[tierId];
  if (!row) return null;
  return row[cycle];
}

/** Savings vs paying monthly for the same number of months (USD basis). */
export function savingsVsMonthlyStreak(
  monthly: MoneyPair,
  bundle: MoneyPair,
  months: number
): MoneyPair {
  return {
    usd: monthly.usd * months - bundle.usd,
    myr: monthly.myr * months - bundle.myr,
  };
}

export function annualSavings(m: MoneyPair, y: MoneyPair): MoneyPair {
  return savingsVsMonthlyStreak(m, y, 12);
}

/**
 * Rounded discount vs monthly list, using USD (tabs use Pro tier as the headline %).
 */
export function listPriceDiscountPercentUsd(
  tierId: Exclude<SubscriptionTierId, "enterprise">,
  cycle: Exclude<BillingCycleKey, "monthly">
): number {
  const m = TIER_LIST_PRICES[tierId]!.monthly;
  const bundle = TIER_LIST_PRICES[tierId]![cycle];
  const months = cycle === "quarterly" ? 3 : 12;
  const baseline = m.usd * months;
  return Math.max(0, Math.round((1 - bundle.usd / baseline) * 100));
}

/** Tab badge uses Pro list prices so the bar shows one clear story. */
export function tabDiscountPercent(cycle: Exclude<BillingCycleKey, "monthly">): number {
  return listPriceDiscountPercentUsd("pro", cycle);
}

export const PRICING_PAGE_COPY = {
  badge: "Pricing",
  headline: "Pro, Premium, and Enterprise: pick how much automation you need.",
  subhead:
    "Pro is the fast start on WhatsApp. Premium adds recipes and an execution agent. Enterprise is built for teams that need governance and a white-glove rollout.",
  trialBadge: `${TRIAL_DAYS} Days Free Trial`,
  trialDetail: "Trial starts after your first message with Lofy",
  cta: "Subscribe",
  ctaUnavailable: "Coming soon",
  ctaEnterprise: "Contact us",
  enterprisePriceLabel: "Custom",
  footnote: "Self-serve checkout is powered by Stripe where enabled. Cancel anytime on subscribed plans.",
  billingTabsHint: "Billing applies to Pro and Premium. Enterprise is quoted separately.",
};

export const PRICING_FAQ: readonly { q: string; a: string }[] = [
  {
    q: "What is the execution agent?",
    a: "It is Lofy's multi-step mode: it can break a goal into steps, call the right tools, and return a clear result. That helps when one message would otherwise need several back-and-forth turns.",
  },
  {
    q: "What are recipes?",
    a: "Recipes are reusable workflows you define once, like a checklist or playbook, and run whenever you need them so repeat work stays consistent.",
  },
  {
    q: "Should I choose Pro or Premium?",
    a: "Choose Pro if you want Lofy on WhatsApp with strong context, a personal knowledge base, calendar hooks, and friends features. Choose Premium when you want everything in Pro plus recipes you can reuse and the execution agent for longer, tool-using runs.",
  },
  {
    q: "Where do I use Lofy?",
    a: "Lofy is built around WhatsApp as the primary place you chat and get things done. Calendar and other integrations connect so scheduling and context stay in sync where we support them.",
  },
  {
    q: "What is the knowledge base (RAG)?",
    a: "You can save facts and notes Lofy should remember. Answers can pull from what you saved so replies stay grounded in your own information instead of generic guesses.",
  },
  {
    q: "How do monthly, quarterly, and yearly billing differ?",
    a: "You pick how often you are billed. Longer plans are priced lower per month than paying one month at a time, which is why the quarterly and yearly tabs show a savings badge. You can switch plans through billing when your account supports it.",
  },
  {
    q: "What happens after the trial?",
    a: `Your first message starts a ${TRIAL_DAYS}-day trial. After that, an active subscription (Pro or Premium, when checkout is enabled) keeps full access for that tier.`,
  },
  {
    q: "Can I cancel or change my plan?",
    a: "Self-serve subscriptions are managed through Stripe where checkout is enabled. You can cancel before the next renewal so you are not charged again; upgrade or downgrade paths depend on what we expose in the product and billing UI at the time.",
  },
  {
    q: "How do friends and reminders work?",
    a: "On Pro, you can work with accepted friends: for example, reminders can go to their number, and you can share memories you own when that fits your workflow. Permissions respect who accepted what.",
  },
];

export function getTierById(id: SubscriptionTierId): SubscriptionTierDefinition {
  const t = SUBSCRIPTION_TIERS.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown tier: ${id}`);
  return t;
}

/** Sales inbox for Enterprise. Override with NEXT_PUBLIC_ENTERPRISE_SALES_EMAIL. */
export function getEnterpriseSalesEmail(): string {
  return (
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ENTERPRISE_SALES_EMAIL) ||
    "business@lofy-ai.com"
  );
}

export function getEnterpriseMailtoHref(): string {
  const email = getEnterpriseSalesEmail();
  const subject = encodeURIComponent("Lofy Enterprise inquiry");
  return `mailto:${email}?subject=${subject}`;
}
