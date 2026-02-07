import { NextRequest, NextResponse } from "next/server";
import { rrulestr } from "rrule";
import { prisma } from '@/lib/database';
import { verifySession } from "@/lib/session";

const buildDateFilter = (month?: string | null, year?: string | null) => {
  if (!month || !year) return {};

  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  const startDate = new Date(yearNum, monthNum - 1, 1);
  const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

  return {
    OR: [
      { start_time: { gte: startDate, lte: endDate } },
      { end_time: { gte: startDate, lte: endDate } },
      {
        AND: [{ start_time: { lt: startDate } }, { end_time: { gt: endDate } }],
      },
    ],
  };
};

function getMonthRange(month: string, year: string) {
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  const startOfMonth = new Date(yearNum, monthNum - 1, 1);
  const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
  return { startOfMonth, endOfMonth };
}

type CalendarEventRow = {
  id: number;
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  is_all_day: boolean;
  recurrence: string | null;
};

function expandRecurringEvent(event: CalendarEventRow, startOfMonth: Date, endOfMonth: Date): { start_time: Date; end_time: Date }[] {
  if (!event.recurrence) return [];

  try {
    const rule = rrulestr(event.recurrence, {
      dtstart: event.start_time,
      unfold: true,
    });
    const durationMs = event.end_time.getTime() - event.start_time.getTime();
    const occurrences = rule.between(startOfMonth, endOfMonth, true);
    return occurrences.map((occStart) => ({
      start_time: occStart,
      end_time: new Date(occStart.getTime() + durationMs),
    }));
  } catch {
    return [];
  }
}

function eventToJson(e: CalendarEventRow & { start_time: Date; end_time: Date }) {
  return {
    ...e,
    start_time: e.start_time.toISOString(),
    end_time: e.end_time.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!month || !year) {
      return NextResponse.json({ error: "month and year are required" }, { status: 400 });
    }

    const { startOfMonth, endOfMonth } = getMonthRange(month, year);
    const dateFilter = buildDateFilter(month, year);

    const eventsInRange = await prisma.calendar_events.findMany({
      where: {
        user_id: session.userId,
        ...dateFilter,
      },
      orderBy: { start_time: "asc" },
    });

    const recurringEvents = await prisma.calendar_events.findMany({
      where: {
        user_id: session.userId,
        recurrence: { not: null },
        start_time: { lte: endOfMonth },
      },
      orderBy: { start_time: "asc" },
    });

    const expanded: (CalendarEventRow & { start_time: Date; end_time: Date })[] = [];

    for (const event of eventsInRange) {
      if (event.recurrence) {
        const occurrences = expandRecurringEvent(event as CalendarEventRow, startOfMonth, endOfMonth);
        for (const occ of occurrences) {
          expanded.push({
            ...event,
            start_time: occ.start_time,
            end_time: occ.end_time,
          });
        }
      } else {
        expanded.push(event);
      }
    }

    const recurringIdsInRange = new Set(eventsInRange.map((e) => e.id));
    for (const event of recurringEvents) {
      if (recurringIdsInRange.has(event.id)) continue;
      const occurrences = expandRecurringEvent(event as CalendarEventRow, startOfMonth, endOfMonth);
      for (const occ of occurrences) {
        expanded.push({
          ...event,
          start_time: occ.start_time,
          end_time: occ.end_time,
        });
      }
    }

    expanded.sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

    const events = expanded.map(eventToJson);

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Calendar API Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, start_time, end_time, timezone = "UTC", is_all_day = false, recurrence } = body;

    if (!title || !start_time || !end_time) {
      return NextResponse.json({ error: "Title, start_time, and end_time are required" }, { status: 400 });
    }

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Validate that end time is after start time
    if (endTime <= startTime) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    // Create calendar event
    const event = await prisma.calendar_events.create({
      data: {
        user_id: session.userId,
        title,
        description: description || null,
        start_time: startTime,
        end_time: endTime,
        timezone,
        is_all_day,
        recurrence: recurrence || null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Calendar Creation Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
