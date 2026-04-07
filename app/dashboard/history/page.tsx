import { ActivityLog } from "@/components/dashboard/history/activity-log";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";

export default function HistoryPage() {
  return (
    <DashboardPageShell title="History" headerVariant="close" backHref="/dashboard">
      <ActivityLog />
    </DashboardPageShell>
  );
}
