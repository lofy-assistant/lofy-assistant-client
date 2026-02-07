import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { connectMongo, prisma } from "@/lib/database";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import { Redis } from "@upstash/redis";

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
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - missing session token" },
        { status: 401 }
      );
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Unauthorized - invalid session" },
        { status: 401 }
      );
    }

    const { userId } = session;
    const url = new URL(request.url);
    const refresh = url.searchParams.get("refresh") === "1";

    await connectMongo();

    // Fetch user timezone
    const mongoUser = await User.findOne({ user_id: userId }, { timezone: 1 }).lean();
    const userTimezone = (mongoUser?.timezone as string) || "UTC";

    // Cache key includes user + timezone
    const cacheKey = `analytics:${userId}:${userTimezone}`;

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

    // Aggregate messages by hour in user's timezone
    const hourPipeline = [
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
    ];

    const hourAgg = await mongoose.connection
      .collection("messages")
      .aggregate(hourPipeline)
      .toArray();

    const messagesByHour = new Array(24).fill(0);
    hourAgg.forEach((r) => {
      const h = Number(r._id);
      if (!Number.isNaN(h) && h >= 0 && h < 24) messagesByHour[h] = r.count;
    });

    // Get all messages for other stats
    const allMessages = await mongoose.connection
      .collection("messages")
      .find({ user_id: userId })
      .project({ role: 1, created_at: 1 })
      .toArray();

    const total = allMessages.length;
    const byUser = allMessages.filter((m) => m.role === "user").length;
    const byAssistant = allMessages.filter((m) => m.role === "assistant").length;

    // Messages this week (in UTC window) - used for quick metric, UI uses days/tz elsewhere
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const messagesThisWeek = allMessages.filter(
      (m) => new Date(m.created_at) >= sevenDaysAgo
    ).length;

    // Days active and longest streak (in user's timezone)
    const uniqueDays = new Set<string>();
    allMessages.forEach((m) => {
      uniqueDays.add(getDateStringInTimezone(new Date(m.created_at), userTimezone));
    });
    const daysActive = uniqueDays.size;

    // Calculate longest streak
    const sortedDays = Array.from(uniqueDays).sort();
    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedDays.length; i++) {
      const prev = new Date(sortedDays[i - 1]);
      const curr = new Date(sortedDays[i]);
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);
    if (sortedDays.length === 0) longestStreak = 0;

    // Average messages per active day
    const averageMessagesPerActiveDay =
      daysActive > 0 ? Math.round(total / daysActive) : 0;

    // Fetch overview counts from Postgres (prisma)
    const sevenDaysAgoPrisma = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const [
      totalMemories,
      totalReminders,
      totalEvents,
      activeReminders,
      upcomingEvents,
      memoriesThisWeek,
      eventsThisWeek,
    ] = await Promise.all([
      prisma.memories.count({ where: { user_id: userId } }),
      prisma.reminders.count({ where: { user_id: userId } }),
      prisma.calendar_events.count({ where: { user_id: userId } }),
      prisma.reminders.count({
        where: { user_id: userId, status: "pending", reminder_time: { gte: new Date() } },
      }),
      prisma.calendar_events.count({ where: { user_id: userId, start_time: { gte: new Date() } } }),
      prisma.memories.count({ where: { user_id: userId, created_at: { gte: sevenDaysAgoPrisma } } }),
      prisma.calendar_events.count({ where: { user_id: userId, created_at: { gte: sevenDaysAgoPrisma } } }),
    ]);

    const payload = {
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
        daysActive,
        messagesThisWeek,
        averageMessagesPerActiveDay,
        longestStreak,
        messagesByHour,
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
