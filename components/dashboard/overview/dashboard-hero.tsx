"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Brain,
  Plug,
  MessageCircle,
  History,
  Users,
} from "lucide-react";
import { useWeather } from "@/hooks/use-weather";

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
    weekday: "short",
    month: "short",
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
  { label: "History",  icon: History,       href: "/dashboard",            color: "text-blue-500",   bg: "bg-blue-50" },
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
    <div className="flex items-start md:items-stretch justify-center w-full min-h-[calc(100dvh-var(--header-height))] bg-[#faf6f2] md:bg-[linear-gradient(160deg,#f5c49a_0%,#f2aa7e_30%,#e8957c_60%,#dba07e_100%)]">

      {/* ── Card
           mobile : full-width, no radius, no shadow, no margin (seamless)
           desktop: max-w-sm, large radius, shadow, vertical margin      ── */}
      <div className="relative w-full md:max-w-sm mx-auto md:my-10 bg-[#faf6f2] md:rounded-4xl md:shadow-2xl overflow-hidden flex flex-col min-h-[calc(100dvh-var(--header-height))] md:min-h-[calc(100dvh-var(--header-height)-5rem)]">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm">
            <Image
              src="/assets/icons/lofy-logo-1.png"
              alt="Lofy"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
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

        {/* ── Hero image with vignette ── */}
        <div className="relative mx-4 mt-1 flex-1 md:flex-none md:h-52 rounded-2xl overflow-hidden">
          {/* Beach background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80"
            alt="Beach"
            className="w-full h-full object-cover"
          />
          {/* Radial vignette — fades edges into card background color */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #faf6f2 90%)",
            }}
          />
        </div>

        {/* ── Greeting & weather ── */}
        <div className="mt-auto px-6 pt-5 pb-3 text-center">
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

        {/* ── Quick actions ── */}
        <div className="px-4 pb-6 pt-1 flex flex-col gap-2">
          {/* Row 1 — 2 buttons */}
          <div className="grid grid-cols-2 gap-2">
            {topActions.map(({ label, icon: Icon, href, color, bg }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/80 border border-[#ede5da] py-3.5 px-2 text-center hover:bg-white hover:shadow-md active:scale-95 transition-all"
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
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/80 border border-[#ede5da] py-3.5 px-2 text-center hover:bg-white hover:shadow-md active:scale-95 transition-all"
              >
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <span className="text-[11px] font-medium text-[#7a6a5a] leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
