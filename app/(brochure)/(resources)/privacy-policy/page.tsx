"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bot, Database, Globe, Mail, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Scope of This Policy",
    paragraphs: [
      "This Privacy Policy describes how Lofy AI collects, uses, stores, discloses, and otherwise processes personal information when you access our website, create an account, use our AI assistant, connect third-party services, purchase a subscription, or communicate with us.",
      "For purposes of this Policy, \"Lofy,\" \"we,\" \"our,\" and \"us\" refer to Lofy AI. \"You\" and \"your\" refer to the person or entity using the Services.",
    ],
  },
  {
    title: "Information We Collect",
    bullets: [
      "Account and identity information, such as your phone number, email address, display name, account identifiers, and verification status.",
      "Authentication and session information, including session tokens, login activity, security checks, and related device or browser metadata.",
      "User content you choose to submit, including prompts, messages, memories, reminders, calendar details, feedback, uploaded audio, uploaded images, and related instructions.",
      "Integration data associated with connected services, including Google Calendar authorization details, calendar event references, and settings needed to operate approved integrations.",
      "Billing and transaction information associated with subscriptions and payments, including subscription status, plan identifiers, Stripe customer references, and payment metadata received from our billing providers.",
      "Usage, operational, and diagnostic information, such as feature interactions, logs, analytics events, token-usage records, and service performance or reliability data.",
    ],
  },
  {
    title: "How We Use Information",
    bullets: [
      "To provide, maintain, secure, and improve the Services.",
      "To authenticate users, manage accounts, enforce access controls, and prevent abuse, fraud, or unauthorized activity.",
      "To process prompts and generate AI-assisted responses, scheduling actions, memory retrieval, summaries, or related outputs requested through the Services.",
      "To operate reminders, events, notifications, memory features, sharing features, and connected-service workflows.",
      "To process subscription purchases, manage billing, and administer service eligibility tied to paid plans.",
      "To measure performance, understand product usage, debug failures, and improve reliability, safety, and user experience.",
      "To comply with legal obligations, resolve disputes, and enforce our agreements.",
    ],
  },
  {
    title: "AI Processing and Model Providers",
    paragraphs: [
      "Lofy is an AI-powered assistant. In order to generate responses and perform requested assistant functions, we may send prompts, instructions, relevant conversation context, uploaded media, or structured task data to third-party model providers or compatible inference providers used to operate the Services.",
      "These providers process data on our behalf or as independent service providers for the purpose of delivering requested AI functionality. Because model routing may vary by environment and configuration, the specific provider used for a request may differ across deployments or features.",
    ],
    bullets: [
      "AI processing may include text prompts, conversation context, memory retrieval context, scheduling details, and uploaded media submitted for assistant features.",
      "We do not describe all provider practices in this Policy; third-party providers may maintain their own terms and privacy notices.",
      "You should not submit highly sensitive information unless you are comfortable with that information being processed to provide the requested feature.",
    ],
  },
  {
    title: "How We Disclose Information",
    paragraphs: [
      "We may disclose personal information to third parties where reasonably necessary to operate the Services or where required by law.",
    ],
    bullets: [
      "Infrastructure, hosting, database, caching, storage, and security vendors that support the operation of the Services.",
      "AI and machine-learning providers used to generate responses or support assistant functionality.",
      "Analytics and telemetry providers used to understand service performance and product usage.",
      "Payment processors and billing vendors, including Stripe, for subscription and payment administration.",
      "Email or communications providers for verification, transactional notices, and support-related messages.",
      "Google or other third-party integration providers when you choose to connect your account and request related functionality.",
      "Professional advisers, regulators, law enforcement, courts, or counterparties in connection with legal requirements, investigations, or dispute resolution.",
    ],
    note:
      "We do not sell personal information to third-party advertisers. We also do not disclose your personal information to unrelated third parties for their own direct marketing purposes.",
  },
  {
    title: "Cookies and Similar Technologies",
    paragraphs: [
      "We use cookies and similar technologies for account authentication, session continuity, security, user-interface preferences, and service analytics. Some cookies are necessary for the Services to function properly, while others help us understand usage and improve performance.",
      "Additional details are available in our Cookie Policy.",
    ],
  },
  {
    title: "Data Retention",
    paragraphs: [
      "We retain personal information for as long as reasonably necessary to provide the Services, maintain legitimate business and security records, comply with legal obligations, resolve disputes, and enforce our agreements.",
      "Retention periods may vary depending on the type of data, the feature involved, the sensitivity of the information, operational needs, and applicable legal requirements. We may also retain limited backup, logging, or archival data for a period of time after live records are changed or deleted.",
    ],
  },
  {
    title: "International Data Transfers",
    paragraphs: [
      "Lofy relies on service providers and technical infrastructure that may process personal information in jurisdictions other than the country in which you reside. By using the Services, you understand that your information may be transferred to and processed in other jurisdictions, subject to applicable legal requirements.",
      "Where required by applicable law, we will use appropriate safeguards for cross-border transfers.",
    ],
  },
  {
    title: "Security",
    paragraphs: [
      "We implement administrative, technical, and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure. These measures may include encryption in transit, access restrictions, monitoring, authentication controls, and related safeguards appropriate to the nature of the Services.",
      "No method of transmission, storage, or processing is completely secure. Accordingly, we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Your Rights and Choices",
    bullets: [
      "You may access, update, or correct certain account information through the Services where those controls are available.",
      "You may request deletion of your account or personal information, subject to applicable legal, contractual, security, fraud-prevention, and recordkeeping requirements.",
      "You may disconnect Google or other approved integrations through the applicable provider settings or by contacting us where needed.",
      "Depending on your location, you may have additional rights under applicable privacy laws, including rights to access, portability, restriction, objection, or complaint.",
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      "The Services are not directed to children under 13, and we do not knowingly collect personal information directly from children under 13. If you believe a child has provided personal information to us, please contact us so we can review the matter and take appropriate steps.",
    ],
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. If we make changes, we will post the revised version on this page and update the \"Last updated\" date. Your continued use of the Services after the effective date of an updated Policy is subject to the revised Policy.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
            <Shield className="h-4 w-4" />
            Legal Notice
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            This Privacy Policy explains how Lofy AI processes personal information in connection
            with our website, AI assistant, messaging experiences, reminders, memories, scheduling
            features, integrations, subscriptions, and support operations.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: April 18, 2026</p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Database className="h-4 w-4 text-primary" />
              <span className="font-semibold">Data Categories</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Account records, prompts, messages, memories, reminders, calendar details,
              subscriptions, integrations, analytics, and security logs.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Bot className="h-4 w-4 text-primary" />
              <span className="font-semibold">AI Processing</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Lofy may use external AI providers to process prompts, context, and uploaded media
              needed to deliver requested assistant features.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              <span className="font-semibold">Third Parties</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              The Services rely on infrastructure, analytics, billing, communications, and
              integration providers, including approved connected services such as Google Calendar.
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
                  <p key={paragraph} className="mb-4 leading-7 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}

                {section.bullets ? (
                  <ul className="space-y-3 p-0">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex list-none items-start gap-3">
                        <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                        <span className="text-muted-foreground">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.note ? (
                  <div className="mt-5 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                    {section.note}
                  </div>
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
                Questions, privacy requests, and notices regarding this Privacy Policy may be sent
                to us at the address below.
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
                See also our <Link href="/terms" className="font-medium text-primary hover:underline">Terms of Service</Link>,{" "}
                <Link href="/cookie-policy" className="font-medium text-primary hover:underline">Cookie Policy</Link>, and{" "}
                <Link href="/gdpr" className="font-medium text-primary hover:underline">GDPR Notice</Link>.
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
