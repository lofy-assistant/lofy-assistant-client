"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import heroMorningArt from "../../../public/assets/images/cropped-art-morning.webp";
import {
  Brain,
  Plug,
  MessageCircle,
  History,
  Users,
} from "lucide-react";
import { useWeather } from "@/hooks/use-weather";
import { GrainOverlay } from "@/components/ui/grain-overlay";

interface UserProfile {
  name: string | null;
  email: string | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const topActions = [
  { label: "History",  icon: History,       href: "/dashboard/history",    color: "text-blue-500",   bg: "bg-blue-50" },
  { label: "Memories", icon: Brain,         href: "/dashboard/memories",   color: "text-purple-500", bg: "bg-purple-50" },
];

const bottomActions = [
  { label: "Friends",      icon: Users,         href: "/dashboard/friends",    color: "text-primary",    bg: "bg-primary/10" },
  { label: "Integrations", icon: Plug,          href: "/dashboard/integrations", color: "text-green-500", bg: "bg-green-50" },
  { label: "Chat Lofy",    icon: MessageCircle, href: "https://wa.me/60105043846", color: "text-teal-500", bg: "bg-teal-50", external: true },
];

export function DashboardHero() {
  const weather = useWeather();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d.user))
      .catch(() => null);
  }, []);

  const firstName = profile?.name?.split(" ")[0] ?? null;
  const initials = getInitials(profile?.name);

  return (
    /* ── Outer wrapper
         mobile : plain #faf6f2 (same as card) — no visible background
         desktop: warm peach gradient behind the centred card            ── */
    <div className="relative flex items-start md:items-stretch justify-center w-full min-h-[calc(100dvh-var(--header-height))] bg-[#faf6f2] md:bg-[linear-gradient(160deg,#f5c49a_0%,#f2aa7e_30%,#e8957c_60%,#dba07e_100%)]">
      {/* ── Card
           mobile : full-width, no radius, no shadow, no margin (seamless)
           desktop: max-w-sm, large radius, shadow, vertical margin      ── */}
      <div className="relative isolate w-full md:max-w-sm mx-auto md:my-10 bg-[#faf6f2] md:rounded-4xl md:shadow-2xl overflow-hidden flex flex-col min-h-[calc(100dvh-var(--header-height))] md:min-h-[calc(100dvh-var(--header-height)-5rem)]">

        {/* ── Top bar (above grain) ── */}
        <div className="relative z-20 flex items-center justify-between px-5 pt-5 pb-2">
          <Link
            href="/dashboard/about"
            className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
            aria-label="About Lofy"
          >
            <Image
              src="/assets/icons/lofy-logo-1.png"
              alt="Lofy"
              width={28}
              height={28}
              className="object-contain"
            />
          </Link>
          <span className="text-sm font-medium text-[#7a6a5a]">
            {getFormattedDate()}
          </span>
          <Link
            href="/dashboard/settings"
            className="w-9 h-9 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-sm select-none hover:opacity-80 active:scale-95 transition-all"
          >
            {initials}
          </Link>
        </div>

        {/* ── Hero art (below grain) ── */}
        <div className="relative z-0 mt-12 md:mt-4 w-full flex-1 min-h-[min(52vh,26rem)] md:min-h-88 overflow-hidden rounded-2xl bg-[#faf6f2]">
          <Image
            src={heroMorningArt}
            alt=""
            fill
            className="object-contain object-[center_65%] md:object-cover md:object-top scale-110 md:scale-80 md:origin-center"
            sizes="(max-width: 768px) 100vw, 28rem"
            priority
          />
        </div>

        {/* ── Greeting & weather (above grain) ── */}
        <div className="relative z-20 mt-auto px-6 pt-4 pb-3 text-center">
          <h1 className="text-xl font-semibold text-[#3d2e22]">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-[#9a8070]">
            {weather.isLoading
              ? "Fetching weather…"
              : weather.error
              ? "Weather unavailable"
              : `${weather.temperature}°C and ${weather.description.toLowerCase()}`}
          </p>
        </div>

        {/* ── Quick actions (above grain) ── */}
        <div className="relative z-20 px-4 pb-6 pt-1 flex flex-col gap-2">
          {/* Row 1 — 2 buttons */}
          <div className="grid grid-cols-2 gap-2">
            {topActions.map(({ label, icon: Icon, href, color, bg }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#ede5da] bg-white/80 py-3.5 px-2 text-center shadow-[0_6px_20px_-4px_rgba(61,46,34,0.16),0_2px_8px_-2px_rgba(61,46,34,0.1)] transition-all hover:bg-white hover:shadow-[0_10px_28px_-4px_rgba(61,46,34,0.24),0_4px_14px_-2px_rgba(61,46,34,0.14)] active:scale-95"
              >
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <span className="text-[11px] font-medium text-[#7a6a5a] leading-tight">{label}</span>
              </Link>
            ))}
          </div>
          {/* Row 2 — 3 buttons */}
          <div className="grid grid-cols-3 gap-2">
            {bottomActions.map(({ label, icon: Icon, href, color, bg, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#ede5da] bg-white/80 py-3.5 px-2 text-center shadow-[0_6px_20px_-4px_rgba(61,46,34,0.16),0_2px_8px_-2px_rgba(61,46,34,0.1)] transition-all hover:bg-white hover:shadow-[0_10px_28px_-4px_rgba(61,46,34,0.24),0_4px_14px_-2px_rgba(61,46,34,0.14)] active:scale-95"
              >
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <span className="text-[11px] font-medium text-[#7a6a5a] leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Canvas grain (same technique as grainy-gradient-blob); full card, under UI */}
        <GrainOverlay className="z-10" />
      </div>
    </div>
  );
}
