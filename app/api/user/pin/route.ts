import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { currentPin, newPin } = body;

    if (!currentPin || !newPin) {
      return NextResponse.json(
        { error: "Current PIN and new PIN are required" },
        { status: 400 }
      );
    }

    if (newPin.length < 4) {
      return NextResponse.json(
        { error: "New PIN must be at least 4 characters" },
        { status: 400 }
      );
    }

    // Get user's current PIN
    const user = await prisma.users.findUnique({
      where: { id: session.userId },
      select: { pin: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current PIN
    if (!user.pin) {
      return NextResponse.json(
        { error: "No PIN set for this account" },
        { status: 400 }
      );
    }

    const hashedInputPin = await hashData(currentPin);
    const isValidPin = hashedInputPin === user.pin;
    if (!isValidPin) {
      return NextResponse.json(
        { error: "Current PIN is incorrect" },
        { status: 400 }
      );
    }

    // Hash and update new PIN
    const hashedPin = await hashData(newPin);

    await prisma.users.update({
      where: { id: session.userId },
      data: { pin: hashedPin },
    });

    return NextResponse.json({
      message: "PIN changed successfully",
    });
  } catch (error) {
    console.error("Error changing PIN:", error);
    return NextResponse.json(
      { error: "Failed to change PIN" },
      { status: 500 }
    );
  }
}
