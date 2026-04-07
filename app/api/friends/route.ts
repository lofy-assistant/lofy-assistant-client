import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/database";
import { decryptContent } from "@/lib/encryption";
import { verifySession } from "@/lib/session";

type CoreCreateFriendResponse = {
  invitation_id: string;
  status: string;
  already_exists: boolean;
  message_sent: boolean;
};

function getMaskedLast4(encryptedPhone: string): string {
  const decryptedPhone = decryptContent(encryptedPhone);
  const digits = decryptedPhone.replace(/\D/g, "");
  return digits.slice(-4);
}

async function getSessionUserId(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return null;
  }

  const session = await verifySession(token);
  return session?.userId ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const now = new Date();

    const [friendships, pendingInvitations] = await Promise.all([
      prisma.friendships.findMany({
        where: {
          OR: [{ user_low_id: userId }, { user_high_id: userId }],
        },
        include: {
          user_low: {
            select: {
              id: true,
              name: true,
            },
          },
          user_high: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.friend_invitations.findMany({
        where: {
          inviter_user_id: userId,
          status: "pending",
          expires_at: {
            gt: now,
          },
        },
        orderBy: {
          created_at: "desc",
        },
      }),
    ]);

    const friends = friendships.map((friendship) => {
      const otherUser = friendship.user_low_id === userId ? friendship.user_high : friendship.user_low;

      return {
        id: otherUser.id,
        name: otherUser.name,
        friendsSince: (friendship.created_at ?? now).toISOString(),
      };
    });

    const pendingInvites = pendingInvitations.map((invitation) => ({
      id: invitation.id,
      last4: getMaskedLast4(invitation.invitee_encrypted_phone),
      createdAt: (invitation.created_at ?? now).toISOString(),
      expiresAt: invitation.expires_at.toISOString(),
      inviteeUserId: invitation.invitee_user_id,
    }));

    return NextResponse.json(
      {
        friends,
        pendingInvites,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Friends GET API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const fastApiUrl = process.env.FASTAPI_URL;
    if (!fastApiUrl) {
      return NextResponse.json({ error: "FASTAPI_URL environment variable is not set" }, { status: 500 });
    }

    const body = (await request.json()) as { phone_number?: string };
    const phoneNumber = body.phone_number?.trim();

    if (!phoneNumber) {
      return NextResponse.json({ error: "phone_number is required" }, { status: 400 });
    }

    const response = await fetch(
      `${fastApiUrl}/web/friends/requests?user_id=${encodeURIComponent(userId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      },
    );

    const raw = await response.text();
    let data: unknown = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw;
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === "object" && data !== null && "detail" in data
          ? String((data as { detail: unknown }).detail)
          : typeof data === "object" && data !== null && "error" in data
            ? String((data as { error: unknown }).error)
            : `Failed to create friend request (${response.status})`;

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    return NextResponse.json(data as CoreCreateFriendResponse, { status: 200 });
  } catch (error) {
    console.error("Friends POST API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}