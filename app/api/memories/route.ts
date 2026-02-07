import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { verifySession } from "@/lib/session";
import { decryptContent } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    // Build search filter
    const searchFilter = search
      ? {
          OR: [{ title: { contains: search, mode: "insensitive" as const } }, { content: { contains: search, mode: "insensitive" as const } }],
        }
      : {};

    const memories = await prisma.memories.findMany({
      where: {
        user_id: session.userId,
        ...searchFilter,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Decrypt the encrypted fields for each memory
    // Handle decryption errors gracefully - some memories might have invalid encrypted data
    const decryptedMemories = memories.map((memory: { id: number; title: string | null; content: string; created_at: Date; updated_at: Date }) => {
      try {
        return {
          ...memory,
          title: memory.title ? decryptContent(memory.title) : null,
          content: decryptContent(memory.content),
        };
      } catch (error) {
        // If decryption fails for a specific memory, log it but continue with other memories
        console.error(`Failed to decrypt memory ${memory.id}:`, error);
        // Return the memory as-is (might already be decrypted or corrupted)
        return {
          ...memory,
          title: memory.title,
          content: memory.content,
        };
      }
    });

    return NextResponse.json({
      memories: decryptedMemories,
      count: decryptedMemories.length,
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return NextResponse.json({ error: "Failed to fetch memories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - missing session token" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const memory = await prisma.memories.create({
      data: {
        user_id: session.userId,
        title: title || null,
        content,
      },
    });

    return NextResponse.json({
      memory,
      message: "Memory created successfully",
    });
  } catch (error) {
    console.error("Error creating memory:", error);
    return NextResponse.json({ error: "Failed to create memory" }, { status: 500 });
  }
}
