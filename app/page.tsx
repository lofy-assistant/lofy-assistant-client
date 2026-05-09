import { Metadata } from "next";

import AppNavBar from "@/components/app-navbar";
import CTA from "@/components/brochure/home/cta";
import Footer from "@/components/brochure/home/footer";
import Hero from "@/components/brochure/home/hero";
import HowItWorks from "@/components/brochure/home/how-it-works";
import Security from "@/components/brochure/home/security";
import { BentoFeatures } from "@/components/brochure/home/bento-features/bento-features-grid";

export const metadata: Metadata = {
  title: "Lofy AI - Your Personal AI Assistant",
  description:
    "Lofy is your intelligent assistant for messaging, Google integrations, memory, and planning. Meet Lofy on your channels as we expand beyond WhatsApp.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-marketing-bg">
      <AppNavBar />
      <Hero />
      <BentoFeatures />
      <Security />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
