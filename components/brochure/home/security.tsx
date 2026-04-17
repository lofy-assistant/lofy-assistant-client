"use client";

import { ShieldCheck, Lock, KeyRound, ServerCrash, BadgeCheck, EyeOff } from "lucide-react";

const pillars = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data in transit and at rest is encrypted using AES-256, ensuring no one, not even us, can read your messages.",
  },
  {
    icon: KeyRound,
    title: "Zero-Knowledge Architecture",
    description: "Your credentials and sensitive information are never stored in plaintext. We apply salted hashing and key derivation at every layer.",
  },
  {
    icon: EyeOff,
    title: "Privacy by Design",
    description: "We collect only what is strictly necessary. Your data is never sold, shared, or used to train external models.",
  },
];

export default function Security() {
  return (
    <section className="bg-neutral-950 py-20 px-4 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4" />
            Enterprise-Grade Security
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Your data is safe with us</h2>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">We take security seriously. Every interaction with Lofy is protected by the same standards trusted by leading enterprises worldwide.</p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-emerald-500/40 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-neutral-500 text-sm">
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-500" /> AES-256 Encryption
          </span>
          <span className="w-px h-4 bg-neutral-700 hidden sm:block" />
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-emerald-500" /> Privacy Focused
          </span>
          <span className="w-px h-4 bg-neutral-700 hidden sm:block" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure by Design
          </span>
          <span className="w-px h-4 bg-neutral-700 hidden sm:block" />
          <span className="flex items-center gap-1.5">
            <EyeOff className="w-4 h-4 text-emerald-500" /> No Data Selling
          </span>
        </div>
      </div>
    </section>
  );
}
