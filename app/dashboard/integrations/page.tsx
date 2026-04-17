import { IntegrationCard } from "@/components/dashboard/integrations/integration-card";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";
import { Plug } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <DashboardPageShell
      title="Integrations"
      description="Link Google with OAuth (multiple accounts supported) and manage WhatsApp."
      icon={<Plug className="w-4 h-4" />}
    >
      <IntegrationCard />
    </DashboardPageShell>
  );
}
