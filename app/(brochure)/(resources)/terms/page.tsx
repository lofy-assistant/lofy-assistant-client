"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CreditCard, Mail, Scale } from "lucide-react";

import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Acceptance of Terms",
    paragraphs: [
      "These Terms of Service govern your access to and use of the Lofy AI website, applications, chat experiences, integrations, subscriptions, and related services (collectively, the \"Services\"). By accessing or using the Services, you agree to be bound by these Terms.",
      "If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization to these Terms.",
    ],
  },
  {
    title: "Description of the Services",
    paragraphs: [
      "Lofy provides an AI-powered assistant designed to help users manage reminders, events, memories, conversational workflows, connected-service interactions, and related productivity tasks across supported channels and interfaces.",
      "Certain features may depend on third-party providers, connected accounts, paid plans, geographic availability, platform limitations, or evolving product capabilities. We may modify, suspend, or discontinue features at any time.",
    ],
  },
  {
    title: "Eligibility and Account Responsibilities",
    bullets: [
      "You must provide accurate information when creating or maintaining an account.",
      "You are responsible for maintaining the confidentiality of your credentials, verification methods, devices, and any connected third-party accounts.",
      "You are responsible for activities that occur through your account unless caused by our breach of these Terms or applicable law.",
      "You must promptly notify us if you believe your account or connected services have been compromised.",
    ],
  },
  {
    title: "Acceptable Use",
    paragraphs: [
      "You agree not to misuse the Services. Without limitation, you may not:",
    ],
    bullets: [
      "Use the Services for unlawful, harmful, fraudulent, infringing, abusive, deceptive, or defamatory activity.",
      "Upload, submit, or transmit content that violates intellectual property, privacy, publicity, confidentiality, or other rights of any person or entity.",
      "Interfere with, disrupt, probe, reverse engineer, scrape, or attempt to gain unauthorized access to the Services, systems, models, or related infrastructure.",
      "Use the Services to distribute malware, spam, unauthorized advertising, or harmful automated traffic.",
      "Use the Services in a manner that could create unreasonable risk of harm, including for emergency, high-risk, or safety-critical decision-making without appropriate human review.",
    ],
  },
  {
    title: "AI Output and Product Limitations",
    paragraphs: [
      "Lofy uses AI systems and related automation to generate responses and perform assistant functions. AI-generated output may be incomplete, inaccurate, outdated, or unsuitable for your particular circumstances.",
      "You are solely responsible for reviewing outputs, decisions, reminders, calendar actions, and other content before relying on them. The Services are not a substitute for professional judgment.",
    ],
    bullets: [
      "The Services do not provide legal, medical, financial, accounting, emergency, or other regulated professional advice.",
      "You should independently verify important outputs, dates, scheduling actions, reminders, and third-party integrations before acting on them.",
      "We do not guarantee uninterrupted availability, successful delivery of every notification, or error-free AI behavior.",
    ],
  },
  {
    title: "User Content and License",
    paragraphs: [
      "You retain rights you may have in the prompts, messages, files, memories, reminders, calendar data, feedback, and other content you submit to the Services (\"User Content\").",
      "You grant Lofy a non-exclusive, worldwide, limited license to host, store, reproduce, adapt, transmit, display, and otherwise process User Content as necessary to operate, secure, maintain, troubleshoot, and improve the Services, enforce these Terms, and comply with applicable law.",
    ],
  },
  {
    title: "Third-Party Services and Integrations",
    paragraphs: [
      "The Services may interoperate with third-party services such as Google Calendar, messaging platforms, payment providers, communications vendors, analytics vendors, and AI providers. Your use of third-party services may be governed by separate terms and privacy notices issued by those parties.",
      "If you authorize a third-party integration, you instruct us to access, use, and exchange relevant data with that provider as needed to deliver the requested feature. You are responsible for reviewing and managing permissions granted to connected third-party accounts.",
    ],
  },
  {
    title: "Subscriptions, Billing, and Payments",
    bullets: [
      "Certain features may require a paid subscription.",
      "Paid subscriptions may renew automatically unless canceled before the next renewal date, subject to the billing terms presented at checkout.",
      "Payments are processed through third-party billing providers, including Stripe. We do not control the independent operation of those processors.",
      "You authorize us and our billing providers to charge the applicable fees, taxes, and recurring amounts associated with your selected plan.",
      "Except as required by law or expressly stated otherwise, fees are non-refundable and partially used billing periods are not prorated.",
      "If you cancel a subscription, continued access to paid features may remain available through the end of the current paid billing period unless otherwise stated.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "The Services, including our software, design, branding, interfaces, compilations, and related materials, are owned by Lofy or our licensors and are protected by applicable intellectual property laws.",
      "Except as expressly permitted by these Terms, you may not copy, reproduce, distribute, modify, create derivative works from, license, sell, or exploit any portion of the Services.",
    ],
  },
  {
    title: "Suspension and Termination",
    paragraphs: [
      "We may suspend, restrict, or terminate your access to the Services if we reasonably believe you have violated these Terms, created legal or security risk, failed to pay applicable fees, or used the Services in a manner that could harm Lofy, other users, or third parties.",
      "You may stop using the Services at any time. Sections that by their nature should survive termination will survive, including provisions relating to payment obligations, intellectual property, disclaimers, liability limitations, and dispute-related terms.",
    ],
  },
  {
    title: "Disclaimer of Warranties",
    paragraphs: [
      "To the maximum extent permitted by law, the Services are provided on an \"as is\" and \"as available\" basis. We disclaim all warranties, whether express, implied, statutory, or otherwise, including implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, and quiet enjoyment.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, Lofy and its affiliates, officers, employees, agents, suppliers, and licensors will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, revenues, goodwill, data, or business opportunities, arising out of or relating to the Services.",
      "To the maximum extent permitted by law, our aggregate liability for claims arising out of or relating to the Services will not exceed the greater of (a) the amount you paid us for the Services during the three months preceding the event giving rise to the claim or (b) one hundred U.S. dollars (USD 100).",
    ],
  },
  {
    title: "Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of Malaysia, without regard to conflict-of-law principles, unless applicable consumer protection law in your jurisdiction requires otherwise.",
    ],
  },
];

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-background text-foreground">


      {/* Main Content */}
      <div className="container px-4 py-16 mx-auto sm:px-6 lg:px-8 max-w-5xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-8 pl-0 hover:bg-transparent hover:text-primary group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Button>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Scale className="h-4 w-4" />
            User Agreement
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            Terms of Service
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            These Terms govern your use of Lofy AI as an AI assistant product, including account
            access, connected services, paid subscriptions, generated output, and related
            communications.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: April 18, 2026</p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <span className="font-semibold">AI Output</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              AI output may be incomplete or inaccurate and should be reviewed before use.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="font-semibold">Subscriptions</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Certain features may require paid plans billed through third-party processors such as
              Stripe.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Scale className="h-4 w-4 text-primary" />
              <span className="font-semibold">Responsibilities</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              You remain responsible for account security, lawful use, and verifying important
              outputs and integrations.
            </p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Please read these Terms carefully. By using the Services, you agree that these Terms
            form a binding agreement between you and Lofy AI.
          </p>

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
              Privacy and Related Policies
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">
                Your use of the Services is also subject to our{" "}
                <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
                ,{" "}
                <Link href="/cookie-policy" className="font-medium text-primary hover:underline">
                  Cookie Policy
                </Link>
                , and, where applicable, our{" "}
                <Link href="/gdpr" className="font-medium text-primary hover:underline">
                  GDPR Notice
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 flex items-baseline gap-3 text-2xl font-bold text-foreground">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {sections.length + 2}
              </span>
              Contact
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">
                If you have questions about these Terms, please contact us at:
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
            </div>
          </section>

          <div className="mt-16 pt-8 border-t border-border">
            <Button onClick={() => router.push("/")} size="lg" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </div>
        </div>
      </div>


    </div>
  );
}
