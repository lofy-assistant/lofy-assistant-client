"use client";

import { useSyncExternalStore } from "react";
import { CreditCard, Info, Settings, Shield, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/dashboard/settings/profile-settings";
import { SecuritySettings } from "@/components/dashboard/settings/security-settings";
import { AboutSettings } from "@/components/dashboard/settings/about-settings";
import { SubscriptionSettings } from "@/components/dashboard/settings/subscription-settings";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";

const subscribe = () => () => {};

export default function SettingsPage() {
  const isMounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <DashboardPageShell
      title="Settings"
      icon={<Settings className="w-4 h-4" />}
      scrollClassName="overflow-hidden px-0 py-0"
    >
      {isMounted ? (
        <Tabs defaultValue="profile" className="flex h-full flex-col gap-0 text-sm">
          <div className="shrink-0 border-b border-[#ede5da] bg-[#faf6f2] px-4 pb-3 pt-3">
            <p className="pb-2 text-xs text-[#9a8070]">
              Manage your account settings and preferences
            </p>
            <TabsList className="grid w-full grid-cols-4 rounded-xl border border-[#ede5da] bg-[#faf6f2]/95 backdrop-blur supports-[backdrop-filter]:bg-[#faf6f2]/85">
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
            className="scrollbar-hidden flex-1 overflow-y-auto px-4 pb-4 pt-4"
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
        <div className="m-4 h-24 rounded-xl border border-[#ede5da] bg-white/60" />
      )}
    </DashboardPageShell>
  );
}
