import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
    const decryptedMemories = memories.map((memory: { id: number; title: string | null; content: string; created_at: Date; updated_at: Date }) => ({
      ...memory,
      // Not sure if the title needs to be decrypted or not
      title: memory.title ? decryptContent(memory.title) : null,
      content: decryptContent(memory.content),
    }));

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
