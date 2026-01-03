import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { deleteCloudTask, enqueueCloudTask } from "@/lib/cloud-tasks";
import { decryptContent } from "@/lib/encryption";

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
    if (message && (typeof message !== "string" || message.trim().length === 0)) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }
    if (message && message.length > 500) {
      return NextResponse.json({ error: "Message must be 500 characters or less" }, { status: 400 });
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
    const newMessage = message || oldReminder.message;
    const newReminder = await prisma.reminders.create({
      data: {
        user_id: session.userId,
        message: newMessage,
        reminder_time: new Date(reminder_time),
        status: oldReminder.status,
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

    // Step 6: Delete old cloud task - handle errors gracefully
    try {
      await deleteCloudTask("reminder-queue", oldReminderId);
      console.log(`Deleted cloud task for old reminder ${oldReminderId}`);
    } catch (taskError) {
      console.error(`Error deleting cloud task for reminder ${oldReminderId}:`, taskError);
      // Don't fail the entire request if cloud task deletion fails
    }

    // Step 7: Create new cloud task with new reminder_id
    try {
      // Get user's phone number for the task
      const user = await prisma.users.findUnique({
        where: { id: session.userId },
        select: { encrypted_phone: true },
      });

      if (user?.encrypted_phone) {
        const phoneNumber = decryptContent(user.encrypted_phone);
        const taskData = {
          reminder_id: newReminder.id,
          message: newMessage,
          phone_number: phoneNumber,
        };

        console.log(`Creating new cloud task for reminder ${newReminder.id} scheduled for ${reminder_time}`);
        await enqueueCloudTask("/worker/send-reminder", "reminder-queue", String(newReminder.id), taskData, new Date(reminder_time));
        console.log(`Successfully created cloud task for reminder ${newReminder.id}`);
      } else {
        console.warn(`No phone number found for user ${session.userId}, skipping cloud task creation`);
      }
    } catch (taskError) {
      console.error(`Error creating cloud task for reminder ${newReminder.id}:`, taskError);
      console.error(`Error details:`, JSON.stringify(taskError, null, 2));
      // Don't fail the entire request if cloud task creation fails
      // The reminder is still created in the database
    }

    // Step 8: Return the new reminder (with new ID)
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

    // Delete the associated cloud task
    try {
      await deleteCloudTask("reminder-queue", reminderId);
      console.log(`Deleted cloud task for reminder ${reminderId}`);
    } catch (taskError) {
      console.error("Error deleting cloud task:", taskError);
      // Don't fail the entire request if cloud task deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
