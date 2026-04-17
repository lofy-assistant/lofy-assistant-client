import { ActivityLog } from "@/components/dashboard/history/activity-log";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <DashboardPageShell
      title="History"
      description="A log of actions Lofy took for you: events, reminders, and memories."
      icon={<History className="w-4 h-4" />}
    >
      <ActivityLog />
    </DashboardPageShell>
  );
}
