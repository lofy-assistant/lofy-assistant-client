import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { createSession } from "@/lib/session";
import { authRateLimiter, checkRateLimit } from "@/lib/rate-limit";

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
  const rateLimit = await checkRateLimit(authRateLimiter, `verify-email:${ip}`);
  if (rateLimit.limited) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const { userId, code } = await request.json();

    if (!userId || !code || typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.email_verified) {
      // Already verified: just create a session and let them in
      const response = NextResponse.json({ success: true }, { status: 200 });
      const token = await createSession(user.id);
      response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      return response;
    }

    if (!user.email_verification_token || !user.email_verification_expires) {
      return NextResponse.json({ error: "No verification code found. Please request a new one." }, { status: 400 });
    }

    if (new Date() > user.email_verification_expires) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    const hashedInput = await hashData(code);
    if (hashedInput !== user.email_verification_token) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    // Mark email as verified and clear the token
    await prisma.users.update({
      where: { id: userId },
      data: {
        email_verified: true,
        email_verification_token: null,
        email_verification_expires: null,
      },
    });

    const response = NextResponse.json({ success: true }, { status: 200 });
    const token = await createSession(user.id);
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
