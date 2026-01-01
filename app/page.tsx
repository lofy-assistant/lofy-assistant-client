"use client";

import Link from "next/link";
import AppNavBar from "@/components/app-navbar";
import Hero from "@/components/brochure/home/hero";
import { BentoFeatures } from "@/components/brochure/home/bento-features";
import Testimonials from "@/components/brochure/home/testimonials";
import HowItWorks from "@/components/brochure/home/how-it-works";
import CTASection from "@/components/brochure/home/cta-section";
import Footer from "@/components/brochure/home/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <AppNavBar />

      <Hero />

      <BentoFeatures />

      <HowItWorks />

      <Testimonials />

      <CTASection />

      <Footer />
    </div>
  );
}
