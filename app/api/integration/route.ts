import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

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

    try {
      // Build URL with query parameters (GET requests don't have bodies)
      const params = new URLSearchParams({
        user_id: session.userId,
      });

      const authorizeUrl = `${process.env.FASTAPI_URL}/google/authorize?${params.toString()}`;

      const integrationsResponse = await fetch(authorizeUrl, {
        method: "GET",
        // Use 'manual' redirect mode to handle the redirect ourselves
        redirect: "manual",
      });

      // FastAPI returns a RedirectResponse (302/307) to Google's OAuth page
      if (integrationsResponse.status === 302 || integrationsResponse.status === 307) {
        const location = integrationsResponse.headers.get("location");
        if (location) {
          // Return JSON with redirect URL so client can handle it
          return NextResponse.json({ redirectUrl: location });
        }
      }

      // If not a redirect, something went wrong
      if (!integrationsResponse.ok) {
        const errorText = await integrationsResponse.text();
        throw new Error(`Failed to get authorization URL: ${errorText}`);
      }

      return NextResponse.json({ error: "Unexpected response from authorization endpoint" }, { status: 500 });
    } catch (integrationError) {
      console.error("Integration API Error:", integrationError);
      return NextResponse.json(
        {
          error: "Failed to initiate Google authorization",
          details: integrationError instanceof Error ? integrationError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Integration API Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
