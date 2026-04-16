import { NextRequest, NextResponse } from "next/server";

import { getRequestUserId } from "@/lib/session";

function getErrorMessage(data: unknown, status: number): string {
  return typeof data === "object" && data !== null && "detail" in data
    ? String((data as { detail: unknown }).detail)
    : typeof data === "object" && data !== null && "error" in data
      ? String((data as { error: unknown }).error)
      : `Failed to share memory (${status})`;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getRequestUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const fastApiUrl = process.env.FASTAPI_URL;
    if (!fastApiUrl) {
      return NextResponse.json({ error: "FASTAPI_URL environment variable is not set" }, { status: 500 });
    }

    const { id } = await params;
    const memoryId = parseInt(id, 10);
    if (isNaN(memoryId)) {
      return NextResponse.json({ error: "Invalid memory ID" }, { status: 400 });
    }

    const body = (await request.json()) as { friend_user_id?: string };
    if (!body.friend_user_id?.trim()) {
      return NextResponse.json({ error: "friend_user_id is required" }, { status: 400 });
    }

    const response = await fetch(
      `${fastApiUrl}/web/memories/${memoryId}/share?user_id=${encodeURIComponent(userId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friend_user_id: body.friend_user_id,
        }),
      },
    );

    const raw = await response.text();
    let data: unknown = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw;
    }

    if (!response.ok) {
      return NextResponse.json({ error: getErrorMessage(data, response.status) }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Memory share POST API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}