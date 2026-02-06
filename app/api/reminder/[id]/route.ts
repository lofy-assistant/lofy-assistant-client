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

    const oldReminderId = parseInt(params.id);
    const body = await request.json();
    const { message, reminder_time } = body;

    // Step 1: Get existing reminder by reminder_id, verify ownership
    const oldReminder = await prisma.reminders.findUnique({
      where: { id: oldReminderId },
    });

    if (!oldReminder || oldReminder.user_id !== session.userId) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    // Validation
    // Validate message if provided
    if (message !== undefined) {
      if (typeof message !== "string") {
        return NextResponse.json({ error: "Message must be a string" }, { status: 400 });
      }
      if (message.trim().length === 0) {
        return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
      }
      if (message.length > 500) {
        return NextResponse.json({ error: "Message must be 500 characters or less" }, { status: 400 });
      }
    }
    if (!reminder_time) {
      return NextResponse.json({ error: "reminder_time is required" }, { status: 400 });
    }
    if (new Date(reminder_time) <= new Date()) {
      return NextResponse.json({ error: "Reminder time must be in the future" }, { status: 400 });
    }

    // Step 2: Create NEW reminder with:
    // - Message: use new message if provided, else existing message
    // - Reminder time: use new reminder_time
    // - Status: copy from existing reminder
    // - Recurrence: preserve from existing reminder so future occurrences still show
    const newMessage = message !== undefined ? message : oldReminder.message;
    const newReminder = await prisma.reminders.create({
      data: {
        user_id: session.userId,
        message: newMessage,
        reminder_time: new Date(reminder_time),
        status: oldReminder.status,
        recurrence: oldReminder.recurrence,
        next_recurrence: oldReminder.next_recurrence,
      },
    });

    // Step 3: Check for calendar events and update them
    const calendarEvents = await prisma.calendar_events.findMany({
      where: { reminder_id: oldReminderId },
    });

    if (calendarEvents.length > 0) {
      // Step 4: Update ALL calendar events to reference the new_reminder_id
      await prisma.calendar_events.updateMany({
        where: { reminder_id: oldReminderId },
        data: { reminder_id: newReminder.id },
      });
      console.log(`Updated ${calendarEvents.length} calendar event(s) to reference new reminder ${newReminder.id}`);
    }

    // Step 5: Delete old reminder
    await prisma.reminders.delete({
      where: { id: oldReminderId },
    });
    console.log(`Deleted old reminder ${oldReminderId}`);

    // Step 6: Return the new reminder (with new ID)
    return NextResponse.json({ reminder: newReminder });
  } catch (error) {
    console.error("Error updating reminder:", error);
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

    const reminderId = parseInt(params.id);

    const reminder = await prisma.reminders.findUnique({
      where: { id: reminderId },
    });

    if (!reminder || reminder.user_id !== session.userId) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    // Delete the reminder from database
    await prisma.reminders.delete({
      where: { id: reminderId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
