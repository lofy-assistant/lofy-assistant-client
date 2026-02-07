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

    const userId = session.userId;

    // Connect to MongoDB
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

      // MongoDB message analytics
      // Total messages from user
      Message.countDocuments({ user_id: userId, role: "user" }),
      
      // Total messages from assistant
      Message.countDocuments({ user_id: userId, role: "assistant" }),
      
      // Days active - count unique days with at least one message
      (async () => {
        const messages = await Message.find(
          { user_id: userId },
          { created_at: 1 }
        ).lean();
        
        const uniqueDays = new Set(
          messages.map(msg => 
            new Date(msg.created_at).toISOString().split('T')[0]
          )
        );
        
        return uniqueDays.size;
      })(),
    ]);

    // Calculate total messages
    const totalMessages = totalUserMessages + totalAssistantMessages;

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
