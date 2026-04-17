import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { verifySession } from "@/lib/session";
import { decryptContent } from "@/lib/encryption";

function serializeShareId(shareId: bigint) {
  return shareId.toString();
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const memoryId = parseInt(id);

    if (isNaN(memoryId)) {
      return NextResponse.json({ error: "Invalid memory ID" }, { status: 400 });
    }

    const ownedMemory = await prisma.memories.findFirst({
      where: {
        id: memoryId,
        user_id: session.userId,
        deleted_at: null,
      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
    });

    const sharedMemory = ownedMemory
      ? null
      : await prisma.memories_share.findFirst({
          where: {
            memory_id: memoryId,
            user_id: session.userId,
            memory: {
              deleted_at: null,
            },
          },
          select: {
            id: true,
            comment: true,
            created_at: true,
            user: { select: { id: true, name: true } },
            memory: {
              select: {
                id: true,
                title: true,
                content: true,
                created_at: true,
                updated_at: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

    const memory = ownedMemory ?? sharedMemory?.memory;

    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    // Decrypt the encrypted fields
    // Handle decryption errors gracefully
    let decryptedMemory;
    try {
      decryptedMemory = {
        ...memory,
        title: memory.title ? decryptContent(memory.title) : null,
        content: decryptContent(memory.content),
      };
    } catch (error) {
      // If decryption fails, log it but return the memory as-is
      console.error(`Failed to decrypt memory ${memory.id}:`, error);
      decryptedMemory = {
        ...memory,
        title: memory.title,
        content: memory.content,
      };
    }

    return NextResponse.json({
      memory: decryptedMemory,
      access: ownedMemory
        ? {
            isOwner: true,
            accessLevel: "owner",
          }
        : {
            isOwner: false,
            accessLevel: "shared",
          shareId: sharedMemory ? serializeShareId(sharedMemory.id) : undefined,
            sharedAt: sharedMemory?.created_at,
            owner: sharedMemory?.memory.user,
            comment: sharedMemory?.comment,
            sharedUser: sharedMemory?.user,
          },
    });
  } catch (error) {
    console.error("Error fetching memory:", error);
    return NextResponse.json({ error: "Failed to fetch memory" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const memoryId = parseInt(id);

    if (isNaN(memoryId)) {
      return NextResponse.json({ error: "Invalid memory ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, comment } = body;

    const existingMemory = await prisma.memories.findFirst({
      where: {
        id: memoryId,
        user_id: session.userId,
        deleted_at: null,
      },
    });

    if (existingMemory) {
      if (!content) {
        return NextResponse.json({ error: "Content is required" }, { status: 400 });
      }

      const updateResult = await prisma.memories.updateMany({
        where: {
          id: memoryId,
          user_id: session.userId,
          deleted_at: null,
        },
        data: {
          title: title || null,
          content,
        },
      });

      if (updateResult.count === 0) {
        return NextResponse.json({ error: "Memory not found" }, { status: 404 });
      }

      const updatedMemory = await prisma.memories.findFirst({
        where: {
          id: memoryId,
          user_id: session.userId,
          deleted_at: null,
        },
      });

      if (!updatedMemory) {
        return NextResponse.json({ error: "Memory not found" }, { status: 404 });
      }

      return NextResponse.json({
        memory: updatedMemory,
        message: "Memory updated successfully",
      });
    }

    const existingShare = await prisma.memories_share.findFirst({
      where: {
        memory_id: memoryId,
        user_id: session.userId,
        memory: {
          deleted_at: null,
        },
      },
    });

    if (!existingShare) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    if (typeof comment !== "string") {
      return NextResponse.json({ error: "Comment is required" }, { status: 400 });
    }

    const updatedShare = await prisma.memories_share.update({
      where: {
        id: existingShare.id,
      },
      data: {
        comment,
      },
      select: {
        id: true,
        comment: true,
        updated_at: true,
      },
    });

    return NextResponse.json({
      share: {
        ...updatedShare,
        id: serializeShareId(updatedShare.id),
      },
      message: "Memory comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating memory:", error);
    return NextResponse.json({ error: "Failed to update memory" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const memoryId = parseInt(id);

    if (isNaN(memoryId)) {
      return NextResponse.json({ error: "Invalid memory ID" }, { status: 400 });
    }

    // Verify memory belongs to user
    const existingMemory = await prisma.memories.findFirst({
      where: {
        id: memoryId,
        user_id: session.userId,
        deleted_at: null,
      },
    });

    if (!existingMemory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const deleteResult = await prisma.memories.updateMany({
      where: {
        id: memoryId,
        user_id: session.userId,
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Memory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting memory:", error);
    return NextResponse.json({ error: "Failed to delete memory" }, { status: 500 });
  }
}
