import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const reminderId = parseInt(id);
    // Use proper typing for the incoming request body
    interface UpdateReminderBody {
      message?: string;
      reminder_time?: string;
      recurrence?: string | null;
    }

    const body = (await request.json()) as UpdateReminderBody;
    const { message, reminder_time, recurrence } = body;

    // Construct the payload for the external API
    // The external API expects UpdateReminderInput with "new_" prefix for fields
    interface UpdateReminderPayload {
      reminder_id: number;
      new_message?: string;
      new_reminder_time?: string;
      new_recurrence?: string | null;
    }

    const payload: UpdateReminderPayload = {
      reminder_id: reminderId,
    };

    if (message) payload.new_message = message;
    if (reminder_time) payload.new_reminder_time = reminder_time;
    if (recurrence !== undefined) payload.new_recurrence = recurrence;

    const remindersUrl = `${process.env.FASTAPI_URL}/web/reminders?user_id=${encodeURIComponent(session.userId)}`;
    console.log("[Reminder PUT] Sending payload to external API:", remindersUrl, JSON.stringify(payload, null, 2));

    let apiRes: globalThis.Response;
    try {
      apiRes = await fetch(remindersUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Network error calling reminders API:", err);
      return NextResponse.json({ error: "Failed to reach reminders API" }, { status: 502 });
    }

    type UpstreamResponse = {
        success?: boolean;
        message?: string;
        data?: unknown;
        detail?: string;
        error?: string;
        [key: string]: unknown;
    };

    const text = await apiRes.text();
    let data: UpstreamResponse | string | null = null;
    try {
      data = text ? (JSON.parse(text) as UpstreamResponse) : null;
    } catch {
      data = text;
    }

    if (apiRes.ok) {
       // Return the updated data structure
       return NextResponse.json(data);
    }

    if (apiRes.status === 404) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    const errorMessage = (typeof data === 'object' && data !== null) ? (data.detail || data.error || "Upstream API error") : (typeof data === 'string' ? data : "Upstream API error");

    console.error("Upstream reminders API error:", apiRes.status, data);
    return NextResponse.json({ error: errorMessage }, { status: apiRes.status });

  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const reminderId = parseInt(id);

    interface DeleteReminderPayload {
      reminder_id: number;
    }

    const payload: DeleteReminderPayload = {
      reminder_id: reminderId,
    };

    // The backend expects user_id via query param, and executes tool with (uid, reminder_id=...)
    // If the backend error says missing 'user_id', it might be due to how the tool is defined internally.
    // However, looking at the python code provided:
    // result = await tool.execute(uid, **body.model_dump(exclude_none=True))
    // It passes uid as first arg.
    // Maybe previously sending user_id in body caused conflict or was ignored.
    // Let's stick to the cleanest interface: user_id in query, reminder_id in body.
    
    const remindersUrl = `${process.env.FASTAPI_URL}/web/reminders?user_id=${encodeURIComponent(session.userId)}`;
    console.log("[Reminder DELETE] Sending payload to external API:", remindersUrl, JSON.stringify(payload, null, 2));

    let apiRes: globalThis.Response;
    try {
      apiRes = await fetch(remindersUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Network error calling reminders API:", err);
      return NextResponse.json({ error: "Failed to reach reminders API" }, { status: 502 });
    }

    type UpstreamResponse = {
        success?: boolean;
        message?: string;
        detail?: string;
        error?: string;
        [key: string]: unknown;
    };

    const text = await apiRes.text();
    let data: UpstreamResponse | string | null = null;
    try {
      data = text ? (JSON.parse(text) as UpstreamResponse) : null;
    } catch {
      data = text;
    }

    if (apiRes.ok) {
      return NextResponse.json({ success: true, data });
    }

    if (apiRes.status === 404) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    const errorMessage = (typeof data === 'object' && data !== null) ? (data.detail || data.error || "Upstream API error") : (typeof data === 'string' ? data : "Upstream API error");

    console.error("Upstream reminders API error:", apiRes.status, data);
    return NextResponse.json({ error: errorMessage }, { status: apiRes.status });

  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
