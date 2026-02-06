import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IntegrationCard } from "@/components/dashboard/integrations/integration-card";
import { IconPlug } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
// import { ConnectMCP } from "@/components/dashboard/integrations/connect-mcp";

export default function IntegrationsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="w-full max-w-7xl px-4 mx-auto lg:px-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
                    <IconPlug className="size-5 text-muted-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold">Integrations</h1>
                </div>
                <p className="mb-6 text-muted-foreground">
                  Connect your favorite apps to your Lofy account and get more done.
                </p>
                <Separator className="mb-6" />
                <IntegrationCard />

                {/* <Separator className="my-8" /> */}

                {/* <ConnectMCP /> */}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
