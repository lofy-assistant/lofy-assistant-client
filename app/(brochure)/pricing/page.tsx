"use client";

import AppNavbar from "@/components/app-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { plans } from "@/lib/stripe-plans";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const monthlyPlan = plans.find((p) => p.billingCycle === "monthly")!;
  const yearlyPlan = plans.find((p) => p.billingCycle === "yearly")!;
  const monthlySavings = (monthlyPlan.price * 12 - yearlyPlan.price).toFixed(0);

  // WhatsApp configuration
  const whatsappNumber = "60178230685";
  const whatsappMessage = encodeURIComponent("Hey, I just get started");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    // Check if user is logged in via API
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/check-session");
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

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
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(false);
    }
  };

  const features = [
    "Limitless reminder",
    "Smart calendar integration",
    "Centralized task management",
    "Save memories forever",
    "AI-powered assistance",
    "Multi-device sync",
    "Priority support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AppNavbar />
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Pricing
          </h1>
          <p className="max-w-3xl mx-auto text-md md:text-xl text-gray-600">
            Try it free for 14 days — upgrade to continue.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12 gap-4">
          <span className={`text-lg font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-lg font-medium ${billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"}`}>
            Yearly
          </span>
          {billingCycle === "yearly" && (
            <Badge variant="emerald" className="ml-2">
              Save ${monthlySavings}
            </Badge>
          )}
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-lg py-3">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CardTitle className="text-2xl font-bold">Pro Plan</CardTitle>
                {billingCycle === "yearly" && (
                  <Badge variant="indigo" className="ml-3">
                    25% OFF
                  </Badge>
                )}
              </div>
              <CardDescription>
                Everything you need to stay organized and productive
              </CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold text-gray-900">
                  ${billingCycle === "monthly" ? monthlyPlan.price : yearlyPlan.price}
                </span>
                <span className="text-gray-600">
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
              {billingCycle === "yearly" && (
                <p className="mt-2 text-sm text-gray-500">
                  ${(yearlyPlan.price / 12).toFixed(2)} per month, billed annually
                </p>
              )}
              <div className="mt-3">
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
                className="w-full text-lg py-6 cursor-pointer"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Try Lofy for Free"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs md:text-sm text-gray-500">
            No credit card required for trial • Cancel anytime • Secure payments
          </p>
        </div>
      </div>
    </div>
  );
}
