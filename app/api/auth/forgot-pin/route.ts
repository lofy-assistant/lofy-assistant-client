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
    const { phone, phoneNumber } = body;

    // Handle both 'phone' and 'phoneNumber' fields
    const phoneValue = phone || phoneNumber;

    if (!phoneValue) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Hash the phone to check if user exists
    const hashedPhone = await hashPhone(phoneValue);

    // Find user by hashed phone
    const user = await prisma.users.findFirst({
      where: { hashed_phone: hashedPhone },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { success: true, message: "If this account exists, a reset link has been sent" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = await hashData(`${phoneValue}-${user.id}-reset`);
    const resetLink = `https://lofy-ai.com/reset-pin?token=${resetToken}&phone=${phoneValue}`;

    // Send reset link via WhatsApp
    const message = `Here's your PIN reset link: ${resetLink}\n\nThis link will expire in 15 minutes.`;
    
    try {
      const whatsappResponse = await fetch(
        `${process.env.FASTAPI_URL}/whatsapp/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            phone_number: phoneValue,
          }),
        }
      );

      if (!whatsappResponse.ok) {
        throw new Error("Failed to send WhatsApp message");
      }
    } catch (whatsappError) {
      console.error("WhatsApp sending error:", whatsappError);
      return NextResponse.json(
        { error: "Failed to send reset link" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Reset link sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot PIN error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
