import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHero } from "@/components/dashboard/overview/dashboard-hero";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
      {/* Hero section — full warm-gradient background with card */}
      <DashboardHero />
    </SidebarProvider>
  );
}
