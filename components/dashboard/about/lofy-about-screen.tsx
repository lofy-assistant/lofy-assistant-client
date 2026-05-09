"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDashboardNight } from "@/components/dashboard/shared/dashboard-night-provider";
import {
  BarChart3,
  Bug,
  ChevronRight,
  HelpCircle,
  Info,
  Lock,
  Scale,
  X,
} from "lucide-react";

/** TikTok brand mark (no Lucide/Tabler icon in our deps). */
function TikTokIcon({
  className,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

type AboutRow = {
  href: string;
  label: string;
  external?: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const PRIMARY_LINKS: AboutRow[] = [
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/guides", label: "Guide", icon: HelpCircle },
  { href: "/dashboard/feedback", label: "Report a Bug", icon: Bug },
  { href: "/privacy-policy", label: "Privacy Policy", icon: Lock },
  { href: "/terms", label: "Terms of Service", icon: Scale },
];

const SECONDARY_LINKS: AboutRow[] = [
  { href: "/about-us", label: "About Lofy", icon: Info },
  {
    href: "https://tiktok.com",
    label: "TikTok",
    external: true,
    icon: TikTokIcon,
  },
];

function LinkRow({
  href,
  label,
  external,
  icon: Icon,
  night,
}: AboutRow & { night: boolean }) {
  const className = cn(
    "flex items-center gap-3 px-4 py-3.5 text-sm transition-colors md:py-2.5",
    night
      ? "text-[#e8ddd4] hover:bg-white/5 active:bg-white/10"
      : "text-[#1a1a1a] hover:bg-neutral-50 active:bg-neutral-100/80"
  );

  const content = (
    <>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center",
          night ? "text-[#7a8a9a]" : "text-neutral-400"
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1 font-medium">{label}</span>
      <ChevronRight
        className={cn(
          "h-4 w-4 shrink-0",
          night ? "text-white/20" : "text-neutral-300"
        )}
        aria-hidden
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function LinkGroup({ rows, night }: { rows: AboutRow[]; night: boolean }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border",
        night
          ? "border-white/10 bg-white/5"
          : "border-neutral-200 bg-white"
      )}
    >
      <div
        className={cn("divide-y", night ? "divide-white/10" : "divide-neutral-100")}
      >
        {rows.map((row) => (
          <LinkRow key={row.label} {...row} night={night} />
        ))}
      </div>
    </div>
  );
}

export function LofyAboutScreen() {
  const { isNight: night } = useDashboardNight();

  return (
    <div
      className={cn(
        "fixed inset-0 z-0 flex flex-col",
        night
          ? "bg-[#0a1524] md:bg-[linear-gradient(160deg,#0c1a2e_0%,#0a1526_45%,#07121e_100%)]"
          : "bg-white"
      )}
    >
      <header className="flex shrink-0 justify-end px-4 pb-2 pt-4">
        <Link
          href="/dashboard"
          className={cn(
            "rounded-full p-2 transition-colors",
            night
              ? "text-[#9a8f85] hover:bg-white/10 hover:text-[#e8ddd4]"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          )}
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </Link>
      </header>

      <div className="scrollbar-hidden mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-5 pb-10">
        <div className="flex flex-col items-center pb-8 pt-2">
          <div className="relative h-20 w-20">
            <Image
              src="/assets/icons/lofy-logo-1.png"
              alt="Lofy"
              fill
              className="object-contain"
              sizes="80px"
              priority
            />
          </div>
          <h1
            className={cn(
              "mt-4 text-lg font-semibold tracking-tight",
              night ? "text-[#e8ddd4]" : "text-neutral-900"
            )}
          >
            Lofy AI
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <LinkGroup rows={PRIMARY_LINKS} night={night} />
          <LinkGroup rows={SECONDARY_LINKS} night={night} />
        </div>

        <p
          className={cn(
            "mt-10 text-center text-xs leading-relaxed",
            night ? "text-[#6a7380]" : "text-neutral-400"
          )}
        >
          Made with love, Malaysia 🇲🇾
          <br />
          <Link
            href="/"
            className={cn(
              "underline-offset-4 hover:underline",
              night
                ? "text-[#8a9ab0] hover:text-[#b8c4d4]"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            lofy.ai
          </Link>
        </p>
      </div>
    </div>
  );
}
