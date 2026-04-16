import { MemoryGrid } from "@/components/dashboard/memories/memory-grid";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";
import { Brain } from "lucide-react";

export default function MemoriesPage() {
  return (
    <DashboardPageShell
      title="Memories"
      description="Keep your own memories close and revisit the ones shared by your circle."
      icon={<Brain className="w-4 h-4" />}
    >
      <MemoryGrid />
    </DashboardPageShell>
  );
}
