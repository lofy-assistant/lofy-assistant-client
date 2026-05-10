import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { getRequestSession, getRequestSessionToken } from "@/lib/session";
import { normalizePersonaFromRequest } from "@/lib/persona";

const CUSTOM_INSTRUCTION_MAX_LENGTH = 1000;

function isValidIanaTimeZone(value: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

async function invalidatePersonalityCache(userId: string) {
  const baseUrl = process.env.FASTAPI_URL;
  if (!baseUrl) {
    console.warn("[invalidatePersonalityCache] Skipped: FASTAPI_URL not configured");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/web/cache/invalidate-personality`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    if (response.ok) {
      console.log("[invalidatePersonalityCache] Success: personality cache invalidated for user", userId);
    } else {
      console.error("[invalidatePersonalityCache] Failed:", response.status, response.statusText, "for user", userId);
    }
  } catch (err) {
    console.error("[invalidatePersonalityCache] Error:", err);
  }
}

async function syncCustomInstructionCache(userId: string, customInstruction: string | null | undefined) {
  const baseUrl = process.env.FASTAPI_URL;
  if (!baseUrl) {
    console.warn("[syncCustomInstructionCache] Skipped: FASTAPI_URL not configured");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/web/cache/sync-custom-instruction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        custom_instruction: customInstruction,
      }),
    });

    if (response.ok) {
      console.log("[syncCustomInstructionCache] Success: custom instruction synced for user", userId);
    } else {
      console.error("[syncCustomInstructionCache] Failed:", response.status, response.statusText, "for user", userId);
    }
  } catch (err) {
    console.error("[syncCustomInstructionCache] Error:", err);
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!getRequestSessionToken(request)) {
      return NextResponse.json(
        { error: "Unauthorized - missing session token" },
        { status: 401 }
      );
    }

    const session = await getRequestSession(request);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Unauthorized - invalid session" },
        { status: 401 }
      );
    }

    const user = await prisma.users.findFirst({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        ai_persona: true,
        custom_instruction: true,
        timezone: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!getRequestSessionToken(request)) {
      return NextResponse.json(
        { error: "Unauthorized - missing session token" },
        { status: 401 }
      );
    }

    const session = await getRequestSession(request);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Unauthorized - invalid session" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, type, customInstruction, timezone } = body;

    const updateData: {
      name?: string | null;
      ai_persona?: string | null;
      custom_instruction?: string | null;
      timezone?: string | null;
    } = {};

    if (name !== undefined) {
      updateData.name = name || null;
    }

    if (type !== undefined) {
      const persona = normalizePersonaFromRequest(type);
      if (persona) {
        updateData.ai_persona = persona;
      } else {
        return NextResponse.json(
          { error: "Invalid type. Must be 'atlas', 'brad', 'lexi', or 'rocco'" },
          { status: 400 }
        );
      }
    }

    if (customInstruction !== undefined) {
      if (customInstruction !== null && typeof customInstruction !== "string") {
        return NextResponse.json(
          { error: "customInstruction must be a string or null" },
          { status: 400 }
        );
      }

      const trimmedInstruction = customInstruction?.trim() ?? "";
      if (trimmedInstruction.length > CUSTOM_INSTRUCTION_MAX_LENGTH) {
        return NextResponse.json(
          {
            error: `Custom instruction must be ${CUSTOM_INSTRUCTION_MAX_LENGTH} characters or fewer`,
          },
          { status: 400 }
        );
      }

      updateData.custom_instruction = trimmedInstruction || null;
    }

    if (timezone !== undefined) {
      if (timezone !== null && typeof timezone !== "string") {
        return NextResponse.json(
          { error: "timezone must be a valid IANA timezone string or null" },
          { status: 400 }
        );
      }

      const trimmedTimezone = timezone?.trim() ?? "";
      if (trimmedTimezone && !isValidIanaTimeZone(trimmedTimezone)) {
        return NextResponse.json(
          { error: "Enter a valid IANA timezone, such as Asia/Kuala_Lumpur." },
          { status: 400 }
        );
      }

      updateData.timezone = trimmedTimezone || null;
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        id: session.userId,
      },
      select: { id: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.users.update({
      where: { id: session.userId },
      data: updateData,
    });

    const updatedUser = await prisma.users.findFirst({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        ai_persona: true,
        custom_instruction: true,
        timezone: true,
      },
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Invalidate personality cache when ai_persona was updated
    if (updateData.ai_persona !== undefined) {
      await invalidatePersonalityCache(session.userId);
    }

    if (updateData.custom_instruction !== undefined) {
      await syncCustomInstructionCache(session.userId, updatedUser.custom_instruction);
    }

    return NextResponse.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
