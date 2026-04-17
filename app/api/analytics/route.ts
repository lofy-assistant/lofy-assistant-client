import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, getRequestSessionToken } from "@/lib/session";
import { connectMongo, prisma } from "@/lib/database";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import { Redis } from "@upstash/redis";

type AnalyticsRange = "7d" | "30d" | "90d" | "all";
type TrendBucket = "day" | "month";

type TrendPoint = {
  bucket: string;
  label: string;
  count: number;
};

const VALID_RANGES = new Set<AnalyticsRange>(["7d", "30d", "90d", "all"]);

// Helper to get date string (YYYY-MM-DD) in a specific IANA timezone
function getDateStringInTimezone(date: Date, timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: timezone,
    });
    return formatter.format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

function getMonthStringInTimezone(date: Date, timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      timeZone: timezone,
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value ?? date.getUTCFullYear().toString();
    const month = parts.find((part) => part.type === "month")?.value ?? String(date.getUTCMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  } catch {
    return date.toISOString().slice(0, 7);
  }
}

function parseRange(value: string | null): AnalyticsRange {
  if (value && VALID_RANGES.has(value as AnalyticsRange)) {
    return value as AnalyticsRange;
  }

  return "30d";
}

function getRangeStart(range: AnalyticsRange, now: Date): Date | null {
  if (range === "all") {
    return null;
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
}

function getBucketType(range: AnalyticsRange): TrendBucket {
  return range === "all" ? "month" : "day";
}

function getBucketKey(date: Date, timezone: string, bucket: TrendBucket): string {
  return bucket === "month"
    ? getMonthStringInTimezone(date, timezone)
    : getDateStringInTimezone(date, timezone);
}

function formatBucketLabel(bucket: string, bucketType: TrendBucket): string {
  if (bucketType === "month") {
    const [year, month] = bucket.split("-").map(Number);
    const date = new Date(Date.UTC(year, (month || 1) - 1, 1));
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  const [year, month, day] = bucket.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function buildRangeKeys(range: AnalyticsRange, timezone: string, now: Date, earliestBucket?: string): string[] {
  const bucketType = getBucketType(range);

  if (bucketType === "month") {
    const end = getMonthStringInTimezone(now, timezone);
    const start = earliestBucket ?? end;
    const [startYear, startMonth] = start.split("-").map(Number);
    const [endYear, endMonth] = end.split("-").map(Number);
    const keys: string[] = [];

    let year = startYear;
    let month = startMonth;

    while (year < endYear || (year === endYear && month <= endMonth)) {
      keys.push(`${year}-${String(month).padStart(2, "0")}`);
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }

    return keys;
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return Array.from({ length: days }, (_, index) => {
    const offset = days - index - 1;
    const date = new Date(now.getTime() - offset * 24 * 60 * 60 * 1000);
    return getDateStringInTimezone(date, timezone);
  });
}

function toTrendPoints(range: AnalyticsRange, timezone: string, now: Date, counts: Map<string, number>, earliestBucket?: string): TrendPoint[] {
  const bucketType = getBucketType(range);
  const keys = buildRangeKeys(range, timezone, now, earliestBucket);

  return keys.map((bucket) => ({
    bucket,
    label: formatBucketLabel(bucket, bucketType),
    count: counts.get(bucket) ?? 0,
  }));
}

function buildTrendFromDates(dates: Date[], range: AnalyticsRange, timezone: string, now: Date): TrendPoint[] {
  const bucketType = getBucketType(range);
  const counts = new Map<string, number>();
  let earliestBucket: string | undefined;

  for (const date of dates) {
    const bucket = getBucketKey(date, timezone, bucketType);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);

    if (!earliestBucket || bucket < earliestBucket) {
      earliestBucket = bucket;
    }
  }

  return toTrendPoints(range, timezone, now, counts, earliestBucket);
}

function getWeekdayLabel(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: timezone,
  }).format(date);
}

function buildWeekdayLoad(dates: Date[], timezone: string) {
  const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = new Map<string, number>(weekdayOrder.map((day) => [day, 0]));

  for (const date of dates) {
    const weekday = getWeekdayLabel(date, timezone);
    counts.set(weekday, (counts.get(weekday) ?? 0) + 1);
  }

  return weekdayOrder.map((day) => ({ label: day, count: counts.get(day) ?? 0 }));
}

function calculateMessageStreaks(dates: Date[], timezone: string, totalMessages: number) {
  const uniqueDays = new Set<string>();
  for (const date of dates) {
    uniqueDays.add(getDateStringInTimezone(date, timezone));
  }

  const sortedDays = Array.from(uniqueDays).sort();
  const daysActive = sortedDays.length;

  let longestStreak = 0;
  let tempStreak = 1;

  for (let index = 1; index < sortedDays.length; index += 1) {
    const previousDay = new Date(`${sortedDays[index - 1]}T00:00:00Z`);
    const currentDay = new Date(`${sortedDays[index]}T00:00:00Z`);
    const diffDays = Math.round((currentDay.getTime() - previousDay.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak += 1;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }

  longestStreak = sortedDays.length === 0 ? 0 : Math.max(longestStreak, tempStreak);

  let currentStreak = 0;
  if (sortedDays.length > 0) {
    const now = new Date();
    const today = getDateStringInTimezone(now, timezone);
    const yesterday = getDateStringInTimezone(new Date(now.getTime() - 24 * 60 * 60 * 1000), timezone);
    const mostRecentDay = sortedDays[sortedDays.length - 1];

    if (mostRecentDay === today || mostRecentDay === yesterday) {
      currentStreak = 1;
      for (let index = sortedDays.length - 2; index >= 0; index -= 1) {
        const currentDay = new Date(`${sortedDays[index + 1]}T00:00:00Z`);
        const previousDay = new Date(`${sortedDays[index]}T00:00:00Z`);
        const diffDays = Math.round((currentDay.getTime() - previousDay.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }
  }

  return {
    daysActive,
    longestStreak,
    currentStreak,
    averageMessagesPerActiveDay: daysActive > 0 ? Math.round(totalMessages / daysActive) : 0,
  };
}

const CACHE_TTL = Number(process.env.CACHE_TTL) || 300; // 5 minutes default

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!getRequestSessionToken(request)) {
      return NextResponse.json(
        { error: "Unauthorized - missing session token" },
        { status: 401 }
      );
    }

    const session = await getRequestSession(request);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Unauthorized - invalid session" },
        { status: 401 }
      );
    }

    const { userId } = session;
    const url = new URL(request.url);
    const refresh = url.searchParams.get("refresh") === "1";
    const range = parseRange(url.searchParams.get("range"));
    const now = new Date();
    const rangeStart = getRangeStart(range, now);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const upcomingWindowEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekdayWindowEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    await connectMongo();

    // Fetch user timezone
    const mongoUser = await User.findOne({ user_id: userId }, { timezone: 1 }).lean();
    const userTimezone = (mongoUser?.timezone as string) || "UTC";

    // Cache key includes analytics version, user, timezone, and range.
    const cacheKey = `analytics:v2:${userId}:${userTimezone}:${range}`;

    const redis = getRedisClient();

    // Check cache first (unless refresh requested)
    if (!refresh && redis) {
      try {
        const cached = await redis.get<string>(cacheKey);
        if (cached) {
          const payload = typeof cached === 'string' ? JSON.parse(cached) : cached;
          return NextResponse.json({ ...payload, cached: true });
        }
      } catch (cacheErr) {
        console.warn("Redis cache read failed:", cacheErr);
      }
    }

    const messagesCollection = mongoose.connection.collection("messages");
    const messageTrendFormat = getBucketType(range) === "month" ? "%Y-%m" : "%Y-%m-%d";
    const messageTrendMatch = rangeStart
      ? { user_id: userId, created_at: { $gte: rangeStart } }
      : { user_id: userId };

    const [
      total,
      byUser,
      byAssistant,
      messagesThisWeek,
      userMessageDocs,
      hourAgg,
      messageTrendAgg,
      totalMemories,
      totalReminders,
      totalEvents,
      activeReminders,
      upcomingEvents,
      memoriesThisWeek,
      eventsThisWeek,
      pendingReminders,
      completedReminders,
      missedReminders,
      dueSoonReminders,
      recurringEvents,
      sharedByYou,
      memoriesReceived,
      memoryDates,
      reminderDates,
      eventDates,
      weekdayEventDates,
    ] = await Promise.all([
      messagesCollection.countDocuments({ user_id: userId }),
      messagesCollection.countDocuments({ user_id: userId, role: "user" }),
      messagesCollection.countDocuments({ user_id: userId, role: "assistant" }),
      messagesCollection.countDocuments({ user_id: userId, created_at: { $gte: sevenDaysAgo } }),
      messagesCollection
        .find({ user_id: userId, role: "user" })
        .project({ created_at: 1 })
        .toArray(),
      messagesCollection
        .aggregate([
          { $match: { user_id: userId } },
          {
            $addFields: {
              parts: { $dateToParts: { date: "$created_at", timezone: userTimezone } },
            },
          },
          {
            $group: {
              _id: "$parts.hour",
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 as const } },
        ])
        .toArray(),
      messagesCollection
        .aggregate([
          { $match: messageTrendMatch },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: messageTrendFormat,
                  date: "$created_at",
                  timezone: userTimezone,
                },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 as const } },
        ])
        .toArray(),
      prisma.memories.count({ where: { user_id: userId, deleted_at: null } }),
      prisma.reminders.count({ where: { user_id: userId, deleted_at: null } }),
      prisma.calendar_events.count({ where: { user_id: userId, deleted_at: null } }),
      prisma.reminders.count({
        where: { user_id: userId, deleted_at: null, status: "pending", reminder_time: { gte: now } },
      }),
      prisma.calendar_events.count({ where: { user_id: userId, deleted_at: null, start_time: { gte: now } } }),
      prisma.memories.count({ where: { user_id: userId, deleted_at: null, created_at: { gte: sevenDaysAgo } } }),
      prisma.calendar_events.count({ where: { user_id: userId, deleted_at: null, created_at: { gte: sevenDaysAgo } } }),
      prisma.reminders.count({ where: { user_id: userId, deleted_at: null, status: "pending" } }),
      prisma.reminders.count({ where: { user_id: userId, deleted_at: null, status: "completed" } }),
      prisma.reminders.count({ where: { user_id: userId, deleted_at: null, status: "missed" } }),
      prisma.reminders.count({
        where: {
          user_id: userId,
          deleted_at: null,
          status: "pending",
          reminder_time: { gte: now, lte: upcomingWindowEnd },
        },
      }),
      prisma.calendar_events.count({ where: { user_id: userId, deleted_at: null, recurrence: { not: null } } }),
      prisma.memories_share.count({ where: { memory: { user_id: userId } } }),
      prisma.memories_share.count({ where: { user_id: userId } }),
      prisma.memories.findMany({
        where: {
          user_id: userId,
          deleted_at: null,
          ...(rangeStart ? { created_at: { gte: rangeStart } } : {}),
        },
        select: { created_at: true },
        orderBy: { created_at: "asc" },
      }),
      prisma.reminders.findMany({
        where: {
          user_id: userId,
          deleted_at: null,
          ...(rangeStart ? { created_at: { gte: rangeStart } } : {}),
        },
        select: { created_at: true },
        orderBy: { created_at: "asc" },
      }),
      prisma.calendar_events.findMany({
        where: {
          user_id: userId,
          deleted_at: null,
          ...(rangeStart ? { created_at: { gte: rangeStart } } : {}),
        },
        select: { created_at: true },
        orderBy: { created_at: "asc" },
      }),
      prisma.calendar_events.findMany({
        where: {
          user_id: userId,
          deleted_at: null,
          start_time: { gte: now, lte: weekdayWindowEnd },
        },
        select: { start_time: true },
      }),
    ]);

    const messagesByHour = new Array<number>(24).fill(0);
    for (const row of hourAgg) {
      const hour = Number(row._id);
      if (!Number.isNaN(hour) && hour >= 0 && hour < 24) {
        messagesByHour[hour] = row.count as number;
      }
    }

    const peakHour = messagesByHour.indexOf(Math.max(...messagesByHour));
    const peakHourLabel = peakHour >= 0
      ? new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: true,
          timeZone: userTimezone,
        }).format(new Date(Date.UTC(2024, 0, 1, peakHour)))
      : "--";

    const messageTrendCounts = new Map<string, number>();
    let earliestMessageBucket: string | undefined;
    for (const row of messageTrendAgg) {
      const bucket = String(row._id);
      const count = Number(row.count);
      messageTrendCounts.set(bucket, count);
      if (!earliestMessageBucket || bucket < earliestMessageBucket) {
        earliestMessageBucket = bucket;
      }
    }

    const messageTrend = toTrendPoints(range, userTimezone, now, messageTrendCounts, earliestMessageBucket);
    const userMessageDates = userMessageDocs.map((doc) => new Date(doc.created_at as Date));
    const streakMetrics = calculateMessageStreaks(userMessageDates, userTimezone, total);

    const memoriesTrend = buildTrendFromDates(memoryDates.map((row) => row.created_at), range, userTimezone, now);
    const remindersTrend = buildTrendFromDates(reminderDates.map((row) => row.created_at), range, userTimezone, now);
    const calendarTrend = buildTrendFromDates(eventDates.map((row) => row.created_at), range, userTimezone, now);
    const weekdayLoad = buildWeekdayLoad(weekdayEventDates.map((row) => row.start_time), userTimezone);

    const payload = {
      range,
      generatedAt: now.toISOString(),
      overview: {
        totalMemories,
        totalReminders,
        totalEvents,
        totalFeedbacks: 0,
        activeReminders,
        upcomingEvents,
      },
      activity: {
        thisWeek: {
          memories: memoriesThisWeek,
          events: eventsThisWeek,
          feedbacks: 0,
        },
      },
      recentMemories: [],
      feedbacksByTag: [],
      messages: {
        total,
        byUser,
        byAssistant,
        daysActive: streakMetrics.daysActive,
        messagesThisWeek,
        messagesInRange: messageTrend.reduce((sum, point) => sum + point.count, 0),
        averageMessagesPerActiveDay: streakMetrics.averageMessagesPerActiveDay,
        longestStreak: streakMetrics.longestStreak,
        currentStreak: streakMetrics.currentStreak,
        peakHour,
        peakHourLabel,
        messagesByHour,
        trend: messageTrend,
      },
      memories: {
        total: totalMemories,
        createdInRange: memoriesTrend.reduce((sum, point) => sum + point.count, 0),
        createdThisWeek: memoriesThisWeek,
        sharedByYou,
        received: memoriesReceived,
        trend: memoriesTrend,
      },
      reminders: {
        total: totalReminders,
        pending: pendingReminders,
        completed: completedReminders,
        missed: missedReminders,
        dueSoon: dueSoonReminders,
        createdInRange: remindersTrend.reduce((sum, point) => sum + point.count, 0),
        trend: remindersTrend,
      },
      calendar: {
        total: totalEvents,
        upcoming: upcomingEvents,
        recurring: recurringEvents,
        createdInRange: calendarTrend.reduce((sum, point) => sum + point.count, 0),
        trend: calendarTrend,
        weekdayLoad,
      },
    };

    // Store in cache
    if (redis) {
      try {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(payload));
      } catch (cacheErr) {
        console.warn("Redis cache write failed:", cacheErr);
      }
    }

    return NextResponse.json({ ...payload, cached: false });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
