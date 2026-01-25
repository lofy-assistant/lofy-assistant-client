import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ isLoggedIn: false });
    }

    const session = await verifySession(sessionToken);

    if (!session) {
      return NextResponse.json({ isLoggedIn: false });
    }

    return NextResponse.json({ isLoggedIn: true, userId: session.userId });
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json({ isLoggedIn: false });
  }
}
