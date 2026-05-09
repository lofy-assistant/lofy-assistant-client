"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import heroDawnArt from "../../../public/assets/images/cropped-art-dawn.webp";
import heroMorningArt from "../../../public/assets/images/cropped-art-morning.webp";
import heroNightArt from "../../../public/assets/images/cropped-art-night.webp";
import heroSunsetArt from "../../../public/assets/images/cropped-art-sunset.webp";
import {
  Brain,
  Plug,
  MessageCircle,
  History,
  Users,
} from "lucide-react";
import { useWeather } from "@/hooks/use-weather";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { cn } from "@/lib/utils";
import { dnc } from "@/lib/dashboard-night";
import { useDashboardNight } from "@/components/dashboard/shared/dashboard-night-provider";

interface UserProfile {
  name: string | null;
  email: string | null;
}

const profileFetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((d) => d.user as UserProfile);

/** Greeting buckets use the runtime's local timezone (the user's device). */
function getGreeting(date: Date): string {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const at5am = 5 * 60;
  const at12pm = 12 * 60;
  const at5pm = 17 * 60;
  const at9pm = 21 * 60;
  if (totalMinutes >= at9pm || totalMinutes < at5am) return "Good night";
  if (totalMinutes < at12pm) return "Good morning";
  if (totalMinutes < at5pm) return "Good afternoon";
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

/** Hero art rotates by local time to match the mood of the day. */
function getHeroArt(date: Date | null) {
  if (!date) return heroMorningArt;

  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const at5am = 5 * 60;
  const at9am = 9 * 60;
  const at3pm = 15 * 60;
  const at7pm = 19 * 60;

  if (totalMinutes >= at7pm || totalMinutes < at5am) return heroNightArt;
  if (totalMinutes < at9am) return heroDawnArt;
  if (totalMinutes < at3pm) return heroMorningArt;
  return heroSunsetArt;
}

const topActions = [
  { label: "History", icon: History, href: "/dashboard/history" },
  { label: "Memories", icon: Brain, href: "/dashboard/memories" },
];

const bottomActions = [
  { label: "Friends", icon: Users, href: "/dashboard/friends" },
  { label: "Integrations", icon: Plug, href: "/dashboard/integrations" },
  {
    label: "Chat Lofy",
    icon: MessageCircle,
    href: "https://wa.me/60105043846",
    external: true,
  },
];

export function DashboardHero() {
  const { now, isNight: night } = useDashboardNight();
  const weather = useWeather();
  const { data: profile } = useSWR("/api/user/profile", profileFetcher, {
    revalidateOnFocus: false,
  });

  const displayName = profile?.name?.trim() || null;
  const initials = getInitials(profile?.name);
  const heroArt = getHeroArt(now);

  return (
    /* ── Outer wrapper
         mobile : plain #faf6f2 (same as card); no visible background
         desktop: warm peach gradient behind the centred card
         night  : dark blue page (card sits on top)                     ── */
    <div
      className={cn(
        "relative flex items-start md:items-stretch justify-center w-full min-h-[calc(100dvh-var(--header-height))]",
        dnc.pageBg(night),
        !night &&
          "bg-[#faf6f2] md:bg-[linear-gradient(160deg,#bde0f0_0%,#a4d4ed_30%,#8ec5e8_60%,#a8d8f0_100%)]"
      )}
    >
      {/* ── Card
           mobile : full-width, no radius, no shadow, no margin (seamless)
           desktop: max-w-sm, large radius, shadow, vertical margin      ── */}
      <div
        className={cn(
          "relative isolate w-full md:max-w-sm mx-auto md:my-10 overflow-hidden flex flex-col min-h-[calc(100dvh-var(--header-height))] md:min-h-[calc(100dvh-var(--header-height)-5rem)] text-sm md:rounded-4xl md:shadow-2xl",
          dnc.card(night),
          night && "md:shadow-black/50"
        )}
      >

        {/* ── Top bar (above grain) ── */}
        <div className="relative z-20 flex items-center justify-between px-5 pt-5 pb-2">
          <Link
            href="/dashboard/about"
            className={cn(
              "w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center active:scale-95 transition-all",
              night
                ? "bg-white/10 ring-1 ring-white/10 shadow-none hover:opacity-90"
                : "bg-white shadow-sm hover:opacity-90"
            )}
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
          <span
            className={cn(
              "text-xs font-medium",
              night ? "text-[#9a8f85]" : "text-[#7a6a5a]"
            )}
          >
            {getFormattedDate()}
          </span>
          <Link
            href="/dashboard/settings"
            className="w-9 h-9 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-sm select-none hover:opacity-80 active:scale-95 transition-all"
          >
            {initials}
          </Link>
        </div>

        {/* ── Hero art (below grain) ── */}
        <div
          className={cn(
            "relative z-0 mt-12 md:mt-4 w-full flex-1 min-h-[min(52vh,26rem)] md:min-h-88 overflow-hidden rounded-2xl",
            night ? "bg-[#111216]" : "bg-[#faf6f2]"
          )}
        >
          <Image
            src={heroArt}
            alt=""
            fill
            className="object-contain object-[center_65%] md:object-cover md:object-top scale-110 md:scale-80 md:origin-center"
            sizes="(max-width: 768px) 100vw, 28rem"
            priority
          />
        </div>

        {/* ── Greeting & weather (above grain) ── */}
        <div className="relative z-20 mt-auto px-6 pt-4 pb-3 text-center">
          <h1
            className={cn(
              "text-sm font-semibold",
              night ? "text-[#e8ddd4]" : "text-[#3d2e22]"
            )}
          >
            {now ? getGreeting(now) : "Hello"}
            {displayName ? `, ${displayName}` : ""}
          </h1>
          <p
            className={cn(
              "mt-1 text-xs",
              night ? "text-[#9a8f85]" : "text-[#9a8070]"
            )}
          >
            {weather.isLoading
              ? "Fetching weather…"
              : weather.error
              ? "Weather unavailable"
              : `${weather.temperature}°C and ${weather.description.toLowerCase()}`}
          </p>
        </div>

        {/* ── Quick actions (above grain) ── */}
        <div className="relative z-20 px-4 pb-6 pt-1 flex flex-col gap-2">
          {/* Row 1: 2 buttons */}
          <div className="grid grid-cols-2 gap-2">
            {topActions.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border py-3.5 px-2 text-center transition-all active:scale-95",
                  night
                    ? "border-white/10 bg-white/6 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.45),0_2px_8px_-2px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:shadow-[0_10px_28px_-4px_rgba(0,0,0,0.5),0_4px_14px_-2px_rgba(0,0,0,0.35)]"
                    : "border-[#ede5da] bg-white/80 shadow-[0_6px_20px_-4px_rgba(61,46,34,0.16),0_2px_8px_-2px_rgba(61,46,34,0.1)] hover:bg-white hover:shadow-[0_10px_28px_-4px_rgba(61,46,34,0.24),0_4px_14px_-2px_rgba(61,46,34,0.14)]"
                )}
              >
                <Icon
                  className={cn(
                    "h-8 w-8 shrink-0",
                    night ? "text-[#e8ddd4]" : "text-[#3d2e22]"
                  )}
                  strokeWidth={2}
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-[11px] font-medium leading-tight",
                    night ? "text-[#a89e94]" : "text-[#7a6a5a]"
                  )}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
          {/* Row 2: 3 buttons */}
          <div className="grid grid-cols-3 gap-2">
            {bottomActions.map(({ label, icon: Icon, href, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border py-3.5 px-2 text-center transition-all active:scale-95",
                  night
                    ? "border-white/10 bg-white/6 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.45),0_2px_8px_-2px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:shadow-[0_10px_28px_-4px_rgba(0,0,0,0.5),0_4px_14px_-2px_rgba(0,0,0,0.35)]"
                    : "border-[#ede5da] bg-white/80 shadow-[0_6px_20px_-4px_rgba(61,46,34,0.16),0_2px_8px_-2px_rgba(61,46,34,0.1)] hover:bg-white hover:shadow-[0_10px_28px_-4px_rgba(61,46,34,0.24),0_4px_14px_-2px_rgba(61,46,34,0.14)]"
                )}
              >
                <Icon
                  className={cn(
                    "h-8 w-8 shrink-0",
                    night ? "text-[#e8ddd4]" : "text-[#3d2e22]"
                  )}
                  strokeWidth={2}
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-[11px] font-medium leading-tight",
                    night ? "text-[#a89e94]" : "text-[#7a6a5a]"
                  )}
                >
                  {label}
                </span>
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
