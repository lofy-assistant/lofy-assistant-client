"use client";

import AppNavBar from "@/components/app-navbar";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";
import Footer from "@/components/brochure/home/footer";
import CTASection from "@/components/brochure/home/cta-section";

export default function SaveToMemoryPage() {
  return (
    <div className="relative min-h-screen">
      <AppNavBar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <FeatureBreadcrumb featureName="Save to Memory" />
          </div>
          <FeatureHeader
            badge="🧠 Memory"
            title="Save to Memory"
            description="Build a searchable archive of your mind. Capture ideas, notes, and fleeting thoughts the moment they strike."
          />
        </div>
      </section>

      {/* Feature Content */}
      <section className="relative py-24 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="prose prose-lg max-w-none">
            {/* Add your Save to Memory specific content here */}
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-600 mb-8">
              Instantly save thoughts, ideas, and important information. Your personal AI assistant
              organizes and makes everything searchable.
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
