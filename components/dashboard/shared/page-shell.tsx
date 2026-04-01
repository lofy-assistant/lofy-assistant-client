"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface DashboardPageShellProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  /** Override the back destination. Defaults to /dashboard */
  backHref?: string;
}

export function DashboardPageShell({ title, description, icon, children, backHref = "/dashboard" }: DashboardPageShellProps) {
  return (
    /* ── Outer wrapper: always fills the viewport, gradient always visible ── */
    <div className="flex items-center justify-center w-full h-dvh bg-[linear-gradient(160deg,#f5c49a_0%,#f2aa7e_30%,#e8957c_60%,#dba07e_100%)]">
      {/*
        ── Card ──
        Fixed height so it never grows beyond the viewport.
        my-6 = 1.5rem top + 1.5rem bottom = 3rem total, subtracted from 100dvh.
      */}
      <div className="animate-page-slide-up relative w-full max-w-sm mx-auto my-6 bg-[#faf6f2] rounded-4xl shadow-2xl flex flex-col h-[calc(100dvh-3rem)] overflow-hidden">
        {/* ── Top bar — fixed, never scrolls ── */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 shrink-0">
          <Link href={backHref} className="flex items-center gap-1 text-[#7a6a5a] hover:text-[#3d2e22] transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            {icon && <span className="text-[#7a6a5a]">{icon}</span>}
            <h1 className="text-base font-semibold text-[#3d2e22]">{title}</h1>
          </div>

          {/* Spacer to keep title centred */}
          <div className="w-14" />
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-[#ede5da] shrink-0" />

        {/* Optional description — fixed, never scrolls */}
        {description && <p className="px-5 pt-3 pb-1 text-sm text-[#9a8070] shrink-0">{description}</p>}

        {/*
          ── Scrollable content area ──
          relative + flex-1 + min-h-0 establishes a height-constrained box.
          The inner div uses absolute inset-0 — the most reliable cross-browser
          way to make overflow-y-auto actually scroll inside a flex child.
        */}
        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0 overflow-y-auto px-4 py-4">{children}</div>

          {/* Bottom fade — visual cue that content continues */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 rounded-b-4xl"
            style={{
              background: "linear-gradient(to top, #faf6f2 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
