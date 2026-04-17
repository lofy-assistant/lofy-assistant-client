"use client";

import Image from "next/image";
import Link from "next/link";
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

function LinkRow({ href, label, external, icon: Icon }: AboutRow) {
  const className =
    "flex items-center gap-3 px-4 py-3.5 md:py-2.5 text-sm text-[#1a1a1a] hover:bg-neutral-50 active:bg-neutral-100/80 transition-colors";

  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-400">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1 font-medium">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" aria-hidden />
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

function LinkGroup({ rows }: { rows: AboutRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="divide-y divide-neutral-100">
        {rows.map((row) => (
          <LinkRow key={row.label} {...row} />
        ))}
      </div>
    </div>
  );
}

export function LofyAboutScreen() {
  return (
    <div className="fixed inset-0 z-0 flex flex-col bg-white">
      <header className="flex shrink-0 justify-end px-4 pt-4 pb-2">
        <Link
          href="/dashboard"
          className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </Link>
      </header>

      <div className="scrollbar-hidden mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-5 pb-10">
        <div className="flex flex-col items-center pt-2 pb-8">
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
          <h1 className="mt-4 text-lg font-semibold tracking-tight text-neutral-900">
            Lofy AI
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <LinkGroup rows={PRIMARY_LINKS} />
          <LinkGroup rows={SECONDARY_LINKS} />
        </div>

        <p className="mt-10 text-center text-xs leading-relaxed text-neutral-400">
          Made with love, Malaysia 🇲🇾
          <br />
          <Link
            href="/"
            className="text-neutral-500 underline-offset-4 hover:text-neutral-700 hover:underline"
          >
            lofy.ai
          </Link>
        </p>
      </div>
    </div>
  );
}
