"use client";

import AppNavBar from "@/components/app-navbar";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";
import Footer from "@/components/brochure/home/footer";
import CTASection from "@/components/brochure/home/cta-section";

export default function SmartCalendarPage() {
  return (
    <div className="relative min-h-screen">
      <AppNavBar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <FeatureBreadcrumb featureName="Smart Calendar" />
          </div>
          <FeatureHeader
            badge="📅 Calendar"
            title="Smart Calendar"
            description="Instantly schedule meetings and create calendar events using simple, natural language input. Let Lofy handle the complexity of calendar management."
          />
        </div>
      </section>

      {/* Feature Content */}
      <section className="relative py-24 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="prose prose-lg max-w-none">
            {/* Add your Smart Calendar specific content here */}
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-600 mb-8">
              Smart Calendar uses natural language processing to understand your scheduling needs
              and automatically create events in your calendar.
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
