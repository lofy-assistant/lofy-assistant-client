"use client";

import { useEffect, useRef, useState } from "react";
import { X, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "sub_banner_dismissed";
const AUTO_DISMISS_MS = 5_000;

interface Subscription {
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  planLabel: string;
}

type BannerVariant = "green" | "amber" | "red";

interface BannerContent {
  variant: BannerVariant;
  icon: React.ReactNode;
  message: React.ReactNode;
}

function daysUntil(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function resolveBanner(sub: Subscription): BannerContent | null {
  const { status, cancelAtPeriodEnd, currentPeriodEnd } = sub;

  // Active and will renew
  if (status === "active" && !cancelAtPeriodEnd) {
    return {
      variant: "green",
      icon: <CheckCircle2 className="w-4 h-4 shrink-0" />,
      message: (
        <>
          Your <span className="font-semibold">{sub.planLabel}</span> subscription is active. Next
          billing on <span className="font-semibold">{formatDate(currentPeriodEnd)}</span>.
        </>
      ),
    };
  }

  // Active but scheduled to cancel
  if (status === "active" && cancelAtPeriodEnd) {
    const days = daysUntil(currentPeriodEnd);
    return {
      variant: "amber",
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
      message: (
        <>
          Your subscription is set to cancel on{" "}
          <span className="font-semibold">{formatDate(currentPeriodEnd)}</span>.{" "}
          {days > 0 ? (
            <>
              You have <span className="font-semibold">{days} day{days !== 1 ? "s" : ""}</span> of
              access remaining.
            </>
          ) : (
            "Access ends today."
          )}
        </>
      ),
    };
  }

  // Trial
  if (status === "trialing") {
    const days = daysUntil(currentPeriodEnd);
    return {
      variant: "amber",
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
      message:
        days > 0 ? (
          <>
            You&apos;re on a free trial.{" "}
            <span className="font-semibold">{days} day{days !== 1 ? "s" : ""} left</span> — trial
            ends on <span className="font-semibold">{formatDate(currentPeriodEnd)}</span>.
          </>
        ) : (
          <>Your free trial ends <span className="font-semibold">today</span>.</>
        ),
    };
  }

  // Past due / canceled / anything else non-active
  return {
    variant: "red",
    icon: <XCircle className="w-4 h-4 shrink-0" />,
    message: (
      <>
        Your account is <span className="font-semibold">inactive</span>. Subscribe to continue
        using all features.{" "}
        <a href="/pricing" className="underline underline-offset-2 font-semibold hover:opacity-80">
          View plans →
        </a>
      </>
    ),
  };
}

const variantStyles: Record<BannerVariant, string> = {
  green:
    "bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800/60 dark:text-green-200",
  amber:
    "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800/60 dark:text-amber-200",
  red: "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800/60 dark:text-red-200",
};

const closeButtonStyles: Record<BannerVariant, string> = {
  green: "hover:bg-green-100 dark:hover:bg-green-900/40",
  amber: "hover:bg-amber-100 dark:hover:bg-amber-900/40",
  red: "hover:bg-red-100 dark:hover:bg-red-900/40",
};

export function SubscriptionBanner() {
  const [banner, setBanner] = useState<BannerContent | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
  };

  useEffect(() => {
    // Only show once per browser session
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {}

    (async () => {
      try {
        const res = await fetch("/api/user/subscription");
        if (!res.ok) return;
        const data = await res.json();

        // No subscription record → show red
        const sub: Subscription | null = data.subscription;
        const content = sub ? resolveBanner(sub) : {
          variant: "red" as BannerVariant,
          icon: <XCircle className="w-4 h-4 shrink-0" />,
          message: (
            <>
              No active subscription found.{" "}
              <a href="/pricing" className="underline underline-offset-2 font-semibold hover:opacity-80">
                Subscribe now →
              </a>
            </>
          ),
        };

        setBanner(content);
        setVisible(true);

        timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
      } catch {
        // silent — don't block the dashboard if this fails
      }
    })();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible || !banner) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm transition-opacity duration-300 mb-4",
        variantStyles[banner.variant]
      )}
    >
      {banner.icon}
      <p className="flex-1 leading-snug">{banner.message}</p>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className={cn(
          "rounded p-0.5 transition-colors -mt-0.5 -mr-0.5",
          closeButtonStyles[banner.variant]
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
