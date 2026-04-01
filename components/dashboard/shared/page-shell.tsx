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

/**
 * Wraps a dashboard sub-page in the same warm-gradient + centred-card look
 * as DashboardHero, with a slide-up entrance animation.
 *
 * Mobile  : full-screen card, no background visible
 * Desktop : centred max-w-2xl card on peach gradient
 */
export function DashboardPageShell({
  title,
  description,
  icon,
  children,
  backHref = "/dashboard",
}: DashboardPageShellProps) {
  return (
    /* Outer wrapper — same gradient trick as DashboardHero */
    <div className="flex items-start md:items-stretch justify-center w-full min-h-dvh bg-[#faf6f2] md:bg-[linear-gradient(160deg,#f5c49a_0%,#f2aa7e_30%,#e8957c_60%,#dba07e_100%)]">

      {/* Card — slide-up on mount */}
      <div className="animate-page-slide-up relative w-full md:max-w-sm mx-auto md:my-10 bg-[#faf6f2] md:rounded-4xl md:shadow-2xl overflow-hidden flex flex-col min-h-dvh md:min-h-[calc(100dvh-5rem)]">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 shrink-0">
          <Link
            href={backHref}
            className="flex items-center gap-1 text-[#7a6a5a] hover:text-[#3d2e22] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            {icon && <span className="text-[#7a6a5a]">{icon}</span>}
            <h1 className="text-base font-semibold text-[#3d2e22]">{title}</h1>
          </div>

          {/* Right spacer to keep title centred */}
          <div className="w-14" />
        </div>

        {/* Thin divider */}
        <div className="mx-4 h-px bg-[#ede5da] shrink-0" />

        {/* ── Scrollable content area ── */}
        {description && (
          <p className="px-5 pt-4 text-sm text-[#9a8070]">{description}</p>
        )}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
