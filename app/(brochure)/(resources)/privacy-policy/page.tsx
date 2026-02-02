"use client";

import { useRouter } from "next/navigation";
import AppNavBar from "@/components/app-navbar";
import Footer from "@/components/brochure/home/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AppNavBar />

      {/* Main Content */}
      <div className="container px-4 py-16 mx-auto sm:px-6 lg:px-8 max-w-5xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-8 pl-0 hover:bg-transparent hover:text-primary group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">Lofy AI Data Protection & Privacy</p>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: 08/09/2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Lofy AI ("we," "our," or "us") respects your privacy and is committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.
          </p>

          {/* Section 1 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">1</span>
              Information We Collect
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">When you use Lofy AI, we may collect the following information:</p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Personal Information:</strong>
                    <span className="text-muted-foreground"> Your name, email address, and phone number.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Google Account Data:</strong>
                    <span className="text-muted-foreground"> With your permission, we may access your Google Calendar and related information to help you manage events.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Usage Data:</strong>
                    <span className="text-muted-foreground"> Information about how you interact with the app to improve our services.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">2</span>
              How We Use Your Information
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">We use the information we collect only for the following purposes:</p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">To provide and improve our personal assistant services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">To allow integration with Google Calendar and help you manage tasks/events.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">To communicate with you about updates, support, and security notices.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">To comply with legal obligations.</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">We do not sell or share your personal data with third parties, except with trusted service providers necessary to operate our app (e.g., hosting providers, databases).</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">3</span>
              Data Storage & Security
            </h2>
            <div className="pl-11">
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Your data is stored securely on our servers using MongoDB and hosted backend infrastructure on Google Cloud Run.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">The frontend is hosted on Vercel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">We apply industry-standard security measures to protect your data against unauthorized access, alteration, or disclosure.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">4</span>
              Sharing with Third Parties
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">We may share limited data with:</p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Google APIs:</strong>
                    <span className="text-muted-foreground"> To provide integrations (e.g., Google Calendar).</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Service Providers:</strong>
                    <span className="text-muted-foreground"> Such as hosting and database providers, only as needed to operate the app.</span>
                  </div>
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">We do not share your information with advertisers or unrelated third parties.</p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">5</span>
              User Rights
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">You have the right to:</p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Request access to the personal data we hold about you.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Request correction or deletion of your data.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Revoke permissions granted to Google APIs at any time from your Google Account settings.</span>
                </li>
              </ul>
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Contact us:</strong> To exercise these rights, please contact us at{" "}
                  <a href="mailto:ilhamghaz@gmail.com" className="font-medium text-primary hover:underline">
                    ilhamghaz@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">6</span>
              Children&apos;s Privacy
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">Our services are not directed to individuals under the age of 13, and we do not knowingly collect data from them.</p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">7</span>
              Changes to This Privacy Policy
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground">We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated "Last updated" date.</p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">8</span>
              Contact Us
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">If you have any questions or requests about this Privacy Policy, you may contact us at:</p>
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

      <Footer />
    </div>
  );
}
