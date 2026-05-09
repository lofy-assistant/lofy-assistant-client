"use client";

import { useSyncExternalStore } from "react";
import { CreditCard, Info, Settings, Shield, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/dashboard/settings/profile-settings";
import { SecuritySettings } from "@/components/dashboard/settings/security-settings";
import { AboutSettings } from "@/components/dashboard/settings/about-settings";
import { SubscriptionSettings } from "@/components/dashboard/settings/subscription-settings";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";
import { cn } from "@/lib/utils";
import { dnc } from "@/lib/dashboard-night";
import { useDashboardNight } from "@/components/dashboard/shared/dashboard-night-provider";

const subscribe = () => () => {};

export default function SettingsPage() {
  const isMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { isNight: night } = useDashboardNight();

  return (
    <DashboardPageShell
      title="Settings"
      icon={<Settings className="w-4 h-4" />}
      scrollClassName="overflow-hidden px-0 py-0"
    >
      {isMounted ? (
        <Tabs defaultValue="profile" className="flex h-full flex-col gap-0 text-sm">
          <div
            className={cn(
              "shrink-0 border-b px-4 pb-3 pt-3",
              night
                ? "border-white/10 bg-[#111216]"
                : "border-[#ede5da] bg-[#faf6f2]"
            )}
          >
            <p
              className={cn(
                "pb-2 text-xs",
                dnc.textMuted(night)
              )}
            >
              Manage your account settings and preferences
            </p>
            <TabsList
              className={cn(
                "grid h-auto w-full grid-cols-4 gap-0.5 rounded-xl border p-1",
                night
                  ? "border-white/10 bg-[#16181e] [&_[data-slot=tabs-trigger][data-state=inactive]]:!text-[#c4bdb3] [&_[data-slot=tabs-trigger][data-state=inactive]]:hover:!text-[#e4dfd6] [&_[data-slot=tabs-trigger][data-state=active]]:border [&_[data-slot=tabs-trigger][data-state=active]]:border-white/10 [&_[data-slot=tabs-trigger][data-state=active]]:!text-[#f4f0ea] [&_[data-slot=tabs-trigger][data-state=active]]:bg-white/10 [&_[data-slot=tabs-trigger][data-state=active]]:shadow-none"
                  : "border-[#ede5da] bg-[#faf6f2]/95 backdrop-blur supports-[backdrop-filter]:bg-[#faf6f2]/85"
              )}
            >
              <TabsTrigger value="profile" aria-label="Profile" title="Profile">
                <User className="size-4" />
                <span className="sr-only">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" aria-label="Subscription" title="Subscription">
                <CreditCard className="size-4" />
                <span className="sr-only">Subscription</span>
              </TabsTrigger>
              <TabsTrigger value="security" aria-label="Security" title="Security">
                <Shield className="size-4" />
                <span className="sr-only">Security</span>
              </TabsTrigger>
              <TabsTrigger value="about" aria-label="About" title="About">
                <Info className="size-4" />
                <span className="sr-only">About</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div
            className={cn(
              "scrollbar-hidden flex-1 overflow-y-auto px-4 pb-4 pt-4",
              night && "bg-[#111216]/50"
            )}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <TabsContent value="profile" className="mt-0">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="subscription" className="mt-0">
              <SubscriptionSettings />
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="about" className="mt-0">
              <AboutSettings />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <div
          className={cn(
            "m-4 h-24 rounded-xl border",
            night
              ? "border-white/10 bg-white/5"
              : "border-[#ede5da] bg-white/60"
          )}
        />
      )}
    </DashboardPageShell>
  );
}
