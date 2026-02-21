import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { verifySession } from "@/lib/session";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, start_time, end_time, recurrence } = body;

    // Construct the payload for the external API
    // The external API expects UpdateEventInput which uses "new_" prefix for fields
    
    interface UpdateEventPayload {
      event_id: number;
      new_title?: string;
      new_description?: string | null;
      new_start_time?: string;
      new_end_time?: string;
      new_recurrence?: string | null;
    }

    const payload: UpdateEventPayload = {
      event_id: parseInt(id),
    };

    if (title) payload.new_title = title;
    // Explicitly check for undefined to allow clearing description (sending null) if the API supports it, 
    // but here we just map if present in body.
    if (description !== undefined) payload.new_description = description;
    if (start_time) payload.new_start_time = start_time; // expecting ISO string
    if (end_time) payload.new_end_time = end_time;     // expecting ISO string
    if (recurrence !== undefined) payload.new_recurrence = recurrence;
    // Note: is_all_day and timezone are not part of the UpdateEventInput specification
    // The backend handles timezone lookup via user_id

    // Send user_id as query parameter
    const eventsUrl = `${process.env.FASTAPI_URL}/web/events?user_id=${encodeURIComponent(session.userId)}`;
    console.log("[Calendar PUT] Sending payload to external API:", eventsUrl, JSON.stringify(payload, null, 2));

    let apiRes: globalThis.Response;
    try {
      apiRes = await fetch(eventsUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Network error calling events API:", err);
      return NextResponse.json({ error: "Failed to reach events API" }, { status: 502 });
    }

    type UpstreamResponse = {
        event?: {
            id: number;
            title: string;
            start_time: string;
            end_time: string;
             // Add other fields as needed based on actual API response
            [key: string]: unknown;
        };
        detail?: string; // FastAPI error detail
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
       // Assuming the external API returns the updated event or success message
       // We might need to envelope it in { event: ... } to match the old API response format if the frontend expects it.
       // The old API returned { event: updatedEvent }.
       // The Python snippet returns `resp` from `_result_to_response(result)`.
       // If successful, it likely returns the updated event data.
       return NextResponse.json({ event: data });
    }

    if (apiRes.status === 404) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Narrow down error message
    const errorMessage = (typeof data === 'object' && data !== null) ? (data.detail || data.error || "Upstream API error") : (typeof data === 'string' ? data : "Upstream API error");

    console.error("Upstream events API error:", apiRes.status, data);
    return NextResponse.json({ error: errorMessage }, { status: apiRes.status });

  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { id } = await params;
    const eventId = parseInt(id);

    // Construct the payload for the external API
    // The external API expects DeleteEventInput
    interface DeleteEventPayload {
      event_id: number;
    }

    const payload: DeleteEventPayload = {
      event_id: eventId,
    };

    // Send user_id as query parameter
    // Note: The python endpoint uses @routes.delete("/events"), so we use DELETE method
    // If the fastify setup follows previous pattern, it should be /web/events
    const eventsUrl = `${process.env.FASTAPI_URL}/web/events?user_id=${encodeURIComponent(session.userId)}`;
    console.log("[Calendar DELETE] Sending payload to external API:", eventsUrl, JSON.stringify(payload, null, 2));

    let apiRes: globalThis.Response;
    try {
      apiRes = await fetch(eventsUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Network error calling events API:", err);
      return NextResponse.json({ error: "Failed to reach events API" }, { status: 502 });
    }

    type UpstreamResponse = {
        detail?: string; // FastAPI error detail
        error?: string;
        success?: boolean;
        message?: string;
        [key: string]: unknown;
    };

    const text = await apiRes.text();
    let data : UpstreamResponse | string | null = null;
    try {
      data = text ? (JSON.parse(text) as UpstreamResponse) : null;
    } catch {
      data = text;
    }

    if (apiRes.ok) {
       // If successful, return success
       return NextResponse.json({ success: true, data });
    }

    if (apiRes.status === 404) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

     // Narrow down error message
    const errorMessage = (typeof data === 'object' && data !== null) ? (data.detail || data.error || "Upstream API error") : (typeof data === 'string' ? data : "Upstream API error");

    console.error("Upstream events API error:", apiRes.status, data);
    return NextResponse.json({ error: errorMessage }, { status: apiRes.status });

  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
