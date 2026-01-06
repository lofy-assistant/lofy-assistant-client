"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNavBar from "@/components/app-navbar";
import Footer from "@/components/brochure/home/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute rounded-full top-10 right-1/4 w-96 h-96 bg-linear-to-r from-purple-400/20 to-teal-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full top-1/3 left-1/4 w-96 h-96 bg-linear-to-r from-violet-400/20 to-indigo-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full bottom-1/4 right-1/3 w-96 h-96 bg-linear-to-r from-green-400/20 to-fuchsia-400/20 blur-3xl animate-pulse"></div>
      </div>

      <AppNavBar />

      {/* Main Content */}
      <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold text-transparent lg:text-6xl bg-linear-to-r from-emerald-700 via-indigo-700 to-emerald-700 bg-clip-text">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">for Lofy AI</p>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: January 6, 2026</p>
          </div>

          {/* Content */}
          <div className="p-8 border shadow-xl bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl lg:p-12">
            <div className="prose prose-emerald max-w-none">
              <p className="mb-8 text-base leading-relaxed text-foreground">Welcome to Lofy AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By using our services, you agree to the following Terms of Service. Please read them carefully.</p>

              {/* Section 1 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">1</span>
                  Acceptance of Terms
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">By accessing or using Lofy AI, you agree to be bound by these Terms. If you do not agree, please discontinue use of the service.</p>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">2</span>
                  Our Services
                </h2>
                <div className="ml-12">
                  <p className="mb-4 text-base leading-relaxed text-muted-foreground">Lofy AI is a personal WhatsApp assistant that helps you manage your daily activities, including Google Calendar integrations and other productivity tools.</p>
                  <p className="text-base leading-relaxed text-muted-foreground">We reserve the right to modify, suspend, or discontinue our services at any time without prior notice.</p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">3</span>
                  User Responsibilities
                </h2>
                <div className="ml-12">
                  <p className="mb-4 text-base leading-relaxed text-foreground">By using Lofy AI, you agree to:</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">Provide accurate information (e.g., name, email, phone number).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">Use the service only for lawful purposes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">Not attempt to disrupt, hack, or misuse the platform.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">4</span>
                  Privacy
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Your use of Lofy AI is also governed by our{" "}
                    <Link href="/resources/privacy-policy" className="font-medium transition-colors text-emerald-600 hover:text-indigo-600 hover:underline">
                      Privacy Policy
                    </Link>
                    , which describes how we collect, use, and protect your data.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">5</span>
                  Google API Services
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">If you connect your Google Account, you agree that we may access and use Google Calendar data only as necessary to provide the service. You may revoke this access at any time in your Google Account settings.</p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">6</span>
                  Intellectual Property
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">All rights, trademarks, and content related to Lofy AI remain our property. You may not copy, modify, or distribute our materials without permission.</p>
                </div>
              </div>

              {/* Section 7 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">7</span>
                  Disclaimer of Warranties
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">Lofy AI is provided &quot;as is&quot; and &quot;as available.&quot; We do not guarantee that the service will always be error-free, secure, or available without interruption.</p>
                </div>
              </div>

              {/* Section 8 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">8</span>
                  Limitation of Liability
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">To the maximum extent permitted by law, Lofy AI shall not be held liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
                </div>
              </div>

              {/* Section 9 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">9</span>
                  Termination
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">We reserve the right to suspend or terminate your access if you violate these Terms or misuse the service.</p>
                </div>
              </div>

              {/* Section 10 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">10</span>
                  Governing Law
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">These Terms shall be governed by and interpreted in accordance with the laws of Malaysia, without regard to conflict of law principles.</p>
                </div>
              </div>

              {/* Section 11 */}
              <div className="mb-8">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">11</span>
                  Contact Us
                </h2>
                <div className="ml-12">
                  <p className="mb-6 text-base leading-relaxed text-foreground">If you have questions about these Terms, you can contact us at:</p>
                  <div className="p-6 border shadow-lg bg-card border-border rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">📧</span>
                      <a href="mailto:ilhamghaz@gmail.com" className="text-lg font-medium transition-colors text-emerald-600 hover:text-indigo-600 hover:underline">
                        ilhamghaz@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Button onClick={() => router.push("/")} size="lg" className="px-8 py-6 text-lg transition-all duration-300 shadow-lg bg-linear-to-r from-emerald-600 to-indigo-600 hover:shadow-xl hover:scale-105">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
