import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CalendarEventsList } from "@/components/dashboard/calendar/calendar-events-list";
import { CalendarIcon } from "@/components/ui/calendar-icon";
import { Separator } from "@/components/ui/separator";

export default function CalendarPage() {
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
            <div className="flex flex-col gap-4 py-4 overflow-hidden md:gap-6 md:py-6">
              <div className="w-full max-w-5xl px-4 mx-auto lg:px-6">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarIcon size={50} />
                  <h1 className="text-2xl font-bold">Calendar Events</h1>
                </div>
                <p className="mb-6 text-muted-foreground">View and manage your upcoming events</p>
                <Separator className="mb-6" />
                <CalendarEventsList />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
