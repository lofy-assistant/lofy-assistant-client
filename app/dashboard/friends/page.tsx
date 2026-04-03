import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";
import { FriendsPanel } from "@/components/dashboard/friends/friends-panel";
import { Users } from "lucide-react";

export default function FriendsPage() {
  return (
    <DashboardPageShell
      title="Friends"
      description="Invite people by phone and see who is in your Lofy circle."
      icon={<Users className="w-4 h-4 text-primary" />}
    >
      <FriendsPanel />
    </DashboardPageShell>
  );
}
