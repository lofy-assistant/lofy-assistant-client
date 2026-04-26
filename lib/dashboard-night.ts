/**
 * Night UI for `/dashboard` routes: 7:00–4:59 local (same window as night hero art).
 * When `date` is null (before mount), treat as day to avoid hydration mismatch.
 */
export function isNightTime(date: Date | null): boolean {
  if (!date) return false;
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const at5am = 5 * 60;
  const at7pm = 19 * 60;
  return totalMinutes >= at7pm || totalMinutes < at5am;
}

/** Shared Tailwind fragments for dashboard night styling. */
export const dnc = {
  /** Full-page backdrop (hero + page shell outer). */
  pageBg: (n: boolean) =>
    n
      ? "bg-[#0a1524] md:bg-[linear-gradient(160deg,#0c1a2e_0%,#0a1526_45%,#07121e_100%)]"
      : undefined,
  /** Page shell daytime outer (peach) — use when !n */
  pageShellDayBg:
    "bg-[#faf6f2] md:bg-[linear-gradient(160deg,#f5c49a_0%,#f2aa7e_30%,#e8957c_60%,#dba07e_100%)]",
  /** Main “card” surface used by shell + hero. */
  card: (n: boolean) => (n ? "bg-[#111216]" : "bg-[#faf6f2]"),
  textPrimary: (n: boolean) => (n ? "text-[#e8ddd4]" : "text-[#3d2e22]"),
  textMuted: (n: boolean) => (n ? "text-[#9a8f85]" : "text-[#9a8070]"),
  textSoft: (n: boolean) => (n ? "text-[#a89e94]" : "text-[#7a6a5a]"),
  border: (n: boolean) => (n ? "border-white/10" : "border-[#ede5da]"),
  borderHairline: (n: boolean) => (n ? "border-white/10" : "border-[#ede5da]"),
  /** Muted hairline (shell divider, list separators). */
  borderSubtle: (n: boolean) => (n ? "bg-white/10" : "bg-[#ede5da]"),
  /** Scroll-area fade (bottom of page shell). */
  fadeFrom: (n: boolean) => (n ? "rgba(17, 18, 22, 1)" : "#faf6f2"),
  /** Quick-action / nested panel surface. */
  surface: (n: boolean) =>
    n
      ? "border-white/10 bg-white/6 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.45),0_2px_8px_-2px_rgba(0,0,0,0.3)]"
      : "border-[#ede5da] bg-white/80",
  /** Nested card on top of #111216. */
  insetCard: (n: boolean) =>
    n ? "border-white/10 bg-white/5" : "border-[#eadfd2] bg-white/90",
  /**
   * Forms on the dark settings card: `Label` / `Input` / `Textarea` use light-theme
   * foreground by default, so we override when `n` to restore contrast on `#111216`.
   */
  settingsLabel: (n: boolean) => (n ? "text-[#d4ccc4]" : ""),
  settingsInput: (n: boolean) =>
    n
      ? "border-white/15 bg-[#16181e] text-[#e8ddd4] shadow-none placeholder:text-[#6b7078] file:text-[#c4b8ae]"
      : "",
  /** Disabled / read-only fields (replaces `bg-muted` on night). */
  settingsInputDisabled: (n: boolean) =>
    n
      ? "border-white/10 bg-white/8 text-[#e8ddd4] opacity-100"
      : "bg-muted",
  settingsHelp: (n: boolean) => (n ? "text-[#9a8f85]" : "text-muted-foreground"),
  settingsSelect: (n: boolean) =>
    n
      ? "border-white/15 bg-[#16181e] text-[#e8ddd4] shadow-none [&>span]:text-[#e8ddd4]"
      : "",
  settingsTextarea: (n: boolean) =>
    n
      ? "border-white/15 bg-[#16181e] text-[#e8ddd4] shadow-none placeholder:text-[#6b7078]"
      : "",
  settingsSectionTitle: (n: boolean) => (n ? "text-[#e8ddd4]" : ""),
} as const;
