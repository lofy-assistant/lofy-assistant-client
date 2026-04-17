import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, getRequestSessionToken } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Disconnect one Google account by integration_credentials.id */
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
    if (credentialId == null || typeof credentialId !== "number") {
      return NextResponse.json({ error: "credentialId is required" }, { status: 400 });
    }

    if (!process.env.FASTAPI_URL) {
      return NextResponse.json({ error: "FASTAPI_URL not set" }, { status: 500 });
    }

    const params = new URLSearchParams({
      user_id: session.userId,
      credential_id: String(credentialId),
    });
    const url = `${process.env.FASTAPI_URL}/google/disconnect?${params.toString()}`;
    const res = await fetch(url, { method: "GET" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: (data as { detail?: string }).detail || "Disconnect failed" },
        { status: res.status },
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("Google disconnect error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
