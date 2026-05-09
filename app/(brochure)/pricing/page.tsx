"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkoutAvailableFor,
  getStripePlan,
  resolveCurrency,
  type BillingCycle,
} from "@/lib/stripe-plans";
import type { SubscriptionTierId } from "@/lib/pricing-model";
import {
  PRICING_FAQ,
  PRICING_PAGE_COPY,
  SUBSCRIPTION_TIERS,
  getEnterpriseMailtoHref,
  getListPriceMoney,
  tabDiscountPercent,
} from "@/lib/pricing-model";
import { cn } from "@/lib/utils";

function formatMoney(amount: number): string {
  return amount.toFixed(2);
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [loadingTier, setLoadingTier] = useState<SubscriptionTierId | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<"usd" | "myr">("usd");

  const pctQuarterly = tabDiscountPercent("quarterly");
  const pctYearly = tabDiscountPercent("yearly");

  useEffect(() => {
    let cancelled = false;

    const applyGeo = (currency: "usd" | "myr") => {
      if (!cancelled) setDisplayCurrency(currency);
    };

    fetch("/api/geo")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Geo failed"))))
      .then((data: { country: string | null; currency: string }) => {
        applyGeo(data.currency as "usd" | "myr");
      })
      .catch(() => {
        const locale =
          typeof navigator !== "undefined"
            ? navigator.language ?? (typeof navigator.languages !== "undefined" ? navigator.languages[0] : undefined)
            : undefined;
        const country = locale?.toLowerCase().endsWith("-my") ? "MY" : undefined;
        applyGeo(resolveCurrency(country) as "usd" | "myr");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currencySymbol = displayCurrency === "myr" ? "RM" : "$";

  const handleCheckout = async (tierId: SubscriptionTierId) => {
    if (!checkoutAvailableFor(tierId, billingCycle)) return;
    const plan = getStripePlan(tierId, billingCycle);
    if (!plan) return;

    if (plan.link.startsWith("https://")) {
      setLoadingTier(tierId);
      globalThis.location.assign(plan.link);
      return;
    }

    setLoadingTier(tierId);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingCycle, tierId }),
      });

      const data = await response.json();

      if (data.url) {
        globalThis.location.assign(data.url);
      } else {
        console.error("No checkout URL returned", data);
        setLoadingTier(null);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-marketing-bg">
      <section className="marketing-hero-bg border-b border-marketing-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-white/70 bg-white/80 text-marketing-accent-soft-foreground shadow-sm backdrop-blur-xl hover:bg-white/90">
              <Sparkles className="mr-2 size-3.5" />
              {PRICING_PAGE_COPY.badge}
            </Badge>
            <h1 className="marketing-heading mx-auto mb-4 max-w-4xl py-1 text-4xl font-bold leading-tight text-balance sm:text-6xl">
              {PRICING_PAGE_COPY.headline}
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-8 text-marketing-body md:text-xl">
              {PRICING_PAGE_COPY.subhead}
            </p>
          </div>

          <p className="mb-3 text-center text-sm text-marketing-body-muted">{PRICING_PAGE_COPY.billingTabsHint}</p>

          <div className="mb-12 flex justify-center">
            <Tabs
              value={billingCycle}
              onValueChange={(v) => setBillingCycle(v as BillingCycle)}
              className="w-full max-w-2xl"
            >
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-lg border border-white/70 bg-white/70 p-1 shadow-sm backdrop-blur-xl">
                <TabsTrigger value="monthly" className="flex-col gap-0.5 rounded-md py-2.5 text-xs sm:text-sm">
                  <span>1 Month</span>
                </TabsTrigger>
                <TabsTrigger value="quarterly" className="flex-col gap-0.5 rounded-md py-2.5 text-xs sm:text-sm">
                  <span>3 Months</span>
                  <span className="text-[10px] font-semibold text-marketing-accent sm:text-xs">Save {pctQuarterly}%</span>
                </TabsTrigger>
                <TabsTrigger value="yearly" className="flex-col gap-0.5 rounded-md py-2.5 text-xs sm:text-sm">
                  <span>12 Months</span>
                  <span className="text-[10px] font-semibold text-marketing-accent sm:text-xs">Save {pctYearly}%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {SUBSCRIPTION_TIERS.map((tier) => {
              const prices = getListPriceMoney(tier.id, billingCycle);
              const yearlyMoney = getListPriceMoney(tier.id, "yearly");
              const quarterlyMoney = getListPriceMoney(tier.id, "quarterly");
              const canCheckout = checkoutAvailableFor(tier.id, billingCycle);
              const isEnterprise = tier.id === "enterprise";

              const priceFormatted =
                prices && `${currencySymbol}${formatMoney(displayCurrency === "myr" ? prices.myr : prices.usd)}`;

              const perMonthFromYearly =
                !isEnterprise && yearlyMoney && billingCycle === "yearly"
                  ? formatMoney(displayCurrency === "myr" ? yearlyMoney.myr / 12 : yearlyMoney.usd / 12)
                  : null;

              const perMonthFromQuarterly =
                !isEnterprise && quarterlyMoney && billingCycle === "quarterly"
                  ? formatMoney(displayCurrency === "myr" ? quarterlyMoney.myr / 3 : quarterlyMoney.usd / 3)
                  : null;

              const periodSuffix =
                billingCycle === "monthly" ? "month" : billingCycle === "quarterly" ? "3 months" : "year";

              return (
                <Card
                  key={tier.id}
                  className={cn(
                    "marketing-card flex flex-col rounded-lg py-3 transition-all hover:-translate-y-1",
                    tier.id === "premium" && "border-marketing-accent/45 lg:z-[1] lg:scale-[1.02]"
                  )}
                >
                  <CardHeader className="text-center">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <CardTitle className="text-2xl font-bold text-marketing-chat-assistant-text">{tier.name}</CardTitle>
                      {tier.id === "pro" && (
                        <Badge className="border-marketing-border bg-marketing-accent-soft text-xs text-marketing-accent-soft-foreground hover:bg-marketing-accent-soft">
                          Start here
                        </Badge>
                      )}
                      {tier.id === "premium" && (
                        <Badge className="border-marketing-border bg-marketing-accent-soft text-xs text-marketing-accent-soft-foreground hover:bg-marketing-accent-soft">
                          Most automation
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="pt-1 text-base text-marketing-body">{tier.shortDescription}</CardDescription>

                    {tier.id === "pro" && (
                      <div className="mt-4 rounded-lg border border-marketing-border bg-marketing-accent-soft p-4 text-left">
                        <Badge className="mb-2 border-marketing-border bg-white/75 text-marketing-accent-soft-foreground hover:bg-white/75">
                          {PRICING_PAGE_COPY.trialBadge}
                        </Badge>
                        <p className="text-sm font-medium text-marketing-chat-assistant-text">{PRICING_PAGE_COPY.trialDetail}</p>
                        <a
                          href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                          className="mt-1 inline-flex items-center gap-1 text-sm text-marketing-accent hover:underline"
                        >
                          Check dashboard for details -&gt;
                        </a>
                      </div>
                    )}

                    <div className="mt-6">
                      {isEnterprise ? (
                        <>
                          <p className="mb-2 text-sm text-marketing-body">Investment</p>
                          <span className="text-4xl font-bold text-marketing-chat-assistant-text sm:text-5xl">
                            {PRICING_PAGE_COPY.enterprisePriceLabel}
                          </span>
                          <p className="mt-2 text-sm text-marketing-body-muted">
                            We&apos;ll scope seats, integrations, and security together.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-marketing-body">{tier.id === "pro" ? "Then" : "From"}</p>
                          <span className="text-4xl font-bold text-marketing-chat-assistant-text sm:text-5xl">
                            {priceFormatted}
                          </span>
                          <span className="text-lg text-marketing-body">/{periodSuffix}</span>
                        </>
                      )}
                    </div>
                    {!isEnterprise && billingCycle === "yearly" && perMonthFromYearly && (
                      <p className="mt-1 text-sm text-marketing-body-muted">
                        {currencySymbol}
                        {perMonthFromYearly} per month, billed annually
                      </p>
                    )}
                    {!isEnterprise && billingCycle === "quarterly" && perMonthFromQuarterly && (
                      <p className="mt-1 text-sm text-marketing-body-muted">
                        {currencySymbol}
                        {perMonthFromQuarterly} per month, billed every 3 months
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="mb-3 text-xs font-semibold uppercase text-marketing-body-muted">This tier</p>
                    <ul className="mb-6 space-y-2">
                      {tier.tierHighlights.map((line) => (
                        <li key={line} className="flex items-start gap-2 text-sm text-marketing-body">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-marketing-accent-soft">
                            <Check className="h-3 w-3 text-marketing-accent" />
                          </div>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-col gap-2 pt-0">
                    {isEnterprise ? (
                      <Button asChild className="w-full rounded-lg py-6 text-base" size="lg" variant="default">
                        <a href={getEnterpriseMailtoHref()}>{PRICING_PAGE_COPY.ctaEnterprise}</a>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => handleCheckout(tier.id)}
                        className="w-full rounded-lg py-6 text-base"
                        size="lg"
                        disabled={!canCheckout || loadingTier !== null}
                        variant={tier.id === "pro" || (tier.id === "premium" && canCheckout) ? "default" : "secondary"}
                      >
                        {loadingTier === tier.id ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : canCheckout ? (
                          PRICING_PAGE_COPY.cta
                        ) : (
                          PRICING_PAGE_COPY.ctaUnavailable
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <section className="mx-auto mt-16 max-w-3xl">
            <h2 className="mb-6 text-center text-xl font-semibold text-marketing-chat-assistant-text">Common questions</h2>
            <dl className="space-y-5">
              {PRICING_FAQ.map((item) => (
                <div
                  key={item.q}
                  className="rounded-lg border border-marketing-border bg-white/80 px-5 py-4 shadow-sm backdrop-blur-xl"
                >
                  <dt className="font-medium text-marketing-chat-assistant-text">{item.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-marketing-body">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-10 text-center">
            <p className="text-sm text-marketing-body-muted">{PRICING_PAGE_COPY.footnote}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
