"use client";

import { useRouter } from "next/navigation";
import AppNavBar from "@/components/app-navbar";
import Footer from "@/components/brochure/home/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <h1 className="mb-4 text-5xl font-bold text-transparent lg:text-6xl bg-linear-to-r from-emerald-700 via-indigo-700 to-emerald-700 bg-clip-text">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">for Lofy AI</p>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: 08/09/2025</p>
          </div>

          {/* Content */}
          <div className="p-8 border shadow-xl bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl lg:p-12">
            <div className="prose prose-emerald max-w-none">
              <p className="mb-8 text-base leading-relaxed text-foreground">
                Lofy AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.
              </p>

              {/* Section 1 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">1</span>
                  Information We Collect
                </h2>
                <div className="ml-12">
                  <p className="mb-4 text-base leading-relaxed text-foreground">When you use Lofy AI, we may collect the following information:</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <div>
                        <strong className="text-foreground">Personal Information:</strong>
                        <span className="text-muted-foreground"> Your name, email address, and phone number.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <div>
                        <strong className="text-foreground">Google Account Data:</strong>
                        <span className="text-muted-foreground"> With your permission, we may access your Google Calendar and related information to help you manage events.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
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
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">2</span>
                  How We Use Your Information
                </h2>
                <div className="ml-12">
                  <p className="mb-4 text-base leading-relaxed text-foreground">We use the information we collect only for the following purposes:</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">To provide and improve our personal assistant services.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">To allow integration with Google Calendar and help you manage tasks/events.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">To communicate with you about updates, support, and security notices.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">To comply with legal obligations.</span>
                    </li>
                  </ul>
                  <p className="mt-6 text-base leading-relaxed text-foreground">We do not sell or share your personal data with third parties, except with trusted service providers necessary to operate our app (e.g., hosting providers, databases).</p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">3</span>
                  Data Storage & Security
                </h2>
                <div className="ml-12">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">Your data is stored securely on our servers using MongoDB and hosted backend infrastructure on Google Cloud Run.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">The frontend is hosted on Vercel.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">We apply industry-standard security measures to protect your data against unauthorized access, alteration, or disclosure.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">4</span>
                  Sharing with Third Parties
                </h2>
                <div className="ml-12">
                  <p className="mb-4 text-base leading-relaxed text-foreground">We may share limited data with:</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <div>
                        <strong className="text-foreground">Google APIs:</strong>
                        <span className="text-muted-foreground"> To provide integrations (e.g., Google Calendar).</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <div>
                        <strong className="text-foreground">Service Providers:</strong>
                        <span className="text-muted-foreground"> Such as hosting and database providers, only as needed to operate the app.</span>
                      </div>
                    </li>
                  </ul>
                  <p className="mt-6 text-base leading-relaxed text-foreground">We do not share your information with advertisers or unrelated third parties.</p>
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">5</span>
                  User Rights
                </h2>
                <div className="ml-12">
                  <p className="mb-4 text-base leading-relaxed text-foreground">You have the right to:</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">Request access to the personal data we hold about you.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">Request correction or deletion of your data.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-indigo-500"></div>
                      <span className="text-muted-foreground">Revoke permissions granted to Google APIs at any time from your Google Account settings.</span>
                    </li>
                  </ul>
                  <div className="p-6 mt-6 shadow-lg bg-linear-to-r from-emerald-500/10 to-indigo-500/10 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                    <p className="text-sm text-foreground">
                      <strong>Contact us:</strong> To exercise these rights, please contact us at{" "}
                      <a href="mailto:ilhamghaz@gmail.com" className="font-medium transition-colors text-emerald-600 hover:text-indigo-600 hover:underline">
                        ilhamghaz@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">6</span>
                  Children&apos;s Privacy
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">Our services are not directed to individuals under the age of 13, and we do not knowingly collect data from them.</p>
                </div>
              </div>

              {/* Section 7 */}
              <div className="mb-10">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">7</span>
                  Changes to This Privacy Policy
                </h2>
                <div className="ml-12">
                  <p className="text-base leading-relaxed text-muted-foreground">We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated &quot;Last updated&quot; date.</p>
                </div>
              </div>

              {/* Section 8 */}
              <div className="mb-8">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-foreground">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-linear-to-r from-emerald-500 to-indigo-500 text-white shadow-lg">8</span>
                  Contact Us
                </h2>
                <div className="ml-12">
                  <p className="mb-6 text-base leading-relaxed text-foreground">If you have any questions or requests about this Privacy Policy, you may contact us at:</p>
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
