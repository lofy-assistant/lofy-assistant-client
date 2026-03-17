import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { sendVerificationEmail } from "@/lib/email";
import { authRateLimiter, checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function generateOtp(): Promise<string> {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(array[0] % 1_000_000).padStart(6, "0");
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimit = await checkRateLimit(authRateLimiter, `resend-verification:${ip}`);
  if (rateLimit.limited) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user || !user.email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.email_verified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    const otp = await generateOtp();
    const hashedOtp = await hashData(otp);
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.users.update({
      where: { id: userId },
      data: {
        email_verification_token: hashedOtp,
        email_verification_expires: expires,
      },
    });

    await sendVerificationEmail(user.email, user.name ?? "there", otp);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Failed to resend verification code" }, { status: 500 });
  }
}
