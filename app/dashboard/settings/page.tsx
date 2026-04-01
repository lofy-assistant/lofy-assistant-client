import { Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/dashboard/settings/profile-settings";
import { SecuritySettings } from "@/components/dashboard/settings/security-settings";
import { AboutSettings } from "@/components/dashboard/settings/about-settings";
import { SubscriptionSettings } from "@/components/dashboard/settings/subscription-settings";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";

export default function SettingsPage() {
  return (
    <DashboardPageShell
      title="Settings"
      description="Manage your account settings and preferences"
      icon={<Settings className="w-4 h-4" />}
    >
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="about">
          <AboutSettings />
        </TabsContent>
      </Tabs>
    </DashboardPageShell>
  );
}
