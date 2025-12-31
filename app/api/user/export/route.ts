import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

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

    // Fetch all user data
    const [user, memories, calendarEvents, reminders, tasks, feedbacks] =
      await Promise.all([
        prisma.users.findUnique({
          where: { id: session.userId },
          select: {
            id: true,
            name: true,
            email: true,
            created_at: true,
            updated_at: true,
          },
        }),
        prisma.memories.findMany({
          where: { user_id: session.userId },
          select: {
            id: true,
            title: true,
            content: true,
            created_at: true,
            updated_at: true,
          },
        }),
        prisma.calendar_events.findMany({
          where: { user_id: session.userId },
          select: {
            id: true,
            title: true,
            description: true,
            start_time: true,
            end_time: true,
            timezone: true,
            is_all_day: true,
            created_at: true,
            updated_at: true,
          },
        }),
        prisma.reminders.findMany({
          where: { user_id: session.userId },
          select: {
            id: true,
            message: true,
            reminder_time: true,
            status: true,
            created_at: true,
            updated_at: true,
          },
        }),
        prisma.tasks.findMany({
          where: { user_id: session.userId },
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            created_at: true,
            updated_at: true,
          },
        }),
        prisma.feedbacks.findMany({
          where: { user_id: session.userId },
          select: {
            id: true,
            title: true,
            description: true,
            tag: true,
            created_at: true,
            updated_at: true,
          },
        }),
      ]);

    const exportData = {
      user,
      memories,
      calendarEvents,
      reminders,
      tasks,
      feedbacks,
      exportedAt: new Date().toISOString(),
    };

    // Return as JSON file download
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="lofy-data-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      { error: "Failed to export user data" },
      { status: 500 }
    );
  }
}
