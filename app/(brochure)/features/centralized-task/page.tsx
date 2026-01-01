"use client";

import AppNavBar from "@/components/app-navbar";
import FeatureBreadcrumb from "@/components/brochure/features/feature-breadcrumb";
import FeatureHeader from "@/components/brochure/features/feature-header";
import Footer from "@/components/brochure/home/footer";
import CTASection from "@/components/brochure/home/cta-section";

export default function CentralizedTaskPage() {
  return (
    <div className="relative min-h-screen">
      <AppNavBar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <FeatureBreadcrumb featureName="Centralized Task Management" />
          </div>
          <FeatureHeader
            badge="✅ Tasks"
            title="Centralized Task Management"
            description="Command center for getting things done. Organize, assign, and plan your steps all in one place."
          />
        </div>
      </section>

      {/* Feature Content */}
      <section className="relative py-24 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="prose prose-lg max-w-none">
            {/* Add your Centralized Task Management specific content here */}
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-600 mb-8">
              Manage all your tasks in one centralized location. Break down complex projects
              into actionable steps and track progress effortlessly.
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
