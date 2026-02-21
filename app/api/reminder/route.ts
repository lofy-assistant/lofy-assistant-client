import { NextRequest, NextResponse } from "next/server";
import { rrulestr } from "rrule";
import { prisma } from '@/lib/database';
import { verifySession } from "@/lib/session";

// Helper: build date filter if month/year provided
const buildDateFilter = (month?: string | null, year?: string | null) => {
  if (!month || !year) return {};

  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  const startDate = new Date(yearNum, monthNum - 1, 1);
  const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

  return {
    reminder_time: { gte: startDate, lte: endDate },
  };
};

function getMonthRange(month: string, year: string) {
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  const startOfMonth = new Date(yearNum, monthNum - 1, 1);
  const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
  return { startOfMonth, endOfMonth };
}

type ReminderRow = {
  id: number;
  user_id: string;
  message: string;
  reminder_time: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  recurrence: string | null;
  next_recurrence: Date | null;
};

function expandRecurringReminder(reminder: ReminderRow, startOfMonth: Date, endOfMonth: Date): Date[] {
  if (!reminder.recurrence) return [];

  try {
    const rule = rrulestr(reminder.recurrence, {
      dtstart: reminder.reminder_time,
      unfold: true,
    });
    return rule.between(startOfMonth, endOfMonth, true);
  } catch {
    return [];
  }
}

type ExpandedReminder = ReminderRow & { reminder_time: Date; effectiveStatus?: string };

function reminderToJson(r: ExpandedReminder) {
  const status = r.effectiveStatus ?? r.status;
  return {
    id: r.id,
    user_id: r.user_id,
    message: r.message,
    reminder_time: r.reminder_time.toISOString(),
    status,
    created_at: r.created_at.toISOString(),
    updated_at: r.updated_at.toISOString(),
    recurrence: r.recurrence,
    next_recurrence: r.next_recurrence?.toISOString() ?? null,
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
    const status = searchParams.get("status") || "pending";

    if (!month || !year) {
      return NextResponse.json({ error: "month and year are required" }, { status: 400 });
    }

    const { startOfMonth, endOfMonth } = getMonthRange(month, year);
    const dateFilter = buildDateFilter(month, year);
    const now = new Date();

    const remindersInRange = await prisma.reminders.findMany({
      where: {
        user_id: session.userId,
        status,
        ...dateFilter,
        recurrence: null, // Only fetch non-recurring reminders for this specific month range
      },
      orderBy: { reminder_time: "asc" },
    });

    // Fetch ALL recurring reminders to calculate their next occurrence relative to NOW
    const recurringWhere =
      status === "pending"
        ? {
            user_id: session.userId,
            recurrence: { not: null },
          }
        : {
            user_id: session.userId,
            status,
            recurrence: { not: null },
          };

    const recurringReminders = await prisma.reminders.findMany({
      where: recurringWhere,
      orderBy: { reminder_time: "asc" },
    });

    const expanded: ExpandedReminder[] = [];

    // Add non-recurring reminders that are in the requested range
    for (const reminder of remindersInRange) {
      expanded.push(reminder);
    }

    // Process recurring reminders: find the first future occurrence
    for (const reminder of recurringReminders) {
      if (!reminder.recurrence) continue;

      try {
        const rule = rrulestr(reminder.recurrence, {
          dtstart: reminder.reminder_time,
          unfold: true,
        });

        // Find the next occurrence relative to NOW
        const nextOccurrence = rule.after(now, true);

        if (nextOccurrence) {
          const isFuture = nextOccurrence >= now;
          
          // Apply status filtering logic for the occurrence
          if (status === "pending" && !isFuture) continue;
          if (status === "completed" && isFuture) continue;

          // Check if this single occurrence falls within the requested month/year range
          if (nextOccurrence >= startOfMonth && nextOccurrence <= endOfMonth) {
             const effectiveStatus = isFuture ? "pending" : reminder.status;
             expanded.push({
               ...reminder,
               reminder_time: nextOccurrence,
               effectiveStatus,
             });
          }
        }
      } catch (e) {
        console.error(`Failed to parse recurrence for reminder ${reminder.id}`, e);
        continue;
      }
    }

    expanded.sort((a, b) => a.reminder_time.getTime() - b.reminder_time.getTime());

    const reminders = expanded.map(reminderToJson);

    return NextResponse.json({ reminders }, { status: 200 });
  } catch (error) {
    console.error("Reminder API Error:", error);

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
    const { message, reminder_time, status = "pending" } = body;

    if (!message || !reminder_time) {
      return NextResponse.json({ error: "Message and reminder_time are required" }, { status: 400 });
    }

    const reminder = await prisma.reminders.create({
      data: {
        user_id: session.userId,
        message,
        reminder_time: new Date(reminder_time),
        status,
      },
    });

    return NextResponse.json({ reminder }, { status: 201 });
  } catch (error) {
    console.error("Reminder Creation Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
