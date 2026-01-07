import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs";

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPhone(phone: string): Promise<string> {
  const normalizedPhone = phone.replace(/\D/g, "");
  return hashData(normalizedPhone);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, phone, newPin } = body;

    if (!token || !phone || !newPin) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate PIN - must be exactly 6 digits
    if (!/^\d{6}$/.test(newPin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 6 digits" },
        { status: 400 }
      );
    }

    // Hash the phone to find the user
    const hashedPhone = await hashPhone(phone);

    // Find user by hashed phone
    const user = await prisma.users.findFirst({
      where: { hashed_phone: hashedPhone },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the token
    // In a production environment, you would:
    // 1. Store reset tokens in database with expiration time
    // 2. Validate token hasn't expired (e.g., 15 minutes)
    // 3. Invalidate token after use
    // For now, we'll use a simple hash-based verification
    const expectedToken = await hashData(`${phone}-${user.id}-reset`);
    
    if (token !== expectedToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 401 }
      );
    }

    // Hash the new PIN
    const hashedPin = await hashData(newPin);

    // Update user's PIN
    await prisma.users.update({
      where: { id: user.id },
      data: { pin: hashedPin },
    });

    return NextResponse.json(
      { success: true, message: "PIN reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset PIN error:", error);
    return NextResponse.json(
      { error: "Failed to reset PIN" },
      { status: 500 }
    );
  }
}
