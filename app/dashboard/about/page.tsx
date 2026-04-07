import type { Metadata } from "next";
import { LofyAboutScreen } from "@/components/dashboard/about/lofy-about-screen";

export const metadata: Metadata = {
  title: "About",
};

export default function DashboardAboutPage() {
  return <LofyAboutScreen />;
}
