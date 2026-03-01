"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { CreditCard, Loader2, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";

interface Subscription {
  id: string;
  status: string;
  priceId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  billingCycle: "monthly" | "yearly" | null;
  planLabel: string;
}

function statusConfig(status: string, cancelAtPeriodEnd: boolean) {
  if (cancelAtPeriodEnd) {
    return {
      label: "Cancels at period end",
      icon: <Clock className="w-3 h-3" />,
      textClass: "text-amber-600 dark:text-amber-400",
    };
  }
  switch (status) {
    case "active":
      return {
        label: "Active",
        icon: <CheckCircle2 className="w-3 h-3" />,
        textClass: "text-green-600 dark:text-green-400",
      };
    case "trialing":
      return {
        label: "Trial",
        icon: <Clock className="w-3 h-3" />,
        textClass: "text-blue-600 dark:text-blue-400",
      };
    case "past_due":
      return {
        label: "Past Due",
        icon: <AlertTriangle className="w-3 h-3" />,
        textClass: "text-red-600 dark:text-red-400",
      };
    case "canceled":
      return {
        label: "Canceled",
        icon: <XCircle className="w-3 h-3" />,
        textClass: "text-red-600 dark:text-red-400",
      };
    default:
      return {
        label: status,
        icon: null,
        textClass: "text-muted-foreground",
      };
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function SubscriptionSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/user/subscription");
      if (!res.ok) throw new Error("Failed to fetch subscription");
      const data = await res.json();
      setSubscription(data.subscription);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subscription details");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleCancel = async () => {
    setIsCanceling(true);
    try {
      const res = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to cancel subscription");
      }

      toast.success("Subscription will be canceled at the end of your billing period.");
      await fetchSubscription();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to cancel subscription");
    } finally {
      setIsCanceling(false);
    }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Card className="py-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your billing and subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── No subscription ─────────────────────────────────────────────────────────
  if (!subscription) {
    return (
      <Card className="py-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your billing and subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CreditCard className="w-10 h-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No active subscription</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upgrade to Pro to unlock all features.
              </p>
            </div>
            <Button asChild>
              <a href="/pricing">View Plans</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { label, icon, textClass } = statusConfig(
    subscription.status,
    subscription.cancelAtPeriodEnd
  );

  const canCancel =
    !subscription.cancelAtPeriodEnd &&
    subscription.status !== "canceled" &&
    subscription.status !== "past_due";

  // ── Active subscription ─────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <Card className="py-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your billing and subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Plan
              </p>
              <p className="font-semibold">{subscription.planLabel}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <div className={`flex items-center gap-1.5 font-medium ${textClass}`}>
                {icon}
                <span>{label}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {subscription.cancelAtPeriodEnd ? "Access until" : "Next renewal"}
              </p>
              <p className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Billing cycle
              </p>
              <p className="font-semibold capitalize">
                {subscription.billingCycle ?? "—"}
              </p>
            </div>
          </div>

          {/* Pending cancellation notice */}
          {subscription.cancelAtPeriodEnd && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/60 dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Your subscription will be canceled on{" "}
                <span className="font-semibold">
                  {formatDate(subscription.currentPeriodEnd)}
                </span>
                . You&apos;ll retain full access until that date.
              </p>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Cancel subscription</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                You&apos;ll keep access until the end of your current billing period.
              </p>
            </div>

            {canCancel ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isCanceling}>
                    {isCanceling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Cancel subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your plan will remain active until{" "}
                      <span className="font-semibold text-foreground">
                        {formatDate(subscription.currentPeriodEnd)}
                      </span>
                      . After that date your account will be downgraded and you
                      will lose access to Pro features. This action cannot be
                      undone from here — you would need to subscribe again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep subscription</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      Yes, cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : subscription.cancelAtPeriodEnd ? (
              <Badge variant="orange" className="gap-1">
                <Clock className="w-3 h-3" />
                Cancellation scheduled
              </Badge>
            ) : (
              <Badge variant="default">No action available</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
