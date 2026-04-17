"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Cookie, Mail, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "What This Policy Covers",
    paragraphs: [
      "This Cookie Policy explains how Lofy AI uses cookies and similar technologies on our website and within related service experiences. This Policy should be read together with our Privacy Policy.",
    ],
  },
  {
    title: "Types of Technologies We Use",
    bullets: [
      "Cookies, which are small text files stored on your browser or device.",
      "Session technologies used to keep you signed in and maintain account continuity.",
      "Preference technologies used to remember interface settings and user choices.",
      "Analytics or measurement technologies used to understand service usage and performance.",
    ],
  },
  {
    title: "How We Use Cookies",
    bullets: [
      "To authenticate users and maintain secure sessions.",
      "To support core website and application functionality.",
      "To remember certain settings or interface preferences.",
      "To measure site or product usage, monitor reliability, and improve performance.",
      "To support security, fraud prevention, diagnostics, and operational monitoring.",
    ],
  },
  {
    title: "Categories of Cookies",
    bullets: [
      "Strictly necessary cookies, which are required for login, security, routing, and core site functionality.",
      "Preference cookies, which store user-interface settings or similar convenience preferences.",
      "Analytics cookies or similar tools, where deployed, to help us understand service usage and product performance.",
    ],
  },
  {
    title: "Managing Cookies",
    paragraphs: [
      "Most browsers allow you to manage cookies through browser settings, including blocking, deleting, or limiting cookie storage. Please note that disabling certain cookies may impair functionality, including sign-in, account persistence, and other core features.",
      "Where applicable law requires additional consent controls for non-essential technologies, those controls may be provided through the Services or your browser and device settings.",
    ],
  },
  {
    title: "Third-Party Technologies",
    paragraphs: [
      "Some cookies or similar technologies may be provided by third-party service providers that support hosting, analytics, security, billing, or embedded service functionality. Those third parties may operate under their own terms and privacy notices.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Cookie Policy from time to time. If we make material changes, we will post the updated version on this page and revise the \"Last updated\" date.",
    ],
  },
];

export default function CookiePolicyPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="group mb-8 pl-0 hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Button>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Cookie className="h-4 w-4" />
            Legal Notice
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            Cookie Policy
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            This Cookie Policy explains how Lofy AI uses cookies and similar technologies for
            authentication, product functionality, user preferences, analytics, and service
            security.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: April 18, 2026</p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold">Essential Cookies</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Used for secure sessions, authentication, and required site operations.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Cookie className="h-4 w-4 text-primary" />
              <span className="font-semibold">Preferences</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Used to remember certain settings and improve continuity across visits.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold">Analytics</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              May be used to understand traffic, product usage, and operational performance.
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none dark:prose-invert">
          {sections.map((section, index) => (
            <section key={section.title} className="mb-10">
              <h2 className="mb-4 flex items-baseline gap-3 text-2xl font-bold text-foreground">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <div className="pl-11">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mb-4 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="space-y-3 list-none p-0">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                        <span className="text-muted-foreground">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}

          <section className="mb-10">
            <h2 className="mb-4 flex items-baseline gap-3 text-2xl font-bold text-foreground">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {sections.length + 1}
              </span>
              Contact
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">
                Questions regarding this Cookie Policy may be sent to:
              </p>
              <div className="flex max-w-md items-center gap-3 rounded-lg border border-border bg-card p-4">
                <Mail className="h-5 w-5 text-primary" />
                <a
                  href="mailto:ilhamghaz@gmail.com"
                  className="text-lg font-medium text-primary hover:underline"
                >
                  ilhamghaz@gmail.com
                </a>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                See also our <Link href="/privacy-policy" className="font-medium text-primary hover:underline">Privacy Policy</Link> and{" "}
                <Link href="/terms" className="font-medium text-primary hover:underline">Terms of Service</Link>.
              </div>
            </div>
          </section>

          <div className="mt-16 border-t border-border pt-8">
            <Button onClick={() => router.push("/")} size="lg" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
