import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    //TODO: For updating the calendar event, we need to update the reminder as well. Which we also need to update in Cloud Tasks.
    //If this is not implemented, it will still send old reminders to users.
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

    const updatedEvent = await prisma.calendar_events.update({
      where: { id: eventId },
      data: {
        title,
        description,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
      },
    });

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
