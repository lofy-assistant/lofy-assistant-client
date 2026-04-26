import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prisma } from "@/lib/database";

/** Slugs for beta / waitlist features; extend as new programs are added. */
const ALLOWED_FEATURES = new Set(["google_sheets"]);

async function getUserIdFromRequest(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;
  const session = await verifySession(token);
  return session?.userId ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const feature = request.nextUrl.searchParams.get("feature");
    if (!feature || typeof feature !== "string" || !ALLOWED_FEATURES.has(feature)) {
      return NextResponse.json({ error: "Invalid feature" }, { status: 400 });
    }

    const row = await prisma.feature_waitlist.findFirst({
      where: { user_id: userId, feature },
      select: { id: true },
    });

    return NextResponse.json({ enrolled: Boolean(row) });
  } catch (error) {
    console.error("Waitlist GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { feature?: string };
    const feature = body.feature;
    if (!feature || typeof feature !== "string" || !ALLOWED_FEATURES.has(feature)) {
      return NextResponse.json({ error: "Invalid feature" }, { status: 400 });
    }

    const existing = await prisma.feature_waitlist.findFirst({
      where: { user_id: userId, feature },
    });
    if (!existing) {
      await prisma.feature_waitlist.create({ data: { user_id: userId, feature } });
    }

    return NextResponse.json({ ok: true, enrolled: true });
  } catch (error) {
    console.error("Waitlist POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
