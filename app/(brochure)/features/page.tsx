"use client";

import React from "react";
import Link from "next/link";
import AppNavbar from "@/components/app-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/brochure/home/footer";
import CTASection from "@/components/brochure/home/cta-section";
import { Badge } from "@/components/ui/badge";

const Features = () => {
  const features = [
    {
      title: "Smart Calendar",
      description:
        "Instantly schedule meetings and create calendar events using simple, natural language input.",
      icon: "📅",
      href: "/features/smart-calendar",
      badge: "Calendar",
    },
    {
      title: "Unlimited Reminders",
      description:
        "Tailor reminders to any specific task or calendar event. Never miss important deadlines.",
      icon: "⏰",
      href: "/features/unlimited-reminders",
      badge: "Reminders",
    },
    {
      title: "Save to Memory",
      description:
        "Build a searchable archive of your mind. Capture ideas, notes, and fleeting thoughts the moment they strike.",
      icon: "🧠",
      href: "/features/save-to-memory",
      badge: "Memory",
    },
    {
      title: "Centralized Task Management",
      description:
        "Command center for getting things done. Organize, assign, and plan your steps all in one place.",
      icon: "✅",
      href: "/features/centralized-task",
      badge: "Tasks",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16 text-center">
            <Badge
              variant="secondary"
              className="mb-6 text-blue-700 bg-blue-100 border-blue-200 hover:bg-blue-100"
            >
              <span>💡</span>
              <span>Powerful Features</span>
            </Badge>
            <h1 className="mb-6 text-5xl font-bold text-transparent bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
              Everything You Need to Boost Productivity
            </h1>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
              Discover all the amazing features that make Lofy the perfect AI assistant
              for your productivity needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-1"
              >
                <CardContent className="flex flex-col h-full p-0">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex items-center justify-center w-16 h-16 text-3xl transition-transform duration-300 bg-linear-to-br from-emerald-50 to-indigo-50 rounded-2xl group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <Badge
                        variant="secondary"
                        className="mb-3 text-xs text-emerald-700 bg-emerald-50 border-emerald-200"
                      >
                        {feature.badge}
                      </Badge>
                      <h3 className="mb-3 text-2xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <p className="flex-1 mb-6 leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                  <Link href={feature.href}>
                    <Button
                      variant="outline"
                      className="w-full transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                    >
                      Learn More →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

export default Features;
