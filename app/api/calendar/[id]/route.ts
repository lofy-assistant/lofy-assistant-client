import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const eventId = parseInt(params.id);
    const body = await request.json();
    const { title, description, start_time, end_time } = body;

    const event = await prisma.calendar_events.findUnique({
      where: { id: eventId },
    });

    if (!event || event.user_id !== session.userId) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const newStartTime = new Date(start_time);
    const startTimeChanged = event.start_time.getTime() !== newStartTime.getTime();

    // Update the calendar event
    const updatedEvent = await prisma.calendar_events.update({
      where: { id: eventId },
      data: {
        title,
        description,
        start_time: newStartTime,
        end_time: new Date(end_time),
      },
    });

    // Update the reminder if start time changed and reminder exists
    if (startTimeChanged && event.reminder_id) {
      // Calculate new reminder time: 30 minutes before start time
      const newReminderTime = new Date(newStartTime.getTime() - 30 * 60 * 1000);

      // Update the reminder in database
      await prisma.reminders.update({
        where: { id: event.reminder_id },
        data: {
          reminder_time: newReminderTime,
        },
      });
    }

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const eventId = parseInt(params.id);

    const event = await prisma.calendar_events.findUnique({
      where: { id: eventId },
    });

    if (!event || event.user_id !== session.userId) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.calendar_events.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
