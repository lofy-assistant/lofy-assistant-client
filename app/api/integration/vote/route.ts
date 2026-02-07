import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prisma } from '@/lib/database';

const MAX_VOTES_PER_USER = 3;

// GET: Fetch vote counts and user's voted integrations
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all vote counts
    const voteCounts = await prisma.upvote_counts.findMany();

    // Get user's votes
    const userVotes = await prisma.upvotes.findMany({
      where: { user_id: session.userId },
      select: { integration_id: true },
    });

    const counts: Record<string, number> = {};
    for (const vc of voteCounts) {
      counts[vc.integration_id] = vc.count;
    }

    return NextResponse.json({
      counts,
      userVotes: userVotes.map((v) => v.integration_id),
      remainingVotes: MAX_VOTES_PER_USER - userVotes.length,
    });
  } catch (error) {
    console.error("Vote GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Vote or unvote for an integration
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { integrationId } = body;

    if (!integrationId || typeof integrationId !== "string") {
      return NextResponse.json({ error: "Invalid integration ID" }, { status: 400 });
    }

    // Check if user already voted for this integration
    const existingVote = await prisma.upvotes.findUnique({
      where: {
        user_id_integration_id: {
          user_id: session.userId,
          integration_id: integrationId,
        },
      },
    });

    if (existingVote) {
      // Unvote: Remove vote and decrement count
      await prisma.$transaction([
        prisma.upvotes.delete({
          where: { id: existingVote.id },
        }),
        prisma.upvote_counts.upsert({
          where: { integration_id: integrationId },
          create: { integration_id: integrationId, count: 0 },
          update: { count: { decrement: 1 } },
        }),
      ]);

      // Get updated count
      const updatedCount = await prisma.upvote_counts.findUnique({
        where: { integration_id: integrationId },
      });

      const userVotesCount = await prisma.upvotes.count({
        where: { user_id: session.userId },
      });

      return NextResponse.json({
        voted: false,
        count: Math.max(0, updatedCount?.count || 0),
        remainingVotes: MAX_VOTES_PER_USER - userVotesCount,
      });
    } else {
      // Vote: Check limit first
      const userVotesCount = await prisma.upvotes.count({
        where: { user_id: session.userId },
      });

      if (userVotesCount >= MAX_VOTES_PER_USER) {
        return NextResponse.json(
          { error: `You can only vote for ${MAX_VOTES_PER_USER} integrations` },
          { status: 400 }
        );
      }

      // Add vote and increment count
      await prisma.$transaction([
        prisma.upvotes.create({
          data: {
            user_id: session.userId,
            integration_id: integrationId,
          },
        }),
        prisma.upvote_counts.upsert({
          where: { integration_id: integrationId },
          create: { integration_id: integrationId, count: 1 },
          update: { count: { increment: 1 } },
        }),
      ]);

      // Get updated count
      const updatedCount = await prisma.upvote_counts.findUnique({
        where: { integration_id: integrationId },
      });

      return NextResponse.json({
        voted: true,
        count: updatedCount?.count || 1,
        remainingVotes: MAX_VOTES_PER_USER - userVotesCount - 1,
      });
    }
  } catch (error) {
    console.error("Vote POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
