import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - missing session token" },
        { status: 401 }
      );
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Unauthorized - invalid session" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Account deletion is not supported" },
      { status: 403 }
    );
  } catch (error) {

    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to validate account deletion request" },
      { status: 500 }
    );
  }
}
