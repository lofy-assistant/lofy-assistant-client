"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Mail, Scale, Shield } from "lucide-react";

const sections = [
  {
    title: "Who This Notice Applies To",
    paragraphs: [
      "This GDPR Notice provides additional information for users in the European Economic Area, United Kingdom, and Switzerland, or any user whose personal data is processed under the General Data Protection Regulation or similar regional data protection laws.",
      "This notice supplements, and should be read together with, our Privacy Policy.",
    ],
  },
  {
    title: "Controller Information",
    paragraphs: [
      "For purposes of the Services described in this notice, Lofy AI acts as the controller of personal data processed through the website, account system, AI assistant, reminders, memories, scheduling features, subscriptions, and related integrations.",
    ],
  },
  {
    title: "Categories of Personal Data",
    bullets: [
      "Identity and account data, such as phone number, email address, profile details, and account identifiers.",
      "Authentication and security data, including session-related information, verification records, and access-control logs.",
      "User-submitted content, including prompts, messages, memories, reminders, calendar details, feedback, uploaded audio, and uploaded images.",
      "Integration and connected-account data, including Google Calendar-related authorization and event references where you approve such access.",
      "Billing and subscription data, including subscription status, plan information, and payment-related metadata handled with billing providers.",
      "Operational, analytics, and diagnostic data used to maintain, secure, and improve the Services.",
    ],
  },
  {
    title: "Legal Bases for Processing",
    bullets: [
      "Performance of a contract, where processing is necessary to provide the Services you request, maintain your account, process reminders or events, and operate approved integrations.",
      "Legitimate interests, where processing is reasonably necessary to secure the Services, prevent abuse, maintain logs, troubleshoot failures, understand usage, and improve service quality.",
      "Compliance with legal obligations, where we must retain records, respond to lawful requests, or satisfy regulatory, tax, accounting, or enforcement requirements.",
      "Consent, where required by applicable law for specific types of optional processing or integration permissions.",
    ],
  },
  {
    title: "International Transfers",
    paragraphs: [
      "Your personal data may be transferred to and processed in countries outside the EEA, UK, or Switzerland because the Services rely on international infrastructure, cloud vendors, analytics providers, communications providers, payment processors, integration providers, and AI providers.",
      "Where required by applicable law, we will rely on appropriate transfer mechanisms or safeguards for such transfers.",
    ],
  },
  {
    title: "Retention",
    paragraphs: [
      "We retain personal data for as long as reasonably necessary to provide the Services, maintain operational and security records, comply with legal obligations, resolve disputes, and enforce our agreements. Retention periods vary based on the category of data and the legal or operational purpose involved.",
      "We may also maintain limited backup, archival, or logging records for a period of time after active records are changed or deleted.",
    ],
  },
  {
    title: "Your Rights",
    bullets: [
      "Access the personal data we hold about you.",
      "Request correction of inaccurate or incomplete personal data.",
      "Request deletion of personal data in circumstances permitted by law.",
      "Request restriction of certain processing activities.",
      "Object to processing based on legitimate interests where applicable.",
      "Request portability of personal data where the right applies.",
      "Withdraw consent where processing depends on consent.",
      "Lodge a complaint with your local supervisory authority.",
    ],
  },
  {
    title: "Exercising Your Rights",
    paragraphs: [
      "You may contact us to exercise your privacy rights or ask questions about how your personal data is processed. We may request information necessary to verify your identity before fulfilling certain requests.",
      "You may also manage some profile, account, and integration settings directly through the Services where those controls are available.",
    ],
  },
];

export default function GDPRPage() {
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
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              GDPR Compliance
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Additional information for users covered by GDPR</p>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: April 18, 2026</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="mb-10 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            This page is an additional notice for GDPR-related transparency and rights information. It
            does not replace our{" "}
            <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </div>

          <div className="mb-10 rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              <div>
                <strong className="block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Controller
                </strong>
                <span className="text-lg font-medium text-foreground">Lofy AI</span>
              </div>
              <div>
                <strong className="block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Contact
                </strong>
                <a
                  href="mailto:ilhamghaz@gmail.com"
                  className="flex items-center gap-2 text-lg font-medium text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  ilhamghaz@gmail.com
                </a>
              </div>
              <div>
                <strong className="block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Governing Entity Information
                </strong>
                <span className="text-foreground">Malaysia</span>
              </div>
            </div>
          </div>

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
              Complaint Rights and Related Documents
            </h2>
            <div className="pl-11">
              <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                You may file a complaint with your local supervisory authority. For a list of EEA
                supervisory authorities, see{" "}
                <a
                  href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  edpb.europa.eu
                  <ExternalLink className="h-3 w-3" />
                </a>
                .
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link
                  href="/privacy-policy"
                  className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-3">
                    <Shield className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary">
                        Privacy Policy
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Complete privacy information
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/terms"
                  className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-3">
                    <Scale className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary">
                        Terms of Service
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Service terms and conditions
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/cookie-policy"
                  className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-3">
                    <Shield className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary">
                        Cookie Policy
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Cookie and similar technology disclosures
                      </div>
                    </div>
                  </div>
                </Link>
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
