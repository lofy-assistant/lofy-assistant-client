import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prisma } from '@/lib/database';

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

    // Get all integration credentials for the user with their integrations
    const credentials = await prisma.integration_credentials.findMany({
      where: {
        user_id: session.userId,
      },
      include: {
        integrations: true,
      },
    });

    // Build a map of integration statuses
    const integrationStatuses: Record<string, { isActive: boolean; status: "connected" | "disconnected" | "error" }> = {};

    for (const cred of credentials) {
      // For Google Calendar, check if there's a calendar integration
      if (cred.provider_name === "google") {
        const calendarIntegration = cred.integrations.find(
          (i) => i.integration_type === "google_calendar"
        );
        
        if (calendarIntegration) {
          integrationStatuses["google-calendar"] = {
            isActive: calendarIntegration.is_active,
            status: calendarIntegration.is_active ? "connected" : "disconnected",
          };
        }
      }
    }

    return NextResponse.json({ integrations: integrationStatuses });
  } catch (error) {
    console.error("Integration Status API Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
