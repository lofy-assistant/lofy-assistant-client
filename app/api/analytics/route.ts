import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { verifySession } from "@/lib/session";
import { connectMongo } from "@/lib/database";
import { Message, User } from "@/lib/models";

// Helper to get hour in a specific IANA timezone
function getHourInTimezone(date: Date, timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: timezone,
    });
    const hour = parseInt(formatter.format(date), 10);
    // Intl returns 24 for midnight in some cases, normalize to 0
    return hour === 24 ? 0 : hour;
  } catch {
    // Fallback to UTC if timezone is invalid
    return date.getUTCHours();
  }
}

// Helper to get date string (YYYY-MM-DD) in a specific IANA timezone
function getDateStringInTimezone(date: Date, timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: timezone,
    });
    return formatter.format(date); // returns YYYY-MM-DD
  } catch {
    // Fallback to UTC if timezone is invalid
    return date.toISOString().split('T')[0];
  }
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

    // Connect to MongoDB (minimal logging)
    await connectMongo();

    // Get all analytics data in parallel
    const [
      totalMemories,
      totalReminders,
      totalEvents,
      activeReminders,
      upcomingEvents,
      thisWeekMemories,
      thisWeekEvents,
      // MongoDB message analytics
      totalUserMessages,
      totalAssistantMessages,
    ] = await Promise.all([
      // Total counts from PostgreSQL
      prisma.memories.count({ where: { user_id: userId } }),
      prisma.reminders.count({ where: { user_id: userId } }),
      prisma.calendar_events.count({ where: { user_id: userId } }),

      // Active/upcoming
      prisma.reminders.count({
        where: {
          user_id: userId,
          status: "pending",
          reminder_time: { gte: new Date() },
        },
      }),
      prisma.calendar_events.count({
        where: {
          user_id: userId,
          start_time: { gte: new Date() },
        },
      }),

      // This week's activity
      prisma.memories.count({
        where: {
          user_id: userId,
          created_at: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
      prisma.calendar_events.count({
        where: {
          user_id: userId,
          created_at: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),

      // MongoDB message analytics (using model; keep errors surfaced)
      Message.countDocuments({ user_id: userId, role: "user" }),
      Message.countDocuments({ user_id: userId, role: "assistant" }),
    ]);

    // Additional MongoDB analytics
    const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    
    // Messages this week
    const messagesThisWeek = await Message.countDocuments({
      user_id: userId,
      created_at: { $gte: oneWeekAgo },
    });

    // Get all messages with timestamps for advanced analytics
    const allMessages = await Message.find(
      { user_id: userId },
      { created_at: 1, role: 1 }
    ).lean();

    // Fetch user's timezone from MongoDB User model
    const mongoUser = await User.findOne({ user_id: userId }, { timezone: 1 }).lean();
    const userTimezone = mongoUser?.timezone || 'UTC';

    // Calculate messages by hour (0-23) in user's local timezone
    const messagesByHour: number[] = new Array(24).fill(0);
    allMessages.forEach((msg) => {
      const hour = getHourInTimezone(new Date(msg.created_at), userTimezone);
      messagesByHour[hour]++;
    });

    // Calculate longest conversation streak (consecutive days) in user's timezone - only user messages count
    const uniqueDates = [...new Set(
      allMessages
        .filter((msg) => msg.role === "user")
        .map((msg) => getDateStringInTimezone(new Date(msg.created_at), userTimezone))
    )].sort();

    // Recalculate daysActive using user's timezone
    const allUniqueDates = new Set(
      allMessages.map((msg) => getDateStringInTimezone(new Date(msg.created_at), userTimezone))
    );
    const daysActiveLocal = allUniqueDates.size;
    
    let longestStreak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);
    if (uniqueDates.length === 0) longestStreak = 0;



    // Calculate total messages
    const totalMessages = totalUserMessages + totalAssistantMessages;
    const averageMessagesPerActiveDay = daysActiveLocal > 0 ? totalMessages / daysActiveLocal : 0;

    return NextResponse.json({
      overview: {
        totalMemories,
        totalReminders,
        totalEvents,
        activeReminders,
        upcomingEvents,
      },
      activity: {
        thisWeek: {
          memories: thisWeekMemories,
          events: thisWeekEvents,
        },
      },
      messages: {
        total: totalMessages,
        byUser: totalUserMessages,
        byAssistant: totalAssistantMessages,
        daysActive: daysActiveLocal,
        messagesThisWeek,
        averageMessagesPerActiveDay: Math.round(averageMessagesPerActiveDay * 10) / 10,
        longestStreak,
        messagesByHour,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
