import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/database';
import { verifySession } from "@/lib/session";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { tag, title, description } = body;

    if (!tag || !description) {
      return NextResponse.json(
        { error: "Tag and description are required" },
        { status: 400 }
      );
    }

    // Validate tag values
    const validTags = ["bug", "suggestion", "general"];
    if (!validTags.includes(tag)) {
      return NextResponse.json(
        { error: "Invalid tag value" },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedbacks.create({
      data: {
        user_id: session.userId,
        tag,
        title: title || "",
        description,
      },
    });

    return NextResponse.json({
      feedback,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
