import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
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

async function encryptPhone(phone: string): Promise<string> {
  const normalizedPhone = phone.replace(/\D/g, "");
  
  // Get encryption key from environment variable
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }
  
  // Derive a 32-byte key from the encryption key
  const key = crypto.createHash("sha256").update(encryptionKey).digest();
  
  // Generate a random 12-byte IV for GCM mode
  const iv = crypto.randomBytes(12);
  
  // Create cipher using AES-256-GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  
  // Encrypt the phone number
  let encrypted = cipher.update(normalizedPhone, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  // Get the authentication tag
  const authTag = cipher.getAuthTag();
  
  // Combine IV + authTag + encrypted data, all in hex format
  // Format: iv(24 chars):authTag(32 chars):encrypted
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      phone,
      phoneNumber,
      pin,
      name,
      email,
      question1,
      question2,
      question3,
    }: {
      phone?: string;
      phoneNumber?: string;
      pin?: string;
      name?: string;
      email?: string;
      question1?: string;
      question2?: string;
      question3?: string;
    } = body;

    // Handle both 'phone' and 'phoneNumber' fields
    const phoneValue = phone || phoneNumber;

    if (!phoneValue || !pin || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate and parse phone number using libphonenumber-js
    // Phone comes in as dial code + national number (e.g., "919789497050")
    let normalizedPhone: string;
    try {
      const phoneWithPlus = `+${phoneValue}`;

      if (!isValidPhoneNumber(phoneWithPlus)) {
        return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
      }

      const parsedPhone = parsePhoneNumber(phoneWithPlus);
      if (!parsedPhone) {
        return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
      }

      // Get the E.164 format without the + and store as normalized phone
      normalizedPhone = parsedPhone.number.slice(1);
    } catch (error) {
      console.error("Phone parsing error:", error);
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    // Validate PIN - must be exactly 6 digits
    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be exactly 6 digits" }, { status: 400 });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }
    }

    const hashedPhone = await hashPhone(normalizedPhone);
    const encryptedPhone = await encryptPhone(normalizedPhone);

    // Check for existing user by hashed_phone
    const existingUser = await prisma.users.findFirst({
      where: { hashed_phone: hashedPhone },
    });

    // Hash PIN using SHA-256
    const hashedPin = await hashData(pin);

    // Prepare metadata with onboarding answers if provided
    const metadata =
      question1 || question2 || question3
        ? {
            onboarding: {
              question1: question1 || "",
              question2: question2 || "",
              question3: question3 || "",
              completedAt: new Date().toISOString(),
            },
          }
        : null;

    if (existingUser) {
      // Check if email is being changed and if it's already taken by another user
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.users.findUnique({
          where: { email: email },
        });
        if (emailExists && emailExists.id !== existingUser.id) {
          return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
      }

      // User exists (partial registration from FastAPI) - update to complete profile
      const updateData = {
        name,
        pin: hashedPin,
        encrypted_phone: encryptedPhone,
        email: email || existingUser.email,
        ...(metadata && { metadata }),
      };

      const updatedUser = await prisma.users.update({
        where: { id: existingUser.id },
        data: updateData,
      });

      return NextResponse.json({ success: true, message: "Profile completed successfully", userId: updatedUser.id, isNewUser: false }, { status: 200 });
    } else {
      // Check if email already exists
      if (email) {
        const emailExists = await prisma.users.findUnique({
          where: { email: email },
        });
        if (emailExists) {
          return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
      }

      // User doesn't exist - create new user
      const user = await prisma.users.create({
        data: {
          id: randomUUID(),
          name,
          hashed_phone: hashedPhone,
          encrypted_phone: encryptedPhone,
          pin: hashedPin,
          email: email || null,
          role: 1,
          ...(metadata && { metadata }),
        },
      });

      return NextResponse.json({ success: true, message: "User registered successfully", userId: user.id, isNewUser: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
