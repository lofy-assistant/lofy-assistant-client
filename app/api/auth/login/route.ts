import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { createSession } from "@/lib/session";
import { hashPhone } from "@/lib/hash-phone";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_VERIFICATION_LAUNCHED_AT = new Date("2026-03-17T11:31:34.000Z");

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateOtp(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(array[0] % 1_000_000).padStart(6, "0");
}

async function issueVerificationOtp(user: {
  id: string;
  email: string;
  name: string | null;
}): Promise<void> {
  const otp = generateOtp();
  const hashedOtp = await hashData(otp);
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.users.update({
    where: { id: user.id },
    data: {
      email_verification_token: hashedOtp,
      email_verification_expires: expires,
    },
  });

  await sendVerificationEmail(user.email, user.name ?? "there", otp);
}

export async function POST(request: NextRequest) {
  try {
    const { phone: rawPhone, pin }: { phone: string; pin: string } = await request.json();

    if (!rawPhone || !pin || !/^\d{6}$/.test(pin)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    let normalizedPhone: string;
    try {
      const phoneWithPlus = `+${rawPhone}`;

      if (!isValidPhoneNumber(phoneWithPlus)) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const parsedPhone = parsePhoneNumber(phoneWithPlus);
      if (!parsedPhone) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      normalizedPhone = parsedPhone.number.slice(1);
    } catch (error) {
      console.error("Phone parsing error:", error);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const hashedPhone = await hashPhone(normalizedPhone);

    const user = await prisma.users.findFirst({
      where: {
        hashed_phone: hashedPhone,
      },
    });

    if (!user?.pin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const hashedInputPin = await hashData(pin);
    if (hashedInputPin !== user.pin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.email && !user.email_verified) {
      const isLegacyAccount = user.created_at < EMAIL_VERIFICATION_LAUNCHED_AT;

      if (!isLegacyAccount) {
        await issueVerificationOtp({
          id: user.id,
          email: user.email,
          name: user.name,
        });

        return NextResponse.json(
          { needs_email_verification: true, userId: user.id, email: user.email },
          { status: 403 },
        );
      }

      // Legacy accounts predate email verification. Once a user proves account
      // ownership with phone + PIN, backfill verification instead of locking
      // them out behind a new OTP flow they did not start.
      await prisma.users.update({
        where: { id: user.id },
        data: {
          email_verified: true,
          updated_at: new Date(),
        },
      });
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { updated_at: new Date() },
    });

    const token = await createSession(user.id);

    const response = NextResponse.json(
      { success: true, user: { id: user.id, name: user.name } },
      { status: 200 },
    );

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // Needed for OAuth flows: allows cookie on top-level cross-site redirects back to our app.
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
