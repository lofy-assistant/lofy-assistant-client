import { BarChart3 } from "lucide-react";
import { AnalyticsPage } from "@/components/dashboard/analytics/analytics-page";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";

export default function AnalyticsDashboardPage() {
  return (
    <DashboardPageShell
      title="Analytics"
      description="A personal view of your conversation rhythm, memory habit, and planning load."
      icon={<BarChart3 className="h-4 w-4" />}
    >
      <AnalyticsPage />
    </DashboardPageShell>
  );
}
