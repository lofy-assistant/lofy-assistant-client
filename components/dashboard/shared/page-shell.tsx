"use client";

import Link from "next/link";
import { ChevronLeft, X } from "lucide-react";

interface DashboardPageShellProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  backHref?: string;
  /** "close" = centered title and X (top-right), like a modal sheet */
  headerVariant?: "back" | "close";
}

export function DashboardPageShell({
  title,
  description,
  icon,
  children,
  backHref = "/dashboard",
  headerVariant = "back",
}: DashboardPageShellProps) {
  return (
    <div className="fixed inset-0 z-0 bg-[#faf6f2] md:bg-[linear-gradient(160deg,#f5c49a_0%,#f2aa7e_30%,#e8957c_60%,#dba07e_100%)] flex items-center justify-center">
      <div className="animate-page-slide-up w-full md:max-w-sm h-full md:h-[calc(100dvh-3rem)] bg-[#faf6f2] md:rounded-4xl md:shadow-2xl flex flex-col">

        {/* Fixed header */}
        {headerVariant === "close" ? (
          <div className="shrink-0 px-4 pt-5 pb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div />
            <h1 className="text-base font-semibold text-[#3d2e22] text-center min-w-0">{title}</h1>
            <div className="flex justify-end">
              <Link
                href={backHref}
                className="p-1.5 rounded-full text-[#7a6a5a] hover:text-[#3d2e22] hover:bg-black/4 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        ) : (
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
        )}

        <div className="shrink-0 mx-4 h-px bg-[#ede5da]" />

        {description && headerVariant !== "close" && (
          <p className="shrink-0 px-5 pt-3 pb-1 text-sm text-[#9a8070]">{description}</p>
        )}

        {/* Scroll area — the ONLY scrollable element on the page */}
        <div className="flex-1 overflow-y-scroll px-4 py-4">
          {children}
        </div>

        {/* Fade overlay — outside the scroll container, positioned at bottom of card */}
        <div
          aria-hidden="true"
          className="pointer-events-none h-10 -mt-10 shrink-0"
          style={{ background: "linear-gradient(to top, #faf6f2 0%, transparent 100%)" }}
        />
      </div>
    </div>
  );
}
