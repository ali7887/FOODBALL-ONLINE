import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import Creator from "@/lib/db/models/Creator";
import {
  getBadgeById,
  getUnlockedBadges,
  getBadgeReward,
} from "@/lib/creator/badges";
import CreditTransaction from "@/lib/db/models/CreditTransaction";

const claimSchema = z.object({ badgeId: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const body = await request.json();
    const { badgeId } = claimSchema.parse(body);

    const badge = getBadgeById(badgeId);
    if (!badge)
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });

    // Check user's unlocked badges via criteria
    const stats = {
      userId,
      totalPosts:
        (await Creator.findOne({ userId }).then((c) => c?.totalPosts || 0)) ||
        0,
      followers:
        (await Creator.findOne({ userId }).then((c) => c?.followers || 0)) || 0,
      totalViews:
        (await Creator.findOne({ userId }).then((c) => c?.totalViews || 0)) ||
        0,
      avgEngagementRate: 0,
      currentStreak:
        (await Creator.findOne({ userId }).then(
          (c) => c?.currentStreak || 0
        )) || 0,
      bestPost: { views: 0, engagement: 0 },
      predictionStats: {
        totalPredictions: 0,
        correctPredictions: 0,
        accuracy: 0,
      },
      reputation:
        (await Creator.findOne({ userId }).then(
          (c) => c?.reputationScore || 50
        )) || 50,
      violations:
        (await Creator.findOne({ userId }).then((c) => c?.strikes || 0)) || 0,
    } as any;

    const unlocked = getUnlockedBadges(stats).map((b) => b._id);
    if (!unlocked.includes(badgeId)) {
      return NextResponse.json(
        { error: "Criteria not met for this badge" },
        { status: 400 }
      );
    }

    const creator = await Creator.findOne({ userId });
    if (!creator)
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });

    if (creator.badges.includes(badgeId))
      return NextResponse.json(
        { error: "Badge already claimed" },
        { status: 400 }
      );

    // Award badge and reward
    creator.badges.push(badgeId);
    const reward = getBadgeReward(badgeId);
    creator.credits += reward;
    await creator.save();

    await CreditTransaction.create({
      userId,
      type: "earn",
      amount: reward,
      newBalance: creator.credits,
      source: "badge_unlock",
      description: `Manual badge claim: ${badge.name}`,
    });

    return NextResponse.json(
      { ok: true, badge: badgeId, reward },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    console.error("badge claim error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
