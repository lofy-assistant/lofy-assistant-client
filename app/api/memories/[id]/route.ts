import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { verifySession } from "@/lib/session";
import { decryptContent } from "@/lib/encryption";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const memoryId = parseInt(params.id);

    if (isNaN(memoryId)) {
      return NextResponse.json({ error: "Invalid memory ID" }, { status: 400 });
    }

    const memory = await prisma.memories.findFirst({
      where: {
        id: memoryId,
        user_id: session.userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
    });

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

    return NextResponse.json({ memory: decryptedMemory });
  } catch (error) {
    console.error("Error fetching memory:", error);
    return NextResponse.json({ error: "Failed to fetch memory" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const memoryId = parseInt(params.id);

    if (isNaN(memoryId)) {
      return NextResponse.json({ error: "Invalid memory ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Verify memory belongs to user
    const existingMemory = await prisma.memories.findFirst({
      where: {
        id: memoryId,
        user_id: session.userId,
      },
    });

    if (!existingMemory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const updatedMemory = await prisma.memories.update({
      where: { id: memoryId },
      data: {
        title: title || null,
        content,
      },
    });

    return NextResponse.json({
      memory: updatedMemory,
      message: "Memory updated successfully",
    });
  } catch (error) {
    console.error("Error updating memory:", error);
    return NextResponse.json({ error: "Failed to update memory" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const memoryId = parseInt(params.id);

    if (isNaN(memoryId)) {
      return NextResponse.json({ error: "Invalid memory ID" }, { status: 400 });
    }

    // Verify memory belongs to user
    const existingMemory = await prisma.memories.findFirst({
      where: {
        id: memoryId,
        user_id: session.userId,
      },
    });

    if (!existingMemory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    await prisma.memories.delete({
      where: { id: memoryId },
    });

    return NextResponse.json({
      message: "Memory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting memory:", error);
    return NextResponse.json({ error: "Failed to delete memory" }, { status: 500 });
  }
}
