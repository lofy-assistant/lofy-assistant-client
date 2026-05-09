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
import { cn } from "@/lib/utils";
import { useDashboardNight } from "@/components/dashboard/shared/dashboard-night-provider";
import { dnc } from "@/lib/dashboard-night";

interface Subscription {
  id: string;
  status: string;
  priceId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  billingCycle: "monthly" | "quarterly" | "yearly" | null;
  planLabel: string;
  totalTokensUsed: number;
}

function formatBillingCycleLabel(cycle: Subscription["billingCycle"]): string {
  if (!cycle) return "Not set";
  if (cycle === "monthly") return "Monthly";
  if (cycle === "quarterly") return "Every 3 months";
  return "Annual";
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

function formatTokenCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function SubscriptionSettings() {
  const { isNight: night } = useDashboardNight();
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
      <Card
        className={cn(
          "py-4 text-sm",
          night && "border-white/10 bg-white/5"
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "flex items-center gap-2 text-sm",
              night && "text-[#e8ddd4]"
            )}
          >
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription
            className={cn("text-xs", night && "text-[#9a8f85]")}
          >
            Manage your billing and subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2
              className={cn(
                "h-6 w-6 animate-spin",
                dnc.settingsHelp(night)
              )}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── No subscription ─────────────────────────────────────────────────────────
  if (!subscription) {
    return (
      <Card
        className={cn(
          "py-4 text-sm",
          night && "border-white/10 bg-white/5"
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "flex items-center gap-2 text-sm",
              night && "text-[#e8ddd4]"
            )}
          >
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription
            className={cn("text-xs", night && "text-[#9a8f85]")}
          >
            Manage your billing and subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CreditCard
              className={cn(
                "h-10 w-10",
                dnc.settingsHelp(night)
              )}
            />
            <div>
              <p
                className={cn(
                  "font-medium",
                  night && "text-[#e8ddd4]"
                )}
              >
                No active subscription
              </p>
              <p
                className={cn("mt-1 text-sm", dnc.settingsHelp(night))}
              >
                Choose a paid plan to unlock all features.
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
    <div className="space-y-4 text-sm">
      <Card
        className={cn(
          "py-4 text-sm",
          night && "border-white/10 bg-white/5"
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "flex items-center gap-2 text-sm",
              night && "text-[#e8ddd4]"
            )}
          >
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription
            className={cn("text-xs", night && "text-[#9a8f85]")}
          >
            Manage your billing and subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  dnc.settingsHelp(night)
                )}
              >
                Plan
              </p>
              <p
                className={cn("font-semibold", night && "text-[#e8ddd4]")}
              >
                {subscription.planLabel}
              </p>
            </div>

            <div className="space-y-1">
              <p
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  dnc.settingsHelp(night)
                )}
              >
                Status
              </p>
              <div className={`flex items-center gap-1.5 font-medium ${textClass}`}>
                {icon}
                <span>{label}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  dnc.settingsHelp(night)
                )}
              >
                {subscription.cancelAtPeriodEnd ? "Access until" : "Next renewal"}
              </p>
              <p
                className={cn("font-semibold", night && "text-[#e8ddd4]")}
              >
                {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>

            <div className="space-y-1">
              <p
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  dnc.settingsHelp(night)
                )}
              >
                Billing cycle
              </p>
              <p
                className={cn("font-semibold", night && "text-[#e8ddd4]")}
              >
                {formatBillingCycleLabel(subscription.billingCycle)}
              </p>
            </div>
          </div>

          {/* Pending cancellation notice */}
          {subscription.cancelAtPeriodEnd && (
            <div
              className={cn(
                "flex items-start gap-3 rounded-lg border px-4 py-3",
                night
                  ? "border-amber-500/35 bg-amber-950/40"
                  : "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-900/20"
              )}
            >
              <AlertTriangle
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  night ? "text-amber-400" : "text-amber-600 dark:text-amber-400"
                )}
              />
              <p
                className={cn(
                  "text-sm",
                  night ? "text-amber-100" : "text-amber-800 dark:text-amber-300"
                )}
              >
                Your subscription will be canceled on{" "}
                <span className="font-semibold">
                  {formatDate(subscription.currentPeriodEnd)}
                </span>
                . You&apos;ll retain full access until that date.
              </p>
            </div>
          )}

          <Separator
            className={night ? "bg-white/10" : undefined}
          />

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  night && "text-[#e8ddd4]"
                )}
              >
                Cancel subscription
              </p>
              <p
                className={cn("mt-0.5 text-xs", dnc.settingsHelp(night))}
              >
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
                      will lose access to paid features. This action cannot be
                      undone from here; you would need to subscribe again.
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

          <Separator
            className={night ? "bg-white/10" : undefined}
          />

          <div className="space-y-1">
            <p
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                dnc.settingsHelp(night)
              )}
            >
              Total tokens used
            </p>
            <p
              className={cn("font-semibold", night && "text-[#e8ddd4]")}
            >
              {formatTokenCount(subscription.totalTokensUsed)}
            </p>
            <p
              className={cn("text-xs", dnc.settingsHelp(night))}
            >
              Combined input and output tokens recorded in Lofy&apos;s usage logs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
