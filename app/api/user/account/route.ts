import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { connectMongo } from '@/lib/database';
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import User from '@/lib/models/User';

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - missing session token" },
        { status: 401 }
      );
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Unauthorized - invalid session" },
        { status: 401 }
      );
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      const userUpdate = await tx.users.updateMany({
        where: {
          id: session.userId,
          deleted_at: null,
        },
        data: {
          deleted_at: now,
        },
      });

      if (userUpdate.count === 0) {
        throw new Error("USER_ALREADY_DELETED");
      }

      const credentialIds = await tx.integration_credentials.findMany({
        where: {
          user_id: session.userId,
          deleted_at: null,
        },
        select: {
          id: true,
        },
      });

      if (credentialIds.length > 0) {
        await tx.integrations.updateMany({
          where: {
            credential_id: {
              in: credentialIds.map((credential) => credential.id),
            },
            deleted_at: null,
          },
          data: {
            is_active: false,
            deleted_at: now,
          },
        });

        await tx.integration_credentials.updateMany({
          where: {
            user_id: session.userId,
            deleted_at: null,
          },
          data: {
            credentials: {},
            deleted_at: now,
          },
        });
      }
    });

    await connectMongo();
    await User.updateOne(
      { user_id: session.userId, deleted_at: null },
      { $set: { deleted_at: now } }
    );

    // Clear session cookie
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return NextResponse.json({
      message: "Account scheduled for deletion successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_ALREADY_DELETED") {
      return NextResponse.json(
        { error: "Account has already been deleted" },
        { status: 404 }
      );
    }

    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
