import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Creator from "@/lib/db/models/Creator";
import { getUnlockedBadges, getNextBadges } from "@/lib/creator/badges";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const creator = await Creator.findOne({ userId }).lean();
    if (!creator)
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });

    // Basic stats for badge calculations
    const stats = {
      userId,
      totalPosts:
        (await Creator.findOne({ userId }).then((c) => c?.totalPosts || 0)) ||
        0,
      followers: creator.followers || 0,
      totalViews: creator.totalViews || 0,
      avgEngagementRate: creator.engagementRate || 0,
      currentStreak: (creator as any).currentStreak || 0,
      bestPost: { views: 0, engagement: 0 },
      predictionStats: {
        totalPredictions: 0,
        correctPredictions: 0,
        accuracy: 0,
      },
      reputation: creator.reputationScore || 50,
      violations: creator.strikes || 0,
    } as any;

    const earned = getUnlockedBadges(stats);
    const next = getNextBadges(stats, 5);

    // Sort earned by rarity (legendary -> common)
    earned.sort((a, b) => {
      const order = { legendary: 0, epic: 1, rare: 2, common: 3 } as any;
      return order[a.rarity] - order[b.rarity];
    });

    return NextResponse.json({ earned, next }, { status: 200 });
  } catch (error) {
    console.error("badges GET error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
