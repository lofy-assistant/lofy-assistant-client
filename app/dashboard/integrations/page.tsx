import { IntegrationCard } from "@/components/dashboard/integrations/integration-card";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";
import { Plug } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <DashboardPageShell
      title="Integrations"
      description="Connect your favourite apps to your Lofy account and get more done."
      icon={<Plug className="w-4 h-4" />}
    >
      <IntegrationCard />
    </DashboardPageShell>
  );
}
