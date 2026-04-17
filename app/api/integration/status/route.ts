import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prisma } from '@/lib/database';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

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

    const integrationStatuses: Record<
      string,
      {
        isActive: boolean;
        status: "connected" | "disconnected" | "error";
        accounts?: Array<{
          credentialId: number;
          displayName: string | null;
          googleEmail: string | null;
          isActive: boolean;
        }>;
      }
    > = {};

    const googleAccounts: Array<{
      credentialId: number;
      displayName: string | null;
      googleEmail: string | null;
      isActive: boolean;
    }> = [];

    for (const cred of credentials) {
      if (cred.provider_name !== "google" || cred.deleted_at) continue;
      const calendarIntegration = cred.integrations.find(
        (i) => i.integration_type === "google_calendar" && !i.deleted_at
      );
      if (!calendarIntegration) continue;

      const settings = calendarIntegration.settings as Record<string, unknown> | null;
      const credJson = cred.credentials as Record<string, unknown> | null;
      const googleEmail =
        (typeof credJson?.google_email === "string" ? credJson.google_email : null) ??
        (typeof settings?.google_email === "string" ? settings.google_email : null);

      googleAccounts.push({
        credentialId: cred.id,
        displayName: cred.display_name ?? (typeof settings?.label === "string" ? settings.label : null),
        googleEmail,
        isActive: calendarIntegration.is_active,
      });
    }

    const anyGoogleActive = googleAccounts.some((a) => a.isActive);
    integrationStatuses["google-calendar"] = {
      isActive: anyGoogleActive,
      status: anyGoogleActive ? "connected" : googleAccounts.length ? "disconnected" : "disconnected",
      accounts: googleAccounts,
    };

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
