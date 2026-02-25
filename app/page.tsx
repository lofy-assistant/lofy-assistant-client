import { Metadata } from "next";
import AppNavBar from "@/components/app-navbar";
import Hero from "@/components/brochure/home/hero";
import { BentoFeatures } from "@/components/brochure/home/bento-features/bento-features-grid";
// import Testimonials from "@/components/brochure/home/testimonials";
import HowItWorks from "@/components/brochure/home/how-it-works";
import Footer from "@/components/brochure/home/footer";
import CTA from "@/components/brochure/home/cta";
export const metadata: Metadata = {
  title: "Lofy AI - Your Personal AI Assistant",
  description: "Lofy AI is your intelligent personal assistant designed to help you manage tasks, memories, and daily activities seamlessly.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <AppNavBar />

      <Hero />

      <BentoFeatures />

      <HowItWorks />

      {/* <Testimonials /> */}

      <CTA />

      <Footer />
    </div>
  );
}
