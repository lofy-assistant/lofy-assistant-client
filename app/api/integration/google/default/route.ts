import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, getRequestSessionToken } from "@/lib/session";
import { prisma } from "@/lib/database";

export const dynamic = "force-dynamic";

/** Set which connected Google credential is the default Calendar target. */
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
      },
      include: { integrations: true },
    });

    if (!cred) {
      return NextResponse.json({ error: "Google account not found" }, { status: 404 });
    }

    const hasCalendar = cred.integrations.some(
      (i) =>
        i.integration_type === "google_calendar" &&
        i.is_active
    );
    if (!hasCalendar) {
      return NextResponse.json(
        { error: "That connection does not have an active Google Calendar integration." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.integration_credentials.updateMany({
        where: { user_id: session.userId, provider_name: "google", id: { not: credentialId } },
        data: { is_default: false },
      }),
      prisma.integration_credentials.update({
        where: { id: credentialId },
        data: { is_default: true },
      }),
    ]);

    return NextResponse.json({
      status: "ok",
      defaultGoogleCredentialId: credentialId,
    });
  } catch (e) {
    console.error("Set default Google credential error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
