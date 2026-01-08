import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

// Helper: build date filter if month/year provided
const buildDateFilter = (month?: string | null, year?: string | null) => {
    if (!month || !year) return {};

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    return {
        reminder_time: { gte: startDate, lte: endDate }
    };
};

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

        const { searchParams } = new URL(request.url);
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const status = searchParams.get("status") || "pending";

        const dateFilter = buildDateFilter(month, year);

        const reminders = await prisma.reminders.findMany({
            where: {
                user_id: session.userId,
                status,
                ...dateFilter,
            },
            orderBy: { reminder_time: "asc" },
        });

        return NextResponse.json({ reminders }, { status: 200 });
    } catch (error) {
        console.error("Reminder API Error:", error);

        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { message, reminder_time, status = "pending" } = body;

        if (!message || !reminder_time) {
            return NextResponse.json(
                { error: "Message and reminder_time are required" },
                { status: 400 }
            );
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
            { status: 500 }
        );
    }
}
