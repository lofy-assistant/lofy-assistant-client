import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
                AND: [
                    { start_time: { lt: startDate } },
                    { end_time: { gt: endDate } },
                ],
            },
        ],
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

        const dateFilter = buildDateFilter(month, year);

        const events = await prisma.calendar_events.findMany({
            where: {
                user_id: session.userId,
                ...dateFilter,
            },
            orderBy: { start_time: "asc" },
        });

        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error("Calendar API Error:", error);

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
        const { 
            title, 
            description, 
            start_time, 
            end_time, 
            timezone = "UTC", 
            is_all_day = false,
            recurrence
        } = body;

        if (!title || !start_time || !end_time) {
            return NextResponse.json(
                { error: "Title, start_time, and end_time are required" },
                { status: 400 }
            );
        }

        const startTime = new Date(start_time);
        const endTime = new Date(end_time);

        // Validate that end time is after start time
        if (endTime <= startTime) {
            return NextResponse.json(
                { error: "End time must be after start time" },
                { status: 400 }
            );
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
            { status: 500 }
        );
    }
}
