"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


import {
  Sparkles,
  Brain,
  Calendar,
  MessageSquare,
  Zap,
  Heart,
  Cat,
  Shield,
  Users,
  Clock,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import CTASection from "@/components/brochure/home/cta-section";

const stats = [
  { value: "5K+", label: "Reminders Sent" },
  { value: "2K+", label: "Calendar Events Created" },
  { value: "100K+", label: "Conversations" },
  { value: "8hrs", label: "Saved Weekly" },
];

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data belongs to you. We use end-to-end encryption and never sell your information.",
  },
  {
    icon: Lightbulb,
    title: "Radical Simplicity",
    description:
      "Complex technology, simple experience. Lofy handles the complexity so you don't have to.",
  },
  {
    icon: Heart,
    title: "Human-Centered",
    description:
      "AI should amplify human potential, not replace human connection. We design for real people.",
  },
  {
    icon: Users,
    title: "Inclusive Design",
    description:
      "Built for everyone. Accessible, intuitive, and respectful of diverse needs and preferences.",
  },
];

const capabilities = [
  {
    icon: Brain,
    title: "Context-Aware Intelligence",
    description:
      "Understands the relationships between your tasks, events, and preferences to provide relevant assistance.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Learns your patterns and preferences to suggest optimal times for tasks and meetings.",
  },
  {
    icon: MessageSquare,
    title: "Natural Conversation",
    description:
      "Interact naturally without learning commands. Just talk to Lofy like you would a trusted friend.",
  },
  {
    icon: Zap,
    title: "Proactive Reminders",
    description:
      "Gets ahead of your needs with intelligent reminders based on context, not just time.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description:
      "Keeps you aligned with your long-term goals by connecting daily tasks to bigger aspirations.",
  },
  {
    icon: Clock,
    title: "Persistent Memory",
    description:
      "Remembers everything you share, building a comprehensive understanding of your life over time.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 mx-auto max-w-6xl sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="indigo"
            className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5"
          >
            <Cat className="w-3.5 h-3.5 mr-2" />
            About Lofy
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            Your Intelligent
            <span className="text-primary"> Personal Assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
            Like a warm loaf of bread always there when you need it, Lofy
            remembers what matters, reminds you when needed, and helps you
            navigate life with ease.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 py-20 mx-auto max-w-6xl sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="indigo" className="mb-4 px-3 py-1">
              Our Story
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Born from a Simple Observation
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Lofy is named after a cat named{" "}
                <span className="font-semibold text-foreground">Loafy</span>
                —a quiet companion who had a remarkable way of being present
                without being intrusive. The name came from how Loafy would curl
                up into a perfect loaf shape, looking just like a warm loaf of
                bread resting peacefully.
              </p>
              <p>
                This cat would subtly remind the founder of important things: a
                gentle nudge when it was time to take a break, a quiet presence
                during late-night work sessions, and an uncanny sense of knowing
                when something needed attention.
              </p>
              <p className="font-medium text-foreground">
                Like that cat, Lofy was designed to be a subtle, intelligent
                presence in your life—one that remembers what matters, reminds
                you when needed, and understands your context without
                overwhelming you.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-2xl" />
            <Card className="relative border-2 border-primary/10 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="font-bold text-lg">The Lofy Philosophy</div>
                  <div className="text-sm text-muted-foreground">
                    Inspired by Loafy the cat
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    "Present when needed, never intrusive",
                    "Remembers what matters to you",
                    "Adapts to your rhythm",
                    "Quietly reliable, always there",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="indigo" className="mb-4 px-3 py-1">
              Purpose
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              What Drives Us
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-8">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To create an AI assistant that truly understands and supports
                  individuals in managing their lives—remembering what matters,
                  reminding when needed, and adapting to each person{"'"}s
                  unique context.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-8">
                <div className="p-3 rounded-xl bg-accent/10 w-fit mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A world where technology amplifies human potential rather than
                  adding complexity. Where personal AI assistants help people
                  reclaim mental space and focus on what brings joy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-20 mx-auto max-w-6xl sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="indigo" className="mb-4 px-3 py-1">
            Our Values
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Principles That Guide Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every feature we build and every decision we make is rooted in these
            core values.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card
              key={index}
              className="group border-2 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technology / Capabilities */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="indigo" className="mb-4 px-3 py-1">
              Technology
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Intelligent Capabilities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI to deliver a truly personalized assistant
              experience.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, index) => (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300 bg-card"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                      <cap.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{cap.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  );
}
