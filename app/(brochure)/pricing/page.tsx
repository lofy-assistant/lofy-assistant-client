"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { plans, resolveCurrency } from "@/lib/stripe-plans";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<"usd" | "myr">("usd");
  const [countryForCheckout, setCountryForCheckout] = useState<string | undefined>(undefined);

  const monthlyPlan = plans.find((p) => p.billingCycle === "monthly")!;
  const yearlyPlan = plans.find((p) => p.billingCycle === "yearly")!;

  // Detect user's country and currency
  useEffect(() => {
    let cancelled = false;

    const applyGeo = (country: string | null, currency: "usd" | "myr") => {
      if (!cancelled) {
        setDisplayCurrency(currency);
        if (country) setCountryForCheckout(country);
      }
    };

    fetch("/api/geo")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Geo failed"))))
      .then((data: { country: string | null; currency: string }) => {
        applyGeo(data.country, data.currency as "usd" | "myr");
      })
      .catch(() => {
        // Fallback to browser locale
        const locale = typeof navigator !== "undefined"
          ? navigator.language ?? (typeof navigator.languages !== "undefined" ? navigator.languages[0] : undefined)
          : undefined;
        const country = locale?.toLowerCase().endsWith("-my") ? "MY" : undefined;
        applyGeo(country ?? null, resolveCurrency(country) as "usd" | "myr");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currencySymbol = displayCurrency === "myr" ? "RM" : "$";
  const monthlyPrice = displayCurrency === "myr" ? monthlyPlan.priceMyr : monthlyPlan.priceUsd;
  const yearlyPrice = displayCurrency === "myr" ? yearlyPlan.priceMyr : yearlyPlan.priceUsd;
  const monthlySavings = (monthlyPrice * 12 - yearlyPrice).toFixed(0);

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billingCycle,
          ...(countryForCheckout && { country: countryForCheckout }),
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(false);
    }
  };

  const features = [
    "Limitless reminders",
    "Smart calendar integration",
    "Centralized task management",
    "Save memories forever",
    "AI-powered assistance",
    "Multi-device sync",
    "Priority support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge variant="indigo" className="mb-4">
            Pricing
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="max-w-3xl mx-auto text-md md:text-xl text-gray-600">
            Try it free for 14 days — no credit card required.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12 gap-4">
          <span className={`text-lg font-medium transition-colors ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-400 hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
            aria-label="Toggle billing cycle"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-gray-900 transition-transform ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
          <span className={`text-lg font-medium transition-colors ${billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"}`}>
            Yearly
          </span>

        </div>

        {/* Pricing Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-lg py-3 border-2 hover:border-primary/20 transition-all hover:shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center">
                <CardTitle className="text-2xl font-bold">Basic Plan</CardTitle>
                {billingCycle === "yearly" && (
                  <Badge variant="indigo" className="ml-3">
                    25% OFF
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base">
                Everything you need to stay organized and productive
              </CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold">
                  {currencySymbol}{billingCycle === "monthly" ? monthlyPrice : yearlyPrice}
                </span>
                <span className="text-gray-600 text-lg">
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
              {billingCycle === "yearly" && (
                <Badge variant="emerald" className="mx-auto mt-2">
                  Save {currencySymbol}{monthlySavings}
                </Badge>
              )}
              {billingCycle === "yearly" && (
                <p className="text-sm text-gray-500">
                  {currencySymbol}{(yearlyPrice / 12).toFixed(2)} per month, billed annually
                </p>
              )}
              <div className="mt-1">
                <Badge variant="emerald" className="text-sm">
                  14 Days Free Trial
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGetStarted}
                className="w-full text-lg py-6 cursor-pointer hover:scale-[1.02] transition-transform"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Start Free Trial"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            No credit card required • Cancel anytime • Secure payments powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
