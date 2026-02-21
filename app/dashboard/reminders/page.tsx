import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReminderList } from "@/components/dashboard/reminders/reminder-list";
import { BellIcon } from "@/components/ui/bell-icon";
import { Separator } from "@/components/ui/separator";

export default async function RemindersPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  // Check if user is logged in and has query parameters
  if (sessionToken && phone) {
    const session = await verifySession(sessionToken);

    if (session) {
      // User is authenticated, redirect to clean URL without query params
      redirect("/dashboard/reminders");
    }
  }

  // If not logged in but has phone parameter, redirect to login
  if (!sessionToken && phone) {
    redirect(`/login?redirect=${encodeURIComponent("/dashboard/reminders")}&phone=${phone}`);
  }

  return (
    <SidebarProvider
      style={
        {
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
                  <BellIcon size={50} />
                  <h1 className="text-2xl font-bold">Reminders</h1>
                </div>
                <p className="mb-6 text-muted-foreground">
                  Manage your reminders and notifications
                </p>
                <Separator className="mb-6" />
                <ReminderList />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
