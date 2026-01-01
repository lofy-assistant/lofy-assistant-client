import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 overflow-hidden md:gap-6 md:py-6">
              <div className="w-full max-w-5xl px-4 mx-auto lg:px-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">Welcome back!</h1>
                </div>
                <p className="mb-6 text-muted-foreground">Here&apos;s a quick overview of your activities.</p>
                <Separator className="mb-6" />
                <AnalyticsOverview />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
