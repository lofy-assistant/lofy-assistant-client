import { NextRequest, NextResponse } from "next/server";
import { rrulestr } from "rrule";
import { prisma } from '@/lib/database';
import User from '@/lib/models/User';
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
    
    // Process recurring events: find the first future occurrence
    for (const event of recurringEvents) {
      if (!event.recurrence) continue;

      try {
        const rule = rrulestr(event.recurrence, {
          dtstart: event.start_time,
          unfold: true,
        });
        
        // Find the next occurrence strictly after NOW
        const nextOccurrence = rule.after(now, true); // inc=true means if now matches exactly, include it? usually false for strict future. Let's start with true to include today if today is the day.
        
        if (nextOccurrence) {
          // Check if this single occurrence falls within the requested month/year range
          if (nextOccurrence >= startOfMonth && nextOccurrence <= endOfMonth) {
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

    type CreateEventBody = {
      title?: string;
      description?: string | null;
      start_time?: string;
      end_time?: string | null;
      timezone?: string;
      is_all_day?: boolean;
      recurrence?: string | null;
    };

    const body = (await request.json()) as CreateEventBody;
    const {
      title,
      description,
      start_time,
      end_time,
      is_all_day = false,
      recurrence,
    } = body;

    // Debug: log exactly what the client sent
    console.log("[Calendar POST] Received body:", JSON.stringify(body, null, 2));
  
    if (!title || !start_time) {
      return NextResponse.json({ error: "Title and start_time are required" }, { status: 400 });
    }

    // If both start and end parse as valid dates, enforce end > start.
    const parsedStart = new Date(start_time);
    const parsedEnd = end_time ? new Date(end_time) : null;
    if (
      !isNaN(parsedStart.getTime()) &&
      parsedEnd &&
      !isNaN(parsedEnd.getTime()) &&
      parsedEnd <= parsedStart
    ) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    type EventPayload = {
      title: string;
      start_time: string;
      is_all_day: boolean;
      timezone?: string;
      end_time?: string;
      description?: string;
      recurrence?: string;
    };

    const payload: EventPayload = {
      title,
      start_time,
      is_all_day,
    };

    // Try to fetch user's timezone from MongoDB User model if present
    try {
      const mongoUser = await User.findOne({ user_id: session.userId }).exec();
      if (mongoUser?.timezone) {
        payload.timezone = mongoUser.timezone;
      }
    } catch (err) {
      console.error("Failed to fetch user timezone from MongoDB:", err);
    }

    if (end_time) payload.end_time = end_time;
    if (description) payload.description = description;
    if (recurrence) payload.recurrence = recurrence;

    // Send user_id as query parameter to the upstream events API
    const eventsUrl = `${process.env.FASTAPI_URL}/web/events?user_id=${encodeURIComponent(session.userId)}`;
    console.log("[Calendar POST] Sending payload to external API:", eventsUrl, JSON.stringify(payload, null, 2));

    let apiRes: globalThis.Response;
    try {
      apiRes = await fetch(eventsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Network error calling events API:", err);
      return NextResponse.json({ error: "Failed to reach events API" }, { status: 502 });
    }

    type ApiResponse = {
      success?: boolean;
      message?: string;
      data?: {
        event_id?: string;
        title?: string;
        start_time?: string;
        end_time?: string;
        google_calendar_synced?: boolean;
      };
      error?: string;
    };

    const text = await apiRes.text();
    let data: ApiResponse | string | null = null;
    try {
      data = text ? (JSON.parse(text) as ApiResponse) : null;
    } catch {
      data = text;
    }

    if (apiRes.ok) {
      // Expecting { success: true, message, data }
      const resData = typeof data === "object" && data !== null ? data : null;
      return NextResponse.json(
        { success: true, message: resData?.message || "Event created", data: resData?.data || null },
        { status: 200 },
      );
    }

    if (apiRes.status === 409) {
      return NextResponse.json({ error: data || "Conflict - duplicate event" }, { status: 409 });
    }

    if (apiRes.status === 400) {
      return NextResponse.json({ error: data || "Bad request" }, { status: 400 });
    }

    console.error("Upstream events API error:", apiRes.status, data);
    return NextResponse.json({ error: data || "Upstream API error" }, { status: 500 });
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
