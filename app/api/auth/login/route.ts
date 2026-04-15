import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { createSession } from "@/lib/session";
import { hashPhone } from "@/lib/hash-phone";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = "nodejs";

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    const { phone: rawPhone, pin }: { phone: string; pin: string } = await request.json();

    console.log("🔍 Login attempt:", { rawPhone, pinLength: pin?.length });

    // Basic validation
    if (!rawPhone || !pin || !/^\d{6}$/.test(pin)) {
      console.log("❌ Validation failed:", { hasPhone: !!rawPhone, hasPin: !!pin, pinValid: !/^\d{6}$/.test(pin) });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Validate and normalize phone using libphonenumber-js
    // Phone comes in as dial code + national number (e.g., "919789497050")
    let normalizedPhone: string;
    try {
      const phoneWithPlus = `+${rawPhone}`;

      if (!isValidPhoneNumber(phoneWithPlus)) {
        console.log("❌ Invalid phone number format");
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const parsedPhone = parsePhoneNumber(phoneWithPlus);
      if (!parsedPhone) {
        console.log("❌ Could not parse phone number");
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Get normalized phone number (E.164 format without +)
      normalizedPhone = parsedPhone.number.slice(1);
    } catch (error) {
      console.error("Phone parsing error:", error);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const hashedPhone = await hashPhone(normalizedPhone);
    console.log("🔐 Hashed phone:", hashedPhone);

    const user = await prisma.users.findFirst({
      where: {
        hashed_phone: hashedPhone,
      },
    });

    console.log("👤 User found:", !!user, user ? { id: user.id, hasPin: !!user.pin } : null);

    if (!user || !user.pin) {
      console.log("❌ No user found or no PIN set");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify PIN using SHA-256 hash comparison
    const hashedInputPin = await hashData(pin);
    const pinMatch = hashedInputPin === user.pin;

    console.log("🔑 PIN match:", pinMatch);
    console.log("   Input hash:", hashedInputPin);
    console.log("   Stored hash:", user.pin);

    if (!pinMatch) {
      console.log("❌ PIN mismatch");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Block login if user has an email that hasn't been verified yet
    if (user.email && !user.email_verified) {
      // Auto-issue a fresh OTP so they can verify immediately
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const otp = String(array[0] % 1_000_000).padStart(6, "0");
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(otp));
      const hashedOtp = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.users.update({
        where: { id: user.id },
        data: {
          email_verification_token: hashedOtp,
          email_verification_expires: expires,
        },
      });

      await sendVerificationEmail(user.email, user.name ?? "there", otp);

      console.log("📧 Email verification required for user:", user.id);
      return NextResponse.json(
        { needs_email_verification: true, userId: user.id, email: user.email },
        { status: 403 }
      );
    }

    // Update last login
    await prisma.users.update({
      where: { id: user.id },
      data: { updated_at: new Date() },
    });

    const token = await createSession(user.id);

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name } }, { status: 200 });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // Needed for OAuth flows: allows cookie on top-level cross-site redirects back to our app
      // (e.g. Google -> lofy-ai.com). `strict` would drop the cookie and middleware would redirect to /login.
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
