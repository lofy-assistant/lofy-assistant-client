"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Mail, ExternalLink } from "lucide-react";

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

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              GDPR Compliance
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Data Protection & Your Rights</p>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: February 3, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {/* Page Purpose */}
          <div className="mb-10">
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              Lofy AI complies with the General Data Protection Regulation (GDPR) (EU Regulation 2016/679). 
              This page explains how we operationalize GDPR compliance in plain language and how you can exercise your rights.
            </p>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                This page is a compliance summary and does not replace our formal{" "}
                <Link href="/resources/privacy-policy" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
                . The scope of GDPR applies to users located in the European Union (EU) and European Economic Area (EEA).
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">1</span>
              Who We Are Under GDPR
            </h2>
            <div className="pl-11">
              <div className="p-6 border rounded-xl bg-card border-border mb-6">
                <div className="space-y-4">
                  <div>
                    <strong className="block text-sm font-medium text-muted-foreground uppercase tracking-wider">Data Controller</strong>
                    <span className="text-lg font-medium text-foreground">Lofy AI</span>
                  </div>
                  <div>
                    <strong className="block text-sm font-medium text-muted-foreground uppercase tracking-wider">Contact</strong>
                    <a href="mailto:ilhamghaz@gmail.com" className="flex items-center gap-2 text-lg font-medium text-primary hover:underline">
                      <Mail className="w-4 h-4" />
                      ilhamghaz@gmail.com
                    </a>
                  </div>
                  <div>
                    <strong className="block text-sm font-medium text-muted-foreground uppercase tracking-wider">Jurisdiction</strong>
                    <span className="text-foreground">Malaysia</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                As the Data Controller, we are responsible for determining how your personal data is processed and for what purposes.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">2</span>
              Personal Data We Process
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">
                We process the following categories of personal data:
              </p>
              <div className="overflow-hidden border rounded-lg border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-foreground border-b border-border">Category</th>
                      <th className="px-4 py-3 font-semibold text-foreground border-b border-border">Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Account data</td>
                      <td className="px-4 py-3 text-muted-foreground">Name, email address, user ID</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Billing data</td>
                      <td className="px-4 py-3 text-muted-foreground">Invoices, payment metadata, transaction records</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Usage data</td>
                      <td className="px-4 py-3 text-muted-foreground">Feature usage, interaction logs, preferences</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Technical data</td>
                      <td className="px-4 py-3 text-muted-foreground">IP address, browser type, device information</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Support data</td>
                      <td className="px-4 py-3 text-muted-foreground">Support tickets, chat logs, communication history</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Integration data</td>
                      <td className="px-4 py-3 text-muted-foreground">Google Calendar data (with your permission)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">3</span>
              Legal Basis for Processing
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">
                Under GDPR, we must have a legal basis for processing your personal data. Here is our explicit mapping:
              </p>
              <div className="overflow-hidden border rounded-lg border-border mb-4">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-foreground border-b border-border">Purpose</th>
                      <th className="px-4 py-3 font-semibold text-foreground border-b border-border">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Account creation & service provision</td>
                      <td className="px-4 py-3 text-muted-foreground">Contract (Article 6(1)(b))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Billing & invoices</td>
                      <td className="px-4 py-3 text-muted-foreground">Legal obligation (Article 6(1)(c))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Security & fraud prevention</td>
                      <td className="px-4 py-3 text-muted-foreground">Legitimate interest (Article 6(1)(f))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Marketing emails</td>
                      <td className="px-4 py-3 text-muted-foreground">Consent (Article 6(1)(a))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Analytics cookies</td>
                      <td className="px-4 py-3 text-muted-foreground">Consent (Article 6(1)(a))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Customer support</td>
                      <td className="px-4 py-3 text-muted-foreground">Contract (Article 6(1)(b))</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground italic">
                This explicit mapping is a GDPR requirement and demonstrates our commitment to transparency.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">4</span>
              How Your Data Is Used
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">We use your personal data for the following purposes:</p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Provide and maintain our personal assistant services</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Process payments and manage billing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Maintain security and prevent fraud</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Improve our product and services (with your consent where required)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Provide customer support and respond to inquiries</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Comply with legal obligations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">5</span>
              Data Retention Policy
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this notice, unless a longer retention period is required by law.
              </p>
              <ul className="space-y-3 list-none p-0 mb-4">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Account data:</strong>
                    <span className="text-muted-foreground"> Retained while your account is active. After account deletion, data is permanently removed within 30 days, except where legally required to retain it.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Billing data:</strong>
                    <span className="text-muted-foreground"> Retained for 7 years as required by tax and accounting laws.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Support data:</strong>
                    <span className="text-muted-foreground"> Retained for 2 years after ticket resolution for quality assurance purposes.</span>
                  </div>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground italic">
                Backup data may be retained for up to 90 days before permanent deletion. You can request deletion at any time, subject to legal requirements.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">6</span>
              Your Rights Under GDPR
            </h2>
            <div className="pl-11">
              <p className="mb-6 text-muted-foreground">
                As an EU/EEA resident, you have the following rights regarding your personal data:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-5 border rounded-lg bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-1">Right to Access</h3>
                  <p className="text-sm text-muted-foreground mb-3">Request a copy of all personal data we hold about you.</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Action:</strong> Contact us or use in-app settings.
                  </p>
                </div>

                <div className="p-5 border rounded-lg bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-1">Right to Rectification</h3>
                  <p className="text-sm text-muted-foreground mb-3">Request correction of inaccurate or incomplete data.</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Action:</strong> Edit profile or contact us.
                  </p>
                </div>

                <div className="p-5 border rounded-lg bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-1">Right to Erasure</h3>
                  <p className="text-sm text-muted-foreground mb-3">Request deletion of your data ("right to be forgotten").</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Action:</strong> Delete account in settings.
                  </p>
                </div>

                <div className="p-5 border rounded-lg bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-1">Right to Data Portability</h3>
                  <p className="text-sm text-muted-foreground mb-3">Receive your data in a structured format (JSON/CSV).</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Action:</strong> Request export in settings.
                  </p>
                </div>

                <div className="p-5 border rounded-lg bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-1">Right to Restrict Processing</h3>
                  <p className="text-sm text-muted-foreground mb-3">Request we limit how we use your data.</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Action:</strong> Contact support.
                  </p>
                </div>

                <div className="p-5 border rounded-lg bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-1">Right to Withdraw Consent</h3>
                  <p className="text-sm text-muted-foreground mb-3">Withdraw consent for processing based on consent.</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Action:</strong> Update cookie preferences.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                   Right to Lodge a Complaint
                </h3>
                <p className="text-sm text-muted-foreground">
                   You have the right to file a complaint with your local data protection authority. For EU users, find your authority at{" "}
                   <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline inline-flex items-center gap-1">
                     edpb.europa.eu
                     <ExternalLink className="w-3 h-3" />
                   </a>
                   .
                </p>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">7</span>
              Data Sharing & Processors
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">
                We share your data only with trusted service providers (data processors) necessary to operate our services:
              </p>
              <ul className="space-y-3 list-none p-0 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Vercel:</strong>
                    <span className="text-muted-foreground"> Cloud hosting and frontend infrastructure</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Google Cloud Platform:</strong>
                    <span className="text-muted-foreground"> Backend infrastructure and hosting (Google Cloud Run)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">MongoDB:</strong>
                    <span className="text-muted-foreground"> Database storage</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Google APIs:</strong>
                    <span className="text-muted-foreground"> Calendar integration (with your explicit permission)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Payment Processors:</strong>
                    <span className="text-muted-foreground"> Stripe or other payment providers for billing</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Email Providers:</strong>
                    <span className="text-muted-foreground"> For transactional and support communications</span>
                  </div>
                </li>
              </ul>
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <strong>Important:</strong> All data processors operate under Data Processing Agreements (DPAs) that comply with GDPR requirements. 
                  We do not sell your personal data to third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">8</span>
              International Data Transfers
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">
                Some to our service providers are located outside the EU/EEA. When we transfer your data internationally, we ensure appropriate safeguards are in place:
              </p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Standard Contractual Clauses (SCCs):</strong>
                    <span className="text-muted-foreground"> We use EU-approved SCCs with all non-EU processors to ensure GDPR-level protection.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <div>
                    <strong className="text-foreground">Adequacy Decisions:</strong>
                    <span className="text-muted-foreground"> Where applicable, we rely on EU adequacy decisions for certain jurisdictions.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 9 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">9</span>
              Security Measures
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">
                We implement industry-standard security measures to protect your personal data:
              </p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Encryption in transit (TLS/SSL) and at rest</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Access controls and authentication mechanisms</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Regular security monitoring and logging</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Regular software updates and security patches</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 10 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">10</span>
              Cookies & Consent
            </h2>
            <div className="pl-11">
              <p className="mb-4 text-muted-foreground">
                We use cookies and similar technologies to enhance your experience. Under GDPR:
              </p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Essential cookies are necessary for the service to function and do not require consent</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">Non-essential cookies (analytics, marketing) require your opt-in consent</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-2.5 rounded-full shrink-0 bg-primary/70"></div>
                  <span className="text-muted-foreground">You can change your cookie preferences at any time in your account settings</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 11 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">11</span>
              How to Make a GDPR Request
            </h2>
            <div className="pl-11">
              <p className="mb-6 text-muted-foreground">
                To exercise your GDPR rights, you can:
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <div className="p-5 border rounded-lg bg-card border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <strong className="text-foreground">Email us</strong>
                  </div>
                  <a href="mailto:ilhamghaz@gmail.com" className="block mb-2 font-medium text-lg text-primary hover:underline">
                    ilhamghaz@gmail.com
                  </a>
                  <span className="text-sm text-muted-foreground">
                    Include "GDPR Request" in subject line.
                  </span>
                </div>
                <div className="p-5 border rounded-lg bg-card border-border">
                   <div className="flex items-center gap-2 mb-2">
                     <Shield className="w-5 h-5 text-primary" />
                     <strong className="text-foreground">In-app Controls</strong>
                   </div>
                   <p className="text-sm text-muted-foreground">
                     Use your account settings to download data, delete account, or update your profile.
                   </p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <p className="text-sm text-foreground">
                  <strong>Response Time:</strong> We will respond to your GDPR request within 30 days, as required by GDPR Article 12(3). 
                </p>
              </div>
            </div>
          </div>

          {/* Section 12 */}
          <div className="mb-10">
            <h2 className="flex items-baseline gap-3 mb-4 text-2xl font-bold text-foreground">
              <span className="flex items-center justify-center shrink-0 text-sm font-bold rounded-full w-8 h-8 bg-primary text-primary-foreground">12</span>
              Related Documents
            </h2>
            <div className="pl-11">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/resources/privacy-policy" className="block p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors border-border group">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">Privacy Policy</div>
                      <div className="text-sm text-muted-foreground">Complete privacy information</div>
                    </div>
                  </div>
                </Link>
                <Link href="/resources/terms" className="block p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors border-border group">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">Terms of Service</div>
                      <div className="text-sm text-muted-foreground">Service terms and conditions</div>
                    </div>
                  </div>
                </Link>
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
