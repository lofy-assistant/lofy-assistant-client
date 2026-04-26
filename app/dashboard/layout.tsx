import { DashboardNightProvider } from "@/components/dashboard/shared/dashboard-night-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardNightProvider>{children}</DashboardNightProvider>;
}
