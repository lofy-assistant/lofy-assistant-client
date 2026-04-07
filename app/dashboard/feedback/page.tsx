import type { Metadata } from "next";
import { Bug } from "lucide-react";
import { DashboardPageShell } from "@/components/dashboard/shared/page-shell";
import { FeedbackForm } from "@/components/dashboard/feedback/feedback-form";
import { ContactFounderCard } from "@/components/dashboard/feedback/contact-founder-card";

export const metadata: Metadata = {
  title: "Feedback",
};

export default function FeedbackPage() {
  return (
    <DashboardPageShell
      title="Feedback"
      description="Share your thoughts, report bugs, or suggest improvements."
      icon={<Bug className="w-4 h-4" />}
    >
      <div className="flex flex-col gap-3">
        <FeedbackForm />
        <ContactFounderCard />
      </div>
    </DashboardPageShell>
  );
}
