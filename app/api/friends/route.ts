import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/database";
import { decryptContent } from "@/lib/encryption";
import { getRequestUserId } from "@/lib/session";

type CoreCreateFriendResponse = {
  invitation_id: string;
  status: string;
  already_exists: boolean;
  message_sent: boolean;
  warning?: string;
};

/** Core: `WebController` → `@Controller('web')` + `@Post('friends/requests')` → `POST /web/friends/requests?user_id=` */
function coreCreateFriendRequestUrl(coreBaseUrl: string, userId: string): string {
  const root = coreBaseUrl.trim().replace(/\/+$/, "");
  const url = new URL("web/friends/requests", `${root}/`);
  url.searchParams.set("user_id", userId);
  return url.href;
}

function getErrorMessage(data: unknown, status: number): string {
  if (typeof data === "object" && data !== null) {
    if ("detail" in data) return String((data as { detail: unknown }).detail);
    if ("message" in data) {
      const m = (data as { message: unknown }).message;
      return Array.isArray(m) ? m.join(", ") : String(m);
    }
    if ("error" in data) return String((data as { error: unknown }).error);
  }
  return `Failed to create friend request (${status})`;
}

function getMaskedLast4(encryptedPhone: string): string {
  const decryptedPhone = decryptContent(encryptedPhone);
  const digits = decryptedPhone.replace(/\D/g, "");
  return digits.slice(-4);
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getRequestUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const now = new Date();

    const [friendships, pendingInvitations] = await Promise.all([
      prisma.friendships.findMany({
        where: {
          OR: [{ user_low_id: userId }, { user_high_id: userId }],
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

    const otherUserIds = Array.from(
      new Set(
        friendships.map((friendship) => (friendship.user_low_id === userId ? friendship.user_high_id : friendship.user_low_id)),
      ),
    );

    const otherUsers = otherUserIds.length
      ? await prisma.users.findMany({
          where: {
            id: {
              in: otherUserIds,
            },
          },
          select: {
            id: true,
            name: true,
          },
        })
      : [];

    const usersById = new Map(otherUsers.map((user) => [user.id, user]));

    const friends = friendships.map((friendship) => {
      const otherUserId = friendship.user_low_id === userId ? friendship.user_high_id : friendship.user_low_id;
      const otherUser = usersById.get(otherUserId);

      return {
        id: otherUserId,
        name: otherUser?.name ?? null,
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
    const userId = await getRequestUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const coreApiUrl = process.env.CORE_API_URL;
    if (!coreApiUrl) {
      return NextResponse.json({ error: "CORE_API_URL environment variable is not set" }, { status: 500 });
    }

    const body = (await request.json()) as { phone_number?: string };
    const phoneNumber = body.phone_number?.trim();

    if (!phoneNumber) {
      return NextResponse.json({ error: "phone_number is required" }, { status: 400 });
    }

    const response = await fetch(coreCreateFriendRequestUrl(coreApiUrl, userId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });

    const raw = await response.text();
    let data: unknown = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw;
    }

    if (!response.ok) {
      const errorMessage = getErrorMessage(data, response.status);
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