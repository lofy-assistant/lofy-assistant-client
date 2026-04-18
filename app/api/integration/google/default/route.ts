import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, getRequestSessionToken } from "@/lib/session";
import { prisma } from "@/lib/database";

export const dynamic = "force-dynamic";

/** Set which connected Google account is the default for Calendar (and future Gmail). */
export async function POST(request: NextRequest) {
  try {
    if (!getRequestSessionToken(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await getRequestSession(request);
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { credentialId?: number };
    const credentialId = body.credentialId;
    if (credentialId == null || typeof credentialId !== "number" || !Number.isFinite(credentialId)) {
      return NextResponse.json({ error: "credentialId is required" }, { status: 400 });
    }

    const cred = await prisma.integration_credentials.findFirst({
      where: {
        id: credentialId,
        user_id: session.userId,
        provider_name: "google",
        deleted_at: null,
      },
      include: { integrations: true },
    });

    if (!cred) {
      return NextResponse.json({ error: "Google account not found" }, { status: 404 });
    }

    const hasCalendar = cred.integrations.some(
      (i) =>
        i.integration_type === "google_calendar" &&
        i.deleted_at == null &&
        i.is_active
    );
    if (!hasCalendar) {
      return NextResponse.json(
        { error: "That connection does not have an active Google Calendar integration." },
        { status: 400 }
      );
    }

    await prisma.users.update({
      where: { id: session.userId },
      data: { default_google_credential_id: credentialId },
    });

    return NextResponse.json({
      status: "ok",
      defaultGoogleCredentialId: credentialId,
    });
  } catch (e) {
    console.error("Set default Google credential error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
