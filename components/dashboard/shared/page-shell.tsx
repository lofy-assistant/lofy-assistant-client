"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { dnc } from "@/lib/dashboard-night";
import { useDashboardNight } from "@/components/dashboard/shared/dashboard-night-provider";

interface DashboardPageShellProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  backHref?: string;
  scrollClassName?: string;
}

export function DashboardPageShell({
  title,
  description,
  icon,
  children,
  backHref = "/dashboard",
  scrollClassName,
}: DashboardPageShellProps) {
  const { isNight: night } = useDashboardNight();

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 flex items-center justify-center",
        dnc.pageBg(night),
        !night && dnc.pageShellDayBg
      )}
    >
      <div
        className={cn(
          "animate-page-slide-up h-full w-full flex flex-col rounded-b-[2rem] md:h-[calc(100dvh-3rem)] md:max-w-sm md:rounded-4xl md:shadow-2xl",
          dnc.card(night),
          night && "md:shadow-black/50"
        )}
      >
        {/* Fixed header */}
        <div className="flex shrink-0 items-center justify-between px-4 pb-3 pt-5">
          <Link
            href={backHref}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              night
                ? "text-[#9a8f85] hover:text-[#e8ddd4]"
                : "text-[#7a6a5a] hover:text-[#3d2e22]"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            {icon && (
              <span className={night ? "text-[#9a8f85]" : "text-[#7a6a5a]"}>
                {icon}
              </span>
            )}
            <h1
              className={cn(
                "text-sm font-semibold",
                night ? "text-[#e8ddd4]" : "text-[#3d2e22]"
              )}
            >
              {title}
            </h1>
          </div>
          <div className="w-14" />
        </div>

        <div className={cn("mx-4 h-px shrink-0", dnc.borderSubtle(night))} />

        {description && (
          <p
            className={cn(
              "shrink-0 px-5 pb-1 pt-3 text-xs",
              night ? "text-[#9a8f85]" : "text-[#9a8070]"
            )}
          >
            {description}
          </p>
        )}

        {/* Scroll area: the ONLY scrollable element on the page */}
        <div
          className={cn(
            "scrollbar-hidden r flex-1 overflow-y-auto px-4 py-4",
            scrollClassName
          )}
        >
          {children}
        </div>

        {/* Fade overlay: outside the scroll container, positioned at bottom of card */}
        <div
          aria-hidden="true"
          className="pointer-events-none -mt-10 h-10 shrink-0 rounded-b-[2rem] bg-transparent md:h-16 md:rounded-4xl"
          style={{
            background: `linear-gradient(to top, ${dnc.fadeFrom(night)} 0%, transparent 100%)`,
          }}
        />
      </div>
    </div>
  );
}
