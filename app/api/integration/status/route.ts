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
        defaultGoogleCredentialId?: number | null;
        accounts?: Array<{
          credentialId: number;
          displayName: string | null;
          googleEmail: string | null;
          isActive: boolean;
          isDefault: boolean;
        }>;
      }
    > = {};

    const googleAccounts: Array<{
      credentialId: number;
      displayName: string | null;
      googleEmail: string | null;
      isActive: boolean;
      isDefault: boolean;
    }> = [];

    for (const cred of credentials) {
      if (cred.provider_name !== "google") continue;
      const calendarIntegration = cred.integrations.find(
        (i) => i.integration_type === "google_calendar"
      );
      if (!calendarIntegration) continue;

      const credJson = cred.credentials as Record<string, unknown> | null;
      const googleEmail =
        typeof credJson?.google_email === "string" ? credJson.google_email : null;

      googleAccounts.push({
        credentialId: cred.id,
        displayName: cred.display_name ?? (typeof credJson?.label === "string" ? credJson.label : null),
        googleEmail,
        isActive: calendarIntegration.is_active,
        isDefault: cred.is_default,
      });
    }

    const activeIds = googleAccounts.filter((a) => a.isActive).map((a) => a.credentialId);
    const activeDefaultIds = googleAccounts
      .filter((a) => a.isActive && a.isDefault)
      .map((a) => a.credentialId);
    let defaultGoogleCredentialId: number | null = activeDefaultIds[0] ?? null;

    if (activeIds.length === 0) {
      if (googleAccounts.some((a) => a.isDefault)) {
        await prisma.integration_credentials.updateMany({
          where: { user_id: session.userId, provider_name: "google", is_default: true },
          data: { is_default: false },
        });
      }
      defaultGoogleCredentialId = null;
    } else if (activeDefaultIds.length !== 1) {
      const pick = activeDefaultIds[0] ?? Math.min(...activeIds);
      await prisma.$transaction([
        prisma.integration_credentials.updateMany({
          where: { user_id: session.userId, provider_name: "google", id: { not: pick } },
          data: { is_default: false },
        }),
        prisma.integration_credentials.update({
          where: { id: pick },
          data: { is_default: true },
        }),
      ]);
      defaultGoogleCredentialId = pick;
    }

    for (const a of googleAccounts) {
      a.isDefault = a.credentialId === defaultGoogleCredentialId;
    }

    const anyGoogleActive = googleAccounts.some((a) => a.isActive);
    integrationStatuses["google-calendar"] = {
      isActive: anyGoogleActive,
      status: anyGoogleActive ? "connected" : googleAccounts.length ? "disconnected" : "disconnected",
      defaultGoogleCredentialId,
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
