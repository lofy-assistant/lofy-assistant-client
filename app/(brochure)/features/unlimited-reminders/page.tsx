"use client";

import AppNavBar from "@/components/app-navbar";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";
import Footer from "@/components/brochure/home/footer";
import CTASection from "@/components/brochure/home/cta-section";

export default function UnlimitedRemindersPage() {
  return (
    <div className="relative min-h-screen">
      <AppNavBar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <FeatureBreadcrumb featureName="Unlimited Reminders" />
          </div>
          <FeatureHeader
            badge="⏰ Reminders"
            title="Unlimited Reminders"
            description="Tailor reminders to any specific task or calendar event. Never miss an important deadline or appointment again."
          />
        </div>
      </section>

      {/* Feature Content */}
      <section className="relative py-24 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="prose prose-lg max-w-none">
            {/* Add your Unlimited Reminders specific content here */}
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-600 mb-8">
              Set up flexible reminders that adapt to your schedule and ensure you stay on top
              of every commitment.
            </p>
            
            {/* Add more content sections as needed */}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
