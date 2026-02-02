"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">Lofy AI User Agreement</p>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: January 6, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Welcome to Lofy AI ("we," "our," or "us"). By using our services, you agree to the following Terms of Service. Please read them carefully.
          </p>

          {/* Section 1 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">1</span>
              Acceptance of Terms
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">By accessing or using Lofy AI, you agree to be bound by these Terms. If you do not agree, please discontinue use of the service.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">2</span>
              Our Services
            </h2>
            <div className="pl-11">
              <p className="mb-3 text-muted-foreground">Lofy AI is a personal WhatsApp assistant that helps you manage your daily activities, including Google Calendar integrations and other productivity tools.</p>
              <p className="text-muted-foreground">We reserve the right to modify, suspend, or discontinue our services at any time without prior notice.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">3</span>
              User Responsibilities
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">By using Lofy AI, you agree to:</p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Provide accurate information (e.g., name, email, phone number).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Use the service only for lawful purposes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Not attempt to disrupt, hack, or misuse the platform.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">4</span>
              Privacy
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">
                Your use of Lofy AI is also governed by our{" "}
                <Link href="/resources/privacy-policy" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
                , which describes how we collect, use, and protect your data.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">5</span>
              Google API Services
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">If you connect your Google Account, you agree that we may access and use Google Calendar data only as necessary to provide the service. You may revoke this access at any time in your Google Account settings.</p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">6</span>
              Intellectual Property
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">All rights, trademarks, and content related to Lofy AI remain our property. You may not copy, modify, or distribute our materials without permission.</p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">7</span>
              Disclaimer of Warranties
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">Lofy AI is provided "as is" and "as available." We do not guarantee that the service will always be error-free, secure, or available without interruption.</p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">8</span>
              Limitation of Liability
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">To the maximum extent permitted by law, Lofy AI shall not be held liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">9</span>
              Termination
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">We reserve the right to suspend or terminate your access if you violate these Terms or misuse the service.</p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">10</span>
              Governing Law
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">These Terms shall be governed by and interpreted in accordance with the laws of Malaysia, without regard to conflict of law principles.</p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">11</span>
              Contact Us
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">If you have questions about these Terms, you can contact us at:</p>
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-card border-border max-w-md">
                <span className="text-2xl">📧</span>
                <a href="mailto:ilhamghaz@gmail.com" className="text-lg font-medium text-primary hover:underline">
                  ilhamghaz@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Back to Home Button - Bottom */}
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
