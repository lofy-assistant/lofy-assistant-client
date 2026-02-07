import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prisma } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("session")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const session = await verifySession(token);

        if (!session) {
            return NextResponse.json(
                { error: "Invalid session" },
                { status: 401 }
            );
        }

        // Fetch user details from database
        const user = await prisma.users.findUnique({
            where: { id: session.userId },
            select: { id: true, name: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    name: user.name
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Session validation error:", error);
        return NextResponse.json(
            { error: "Session validation failed" },
            { status: 500 }
        );
    }
}
