"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
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

    const applyGeo = (country: string | null, currency: "usd" | "myr") => {
      if (!cancelled) {
        setDisplayCurrency(currency);
      }
    };

    fetch("/api/geo")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Geo failed"))))
      .then((data: { country: string | null; currency: string }) => {
        applyGeo(data.country, data.currency as "usd" | "myr");
      })
      .catch(() => {
        const locale =
          typeof navigator !== "undefined"
            ? navigator.language ??
              (typeof navigator.languages !== "undefined" ? navigator.languages[0] : undefined)
            : undefined;
        const country = locale?.toLowerCase().endsWith("-my") ? "MY" : undefined;
        applyGeo(country ?? null, resolveCurrency(country) as "usd" | "myr");
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
        body: JSON.stringify({
          billingCycle,
          tierId,
        }),
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge variant="indigo" className="mb-4">
            {PRICING_PAGE_COPY.badge}
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            {PRICING_PAGE_COPY.headline}
          </h1>
          <p className="max-w-3xl mx-auto text-md md:text-xl text-gray-600">
            {PRICING_PAGE_COPY.subhead}
          </p>
        </div>

        <p className="mb-3 text-center text-sm text-muted-foreground">{PRICING_PAGE_COPY.billingTabsHint}</p>

        <div className="mb-12 flex justify-center">
          <Tabs
            value={billingCycle}
            onValueChange={(v) => setBillingCycle(v as BillingCycle)}
            className="w-full max-w-2xl"
          >
            <TabsList className="grid h-auto w-full grid-cols-3 gap-1 p-1">
              <TabsTrigger value="monthly" className="flex-col gap-0.5 py-2.5 text-xs sm:text-sm">
                <span>1 Month</span>
              </TabsTrigger>
              <TabsTrigger value="quarterly" className="flex-col gap-0.5 py-2.5 text-xs sm:text-sm">
                <span>3 Months</span>
                <span className="text-[10px] font-semibold text-emerald-600 sm:text-xs">[{pctQuarterly}%]</span>
              </TabsTrigger>
              <TabsTrigger value="yearly" className="flex-col gap-0.5 py-2.5 text-xs sm:text-sm">
                <span>12 Months</span>
                <span className="text-[10px] font-semibold text-emerald-600 sm:text-xs">[{pctYearly}%]</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const prices = getListPriceMoney(tier.id, billingCycle);
            const yearlyMoney = getListPriceMoney(tier.id, "yearly");
            const quarterlyMoney = getListPriceMoney(tier.id, "quarterly");
            const canCheckout = checkoutAvailableFor(tier.id, billingCycle);
            const isEnterprise = tier.id === "enterprise";

            const priceFormatted =
              prices &&
              `${currencySymbol}${formatMoney(displayCurrency === "myr" ? prices.myr : prices.usd)}`;

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
                  "flex flex-col py-3 border-2 transition-all hover:shadow-xl",
                  tier.id === "premium" && "border-primary/35 lg:scale-[1.02] lg:z-[1]"
                )}
              >
                <CardHeader className="text-center">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                    {tier.id === "pro" && (
                      <Badge variant="indigo" className="text-xs">
                        Start here
                      </Badge>
                    )}
                    {tier.id === "premium" && (
                      <Badge variant="indigo" className="text-xs">
                        Most automation
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base pt-1">{tier.shortDescription}</CardDescription>

                  {tier.id === "pro" && (
                    <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-left">
                      <Badge variant="emerald" className="mb-2">
                        {PRICING_PAGE_COPY.trialBadge}
                      </Badge>
                      <p className="text-sm text-gray-700 font-medium">{PRICING_PAGE_COPY.trialDetail}</p>
                      <a
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        Check dashboard for details →
                      </a>
                    </div>
                  )}

                  <div className="mt-6">
                    {isEnterprise ? (
                      <>
                        <p className="text-sm text-gray-600 mb-2">Investment</p>
                        <span className="text-4xl font-bold sm:text-5xl">{PRICING_PAGE_COPY.enterprisePriceLabel}</span>
                        <p className="text-sm text-gray-500 mt-2">We&apos;ll scope seats, integrations, and security together.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 mb-2">{tier.id === "pro" ? "Then" : "From"}</p>
                        <span className="text-4xl font-bold sm:text-5xl">{priceFormatted}</span>
                        <span className="text-gray-600 text-lg">/{periodSuffix}</span>
                      </>
                    )}
                  </div>
                  {!isEnterprise && billingCycle === "yearly" && perMonthFromYearly && (
                    <p className="text-sm text-gray-500 mt-1">
                      {currencySymbol}
                      {perMonthFromYearly} per month, billed annually
                    </p>
                  )}
                  {!isEnterprise && billingCycle === "quarterly" && perMonthFromQuarterly && (
                    <p className="text-sm text-gray-500 mt-1">
                      {currencySymbol}
                      {perMonthFromQuarterly} per month, billed every 3 months
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">This tier</p>
                  <ul className="space-y-2 mb-6">
                    {tier.tierHighlights.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex-col gap-2 pt-0">
                  {isEnterprise ? (
                    <Button
                      asChild
                      className="w-full text-base py-6 cursor-pointer hover:scale-[1.02] transition-transform"
                      size="lg"
                      variant="default"
                    >
                      <a href={getEnterpriseMailtoHref()}>{PRICING_PAGE_COPY.ctaEnterprise}</a>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => handleCheckout(tier.id)}
                      className="w-full text-base py-6 cursor-pointer hover:scale-[1.02] transition-transform"
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
          <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">Common questions</h2>
          <dl className="space-y-6">
            {PRICING_FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-lg border border-gray-200 bg-white/80 px-5 py-4 shadow-sm"
              >
                <dt className="font-medium text-gray-900">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">{PRICING_PAGE_COPY.footnote}</p>
        </div>
      </div>
    </div>
  );
}
