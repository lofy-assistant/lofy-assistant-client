import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { hashPhone } from "@/lib/hash-phone";
import { sendVerificationEmail } from "@/lib/email";
import { authRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

export const runtime = "nodejs";

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimit = await checkRateLimit(authRateLimiter, `change-email:${ip}`);
  if (rateLimit.limited) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const { phone: rawPhone, email } = await request.json();

    if (!rawPhone || !email || typeof email !== "string") {
      return NextResponse.json({ error: "Phone and email are required." }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Validate and normalize phone
    let normalizedPhone: string;
    try {
      const phoneWithPlus = `+${rawPhone}`;
      if (!isValidPhoneNumber(phoneWithPlus)) {
        return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
      }
      const parsedPhone = parsePhoneNumber(phoneWithPlus);
      if (!parsedPhone) {
        return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
      }
      normalizedPhone = parsedPhone.number.slice(1);
    } catch {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }

    const hashedPhone = await hashPhone(normalizedPhone);
    const user = await prisma.users.findFirst({ where: { hashed_phone: hashedPhone } });

    if (!user) {
      // Return generic message to avoid phone enumeration
      return NextResponse.json({ error: "No account found with that phone number." }, { status: 404 });
    }

    // Check the new email isn't already taken by another user
    const emailTaken = await prisma.users.findFirst({
      where: { email: email.toLowerCase(), NOT: { id: user.id } },
    });
    if (emailTaken) {
      return NextResponse.json({ error: "That email is already associated with another account." }, { status: 409 });
    }

    // Generate OTP
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const otp = String(array[0] % 1_000_000).padStart(6, "0");
    const hashedOtp = await hashData(otp);
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        email: email.toLowerCase(),
        email_verified: false,
        email_verification_token: hashedOtp,
        email_verification_expires: expires,
      },
    });

    await sendVerificationEmail(email.toLowerCase(), user.name ?? "there", otp);

    return NextResponse.json({ userId: user.id, email: email.toLowerCase() }, { status: 200 });
  } catch (error) {
    console.error("Change email error:", error);
    return NextResponse.json({ error: "Failed to change email." }, { status: 500 });
  }
}
