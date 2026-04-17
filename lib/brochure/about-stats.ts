import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/database";

export type PersonaShare = {
  key: string;
  count: number;
  /** Whole-number share among users who picked a named persona */
  percent: number;
};

export type AboutPlatformStats = {
  remindersCompleted: number;
  calendarEvents: number;
  registeredUsers: number;
  assistantCalls: number;
  personas: PersonaShare[];
  generatedAt: string;
};

const EMPTY_STATS: AboutPlatformStats = {
  remindersCompleted: 0,
  calendarEvents: 0,
  registeredUsers: 0,
  assistantCalls: 0,
  personas: [],
  generatedAt: new Date(0).toISOString(),
};

function toNumber(value: bigint | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "bigint" ? Number(value) : value;
}

/** Rounds for marketing display, e.g. 4472 → "4.5K+" */
export function formatThousandsPlus(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0+";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const rounded = m >= 10 ? Math.round(m) : Math.round(m * 10) / 10;
    const label = Number.isInteger(rounded) ? `${rounded}` : `${rounded}`.replace(/\.0$/, "");
    return `${label}M+`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    const rounded = k >= 10 ? Math.round(k) : Math.round(k * 10) / 10;
    const label = Number.isInteger(rounded) ? `${rounded}` : `${rounded}`.replace(/\.0$/, "");
    return `${label}K+`;
  }
  return `${Math.round(n)}+`;
}

async function loadAboutPlatformStats(): Promise<AboutPlatformStats> {
  const generatedAt = new Date().toISOString();

  try {
    const [[agg], personaRows] = await Promise.all([
      prisma.$queryRaw<
        Array<{
          reminders_completed: bigint;
          calendar_events: bigint;
          users: bigint;
          llm_calls: bigint;
        }>
      >`
        SELECT
          (SELECT COUNT(*)::bigint FROM reminders WHERE status = 'completed' AND deleted_at IS NULL) AS reminders_completed,
          (SELECT COUNT(*)::bigint FROM calendar_events WHERE deleted_at IS NULL) AS calendar_events,
          (SELECT COUNT(*)::bigint FROM users) AS users,
          (SELECT COUNT(*)::bigint FROM llm_token_usage) AS llm_calls
      `,
      prisma.$queryRaw<Array<{ persona: string; cnt: bigint }>>`
        SELECT lower(trim(ai_persona)) AS persona, COUNT(*)::bigint AS cnt
        FROM users
        WHERE ai_persona IS NOT NULL AND trim(ai_persona) <> ''
        GROUP BY 1
        ORDER BY cnt DESC
      `,
    ]);

    const row = agg;
    if (!row) {
      return { ...EMPTY_STATS, generatedAt };
    }

    const personaTotal = personaRows.reduce((sum, r) => sum + toNumber(r.cnt), 0);

    const personas: PersonaShare[] = personaRows.map((r) => {
      const count = toNumber(r.cnt);
      const percent =
        personaTotal > 0 ? Math.round((count / personaTotal) * 100) : 0;
      return { key: r.persona, count, percent };
    });

    return {
      remindersCompleted: toNumber(row.reminders_completed),
      calendarEvents: toNumber(row.calendar_events),
      registeredUsers: toNumber(row.users),
      assistantCalls: toNumber(row.llm_calls),
      personas,
      generatedAt,
    };
  } catch {
    return {
      ...EMPTY_STATS,
      generatedAt,
    };
  }
}

export const getAboutPlatformStats = unstable_cache(loadAboutPlatformStats, ["brochure-about-stats-v1"], {
  revalidate: 3600,
  tags: ["brochure-about-stats"],
});
