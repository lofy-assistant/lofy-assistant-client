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
    const showRecurrence = searchParams.get("showRecurrence") === "true";

    if (!month || !year) {
      return NextResponse.json({ error: "month and year are required" }, { status: 400 });
    }

    const { startOfMonth, endOfMonth } = getMonthRange(month, year);
    const dateFilter = buildDateFilter(month, year);

    const eventsInRange = await prisma.calendar_events.findMany({
      where: {
        user_id: session.userId,
        ...dateFilter,
        recurrence: null, // Only fetch non-recurring events for this specific month range
      },
      orderBy: { start_time: "asc" },
    });

    // Fetch ALL recurring events to calculate their next occurrence relative to NOW
    const recurringEvents = await prisma.calendar_events.findMany({
      where: {
        user_id: session.userId,
        recurrence: { not: null },
      },
      orderBy: { start_time: "asc" },
    });

    const expanded: (CalendarEventRow & { start_time: Date; end_time: Date })[] = [];

    // Add non-recurring events that are in the requested range
    for (const event of eventsInRange) {
      expanded.push(event);
    }

    const now = new Date();

    // Process recurring events
    for (const event of recurringEvents) {
      if (!event.recurrence) continue;

      try {
        if (showRecurrence) {
          // When showRecurrence is enabled, expand all occurrences in the selected month
          const occurrences = expandRecurringEvent(event, startOfMonth, endOfMonth);
          const durationMs = event.end_time.getTime() - event.start_time.getTime();

          for (const occ of occurrences) {
            expanded.push({
              ...event,
              start_time: occ.start_time,
              end_time: new Date(occ.start_time.getTime() + durationMs),
            });
          }
        } else {
          // Default behavior: only include the next future occurrence
          const rule = rrulestr(event.recurrence, {
            dtstart: event.start_time,
            unfold: true,
          });

          // Find the next occurrence relative to now
          const nextOccurrence = rule.after(now, true);

          if (nextOccurrence && nextOccurrence >= startOfMonth && nextOccurrence <= endOfMonth) {
            const durationMs = event.end_time.getTime() - event.start_time.getTime();
            expanded.push({
              ...event,
              start_time: nextOccurrence,
              end_time: new Date(nextOccurrence.getTime() + durationMs),
            });
          }
        }
      } catch (e) {
        console.error(`Failed to parse recurrence for event ${event.id}`, e);
        continue;
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
