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
      // Build URL with query parameters instead of body
      const params = new URLSearchParams({
        user_id: session.userId,
      });

      // Optional: add redirect_url if you want to use it (though FastAPI doesn't use it currently)
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/integration/callback`;
      params.append("redirect_url", redirectUrl);

      const authorizeUrl = `${process.env.FASTAPI_URL}/google/authorize?${params.toString()}`;

      const integrationsResponse = await fetch(authorizeUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Note: redirect: 'manual' to handle the redirect ourselves
        redirect: "manual",
      });

      if (integrationsResponse.status === 302 || integrationsResponse.status === 307) {
        // FastAPI returned a redirect - get the Location header and redirect the user
        const location = integrationsResponse.headers.get("location");
        if (location) {
          return NextResponse.redirect(location);
        }
      }

      if (!integrationsResponse.ok) {
        const errorText = await integrationsResponse.text();
        throw new Error(`Failed to get authorization URL: ${errorText}`);
      }

      // Fallback: if response is OK but not a redirect, return error
      return NextResponse.json({ error: "Unexpected response from authorization endpoint" }, { status: 500 });
    } catch (integrationError) {
      console.error("Integration API Error:", integrationError);
      return NextResponse.json({ error: "Failed to initiate Google authorization", details: integrationError instanceof Error ? integrationError.message : "Unknown error" }, { status: 500 });
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
