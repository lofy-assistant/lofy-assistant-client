import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { verifySession } from "@/lib/session";
import { connectMongo } from "@/lib/database";
import { Message } from "@/lib/models";

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
      daysActive,
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
      // Days active calculation
      (async () => {
        const messages = await Message.find({ user_id: userId }, { created_at: 1 }).lean();
        const uniqueDays = new Set(messages.map((msg) => new Date(msg.created_at).toISOString().split('T')[0]));
        return uniqueDays.size;
      })(),
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

    // Calculate messages by hour (0-23)
    const messagesByHour: number[] = new Array(24).fill(0);
    allMessages.forEach((msg) => {
      const hour = new Date(msg.created_at).getHours();
      messagesByHour[hour]++;
    });

    // Calculate longest conversation streak (consecutive days) - only user messages count
    const uniqueDates = [...new Set(
      allMessages
        .filter((msg) => msg.role === "user")
        .map((msg) => new Date(msg.created_at).toISOString().split('T')[0])
    )].sort();
    
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
    const averageMessagesPerActiveDay = daysActive > 0 ? totalMessages / daysActive : 0;

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
        daysActive,
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
