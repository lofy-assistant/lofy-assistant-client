import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, getRequestSessionToken } from "@/lib/session";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

/**
 * Start Google OAuth. Requires a user-chosen account name.
 * GET ?integrationLabel=...  or  POST JSON { integrationLabel: "..." }
 */
export async function GET(request: NextRequest) {
  return startGoogleOAuth(request, request.nextUrl.searchParams.get("integrationLabel"));
}

export async function POST(request: NextRequest) {
  let label: string | null = null;
  try {
    const body = (await request.json()) as { integrationLabel?: string };
    label = body.integrationLabel ?? null;
  } catch {
    label = null;
  }
  return startGoogleOAuth(request, label);
}

async function startGoogleOAuth(request: NextRequest, integrationLabel: string | null) {
  try {
    if (!getRequestSessionToken(request)) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await getRequestSession(request);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const trimmed = (integrationLabel ?? "").trim();
    if (!trimmed) {
      return NextResponse.json(
        { error: "integrationLabel is required (name for this Google account)" },
        { status: 400 },
      );
    }

    if (!process.env.FASTAPI_URL) {
      return NextResponse.json({ error: "FASTAPI_URL environment variable is not set" }, { status: 500 });
    }

    const params = new URLSearchParams({
      user_id: session.userId,
      integration_label: trimmed,
    });

    const authorizeUrl = `${process.env.FASTAPI_URL}/google/authorize?${params.toString()}`;

    const integrationsResponse = await fetch(authorizeUrl, {
      method: "GET",
      redirect: "manual",
    });

    if (integrationsResponse.status === 302 || integrationsResponse.status === 307) {
      const location = integrationsResponse.headers.get("location");
      if (location) {
        return NextResponse.json({ redirectUrl: location });
      }
    }

    if (!integrationsResponse.ok) {
      const errorText = await integrationsResponse.text();
      throw new Error(`Failed to get authorization URL: ${errorText}`);
    }

    return NextResponse.json({ error: "Unexpected response from authorization endpoint" }, { status: 500 });
  } catch (error) {
    console.error("Integration API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to initiate Google authorization",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
