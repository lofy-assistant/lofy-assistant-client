"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface DashboardPageShellProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  backHref?: string;
}

export function DashboardPageShell({ title, description, icon, children, backHref = "/dashboard" }: DashboardPageShellProps) {
  return (
    <div className="fixed inset-0 z-0 bg-[#faf6f2] md:bg-[linear-gradient(160deg,#f5c49a_0%,#f2aa7e_30%,#e8957c_60%,#dba07e_100%)] flex items-center justify-center">
      <div className="animate-page-slide-up h-full w-full rounded-b-[2rem] bg-[#faf6f2] md:h-[calc(100dvh-3rem)] md:max-w-sm md:rounded-4xl md:shadow-2xl flex flex-col">

        {/* Fixed header */}
        <div className="shrink-0 px-4 pt-5 pb-3 flex items-center justify-between">
          <Link href={backHref} className="flex items-center gap-1 text-[#7a6a5a] hover:text-[#3d2e22] transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            {icon && <span className="text-[#7a6a5a]">{icon}</span>}
            <h1 className="text-base font-semibold text-[#3d2e22]">{title}</h1>
          </div>
          <div className="w-14" />
        </div>

        <div className="shrink-0 mx-4 h-px bg-[#ede5da]" />

        {description && (
          <p className="shrink-0 px-5 pt-3 pb-1 text-sm text-[#9a8070]">{description}</p>
        )}

        {/* Scroll area — the ONLY scrollable element on the page */}
        <div className="scrollbar-hidden r flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>

        {/* Fade overlay — outside the scroll container, positioned at bottom of card */}
        <div
          aria-hidden="true"
          className="pointer-events-none h-10 -mt-10 shrink-0 rounded-b-[2rem] bg-[#faf6f2] md:h-16 md:rounded-4xl"
          style={{ background: "linear-gradient(to top, #faf6f2 0%, transparent 100%)" }}
        />
      </div>
    </div>
  );
}
