"use client";

import { ShieldCheck, Lock, KeyRound, EyeOff, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const pillars = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "All data in transit and at rest is encrypted using AES-256, ensuring no one, not even us, can read your messages.",
  },
  {
    icon: KeyRound,
    title: "Zero-Knowledge Architecture",
    description:
      "Your credentials and sensitive information are never stored in plaintext. We apply salted hashing and key derivation at every layer.",
  },
  {
    icon: EyeOff,
    title: "Privacy by Design",
    description:
      "We collect only what is strictly necessary. Your data is never sold, shared, or used to train external models.",
  },
];

export default function Security() {
  return (
    <section className="marketing-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-14 text-center">
          <Badge className="mb-4 border-marketing-border bg-marketing-accent-soft text-marketing-accent-soft-foreground hover:bg-marketing-accent-soft">
            <ShieldCheck className="mr-2 size-3.5" />
            Enterprise-grade security
          </Badge>
          <h2 className="marketing-heading mb-4 text-3xl font-bold md:text-5xl">
            Your data is safe with us
          </h2>
          <p className="mx-auto max-w-2xl text-base text-marketing-body md:text-lg">
            Every interaction with Lofy is protected by the same standards trusted by leading enterprises worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="marketing-card rounded-lg py-4 transition-colors hover:border-marketing-border-strong"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex size-11 items-center justify-center rounded-lg border border-marketing-chip-border bg-marketing-chip-bg text-marketing-accent-soft-foreground shadow-sm">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-marketing-chat-assistant-text">{title}</h3>
                  <p className="text-sm leading-relaxed text-marketing-body">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-marketing-body-muted md:gap-6">
          <span className="flex items-center gap-1.5">
            <Lock className="size-4 text-marketing-accent" /> AES-256 encryption
          </span>
          <span className="hidden h-4 w-px bg-marketing-chip-border sm:block" />
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="size-4 text-marketing-accent" /> Privacy focused
          </span>
          <span className="hidden h-4 w-px bg-marketing-chip-border sm:block" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-marketing-accent" /> Secure by design
          </span>
          <span className="hidden h-4 w-px bg-marketing-chip-border sm:block" />
          <span className="flex items-center gap-1.5">
            <EyeOff className="size-4 text-marketing-accent" /> No data selling
          </span>
        </div>
      </div>
    </section>
  );
}
