import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

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

    // Get all analytics data in parallel
    const [
      totalMemories,
      totalReminders,
      totalEvents,
      activeReminders,
      upcomingEvents,
      thisWeekMemories,
      thisWeekEvents,
    ] = await Promise.all([
      // Total counts
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
    ]);

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
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
