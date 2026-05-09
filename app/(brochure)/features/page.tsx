import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import CTA from "@/components/brochure/home/cta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BROCHURE_FEATURES } from "@/lib/brochure-features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore the Lofy features that are live in the client today: integrations, friends, history, memories, and personas with settings that shape how Lofy sounds and works for you.",
  alternates: {
    canonical: "/features",
  },
};

const productFit = [
  {
    title: "Connect and act",
    description:
      "Integrations and history show what Lofy can access, what it changed, and where the result landed.",
  },
  {
    title: "Remember with context",
    description:
      "Memories and friends turn saved details into a library you can revisit or share with people you trust.",
  },
  {
    title: "Make it sound like yours",
    description:
      "Personas keep the assistant useful while changing the tone to fit the moment.",
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-marketing-bg">
      <section className="marketing-hero-bg relative overflow-hidden border-b border-marketing-border py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 border-white/70 bg-white/80 text-marketing-accent-soft-foreground shadow-sm backdrop-blur-xl hover:bg-white/90">
              <Sparkles className="mr-2 size-3.5" />
              Features aligned to the live product
            </Badge>
            <h1 className="marketing-heading py-1 text-4xl font-bold leading-tight text-balance md:text-6xl">
              The assistant is bigger than a chat window.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-marketing-body md:text-xl">
              Lofy connects the places you work, remembers what matters, and gives you a dashboard to understand what
              happened after every request.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {["5 current product surfaces", "Built around real dashboard flows", "Clear live-now messaging"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-medium text-marketing-chip-text shadow-sm backdrop-blur-xl"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {BROCHURE_FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.slug}
                  className="group marketing-card overflow-hidden rounded-lg py-0 transition-all duration-300 hover:-translate-y-1 hover:border-marketing-border-strong"
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg border border-marketing-border bg-marketing-accent-soft text-marketing-accent-soft-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <Icon className="size-6" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <Badge className="border-marketing-chip-border bg-marketing-chip-bg text-xs text-marketing-chip-text hover:bg-marketing-chip-bg">
                          {feature.badge}
                        </Badge>
                        <h3 className="text-2xl font-bold text-marketing-chat-assistant-text">{feature.title}</h3>
                      </div>
                    </div>

                    <p className="mb-5 flex-1 leading-relaxed text-marketing-body">{feature.overviewDescription}</p>

                    <div className="mb-6 flex flex-wrap gap-2">
                      {feature.overviewHighlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-marketing-chip-border bg-marketing-chip-bg px-2.5 py-1 text-[11px] font-medium text-marketing-chip-text"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="mt-auto w-full rounded-lg border-marketing-border bg-white/70 text-marketing-chat-assistant-text hover:border-marketing-accent/50 hover:bg-marketing-accent-soft hover:text-marketing-accent-soft-foreground"
                      asChild
                    >
                      <Link href={feature.href}>
                        Explore {feature.shortTitle}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Badge className="mb-4 border-marketing-border bg-marketing-accent-soft text-marketing-accent-soft-foreground hover:bg-marketing-accent-soft">
              How the product fits together
            </Badge>
            <h2 className="text-3xl font-semibold leading-tight text-marketing-chat-assistant-text md:text-4xl">
              A connected system, not a list of disconnected tricks.
            </h2>
            <p className="mt-3 text-base leading-7 text-marketing-body">
              Each feature supports the same loop: ask naturally, let Lofy act, then review and tune the experience from
              the dashboard.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {productFit.map((item) => (
              <Card key={item.title} className="marketing-card rounded-lg py-0">
                <CardContent className="space-y-4 p-6">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-marketing-accent-soft text-marketing-accent-soft-foreground">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-marketing-chat-assistant-text">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-marketing-body">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-marketing-border bg-[linear-gradient(145deg,var(--marketing-card-surface)_0%,var(--marketing-accent-soft)_100%)] p-6 shadow-[0_22px_48px_-36px_var(--marketing-shadow)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-marketing-border bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase text-marketing-accent-soft-foreground">
                  <ShieldCheck className="size-3.5" />
                  Grounded product messaging
                </div>
                <h3 className="text-2xl font-semibold text-marketing-chat-assistant-text">
                  The brochure leads with what is live, then points to how each surface can grow.
                </h3>
                <p className="mt-2 text-sm leading-6 text-marketing-body">
                  That keeps the story honest to the current client while still giving roadmap ideas a place to breathe.
                </p>
              </div>
              <Button className="rounded-lg bg-marketing-cta-bg px-5 text-marketing-cta-fg hover:bg-marketing-cta-hover" asChild>
                <Link href="/features/integrations">Start with Integrations</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
