import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/dashboard/settings/profile-settings";
import { SecuritySettings } from "@/components/dashboard/settings/security-settings";
import { AboutSettings } from "@/components/dashboard/settings/about-settings";

export default function SettingsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 48)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="w-full max-w-5xl px-4 mx-auto lg:px-6">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">Settings</h1>
                </div>
                <p className="mb-6 text-muted-foreground">
                  Manage your account settings and preferences
                </p>
                <Separator className="mb-6" />

                <Tabs defaultValue="profile" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    {/* <TabsTrigger value="data">Data</TabsTrigger> */}
                    <TabsTrigger value="about">About</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <ProfileSettings />
                  </TabsContent>

                  <TabsContent value="security">
                    <SecuritySettings />
                  </TabsContent>

                  {/* <TabsContent value="data">
                    <DataManagementSettings />
                  </TabsContent> */}

                  <TabsContent value="about">
                    <AboutSettings />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
