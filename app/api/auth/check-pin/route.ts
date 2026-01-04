import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPhone } from "@/lib/hash-phone";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { phone }: { phone: string } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Normalize and hash phone
    const hashedPhone = await hashPhone(phone);

    // Check if user exists and has PIN set
    const user = await prisma.users.findFirst({
      where: { hashed_phone: hashedPhone },
      select: { pin: true },
    });

    const hasPin = !!(user && user.pin);

    return NextResponse.json({ hasPin }, { status: 200 });
  } catch (error) {
    console.error("Check PIN error:", error);
    return NextResponse.json({ error: "Failed to check PIN status" }, { status: 500 });
  }
}
