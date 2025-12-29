import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import CreatorContent from "@/lib/db/models/CreatorContent";
import Creator from "@/lib/db/models/Creator";
import CreditTransaction from "@/lib/db/models/CreditTransaction";
import { moderateContent } from "@/lib/moderation/content-filter";
import { getUnlockedBadges, getBadgeReward } from "@/lib/creator/badges";
import { checkRateLimit } from "@/lib/rate-limit";

const createContentSchema = z.object({
  type: z.enum([
    "meme",
    "analysis",
    "highlight",
    "prediction",
    "opinion",
    "quiz",
  ]),
  title: z.string().min(5).max(200),
  description: z.string().max(1000).optional(),
  media: z
    .array(
      z.object({
        type: z.enum(["image", "video", "gif"]),
        url: z.string().url(),
        thumbnail: z.string().url().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
    )
    .min(1),
  isPublic: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Rate limit check
    const rl = await checkRateLimit(userId, "create_content");
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: rl.retryAfter },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = createContentSchema.parse(body);

    // Create content (initially pending)
    const created = await CreatorContent.create({
      creatorId: userId,
      type: parsed.type,
      title: parsed.title,
      description: parsed.description || "",
      media: parsed.media,
      status: "pending",
      isPublic: parsed.isPublic ?? true,
    });

    // Run moderation asynchronously but wait for quick result
    const modResult = await moderateContent(created as any);

    if (!modResult.approved) {
      // If high severity -> remove; if review -> mark under_review
      if (modResult.action === "remove") {
        created.status = "removed";
      } else {
        created.status = "under_review";
      }
      await created.save();
    } else {
      created.status = "approved";
      await created.save();

      // small initial reward for approved content
      const creator = await Creator.findOne({ userId }).lean();
      if (creator) {
        const reward = Math.floor(5); // base bonus for approval
        await CreditTransaction.create({
          userId,
          type: "earn",
          amount: reward,
          newBalance: (creator as any).credits + reward,
          source: "content_impression",
          description: "Content approval reward",
        });
      }
    }

    // Check badges (non-blocking)
    try {
      const stats = {
        userId,
        totalPosts:
          (await CreatorContent.countDocuments({ creatorId: userId })) || 0,
        followers:
          (await Creator.findOne({ userId }).then((c) => c?.followers || 0)) ||
          0,
        totalViews:
          (await Creator.findOne({ userId }).then((c) => c?.totalViews || 0)) ||
          0,
        avgEngagementRate: 0,
        currentStreak: 0,
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

      const unlocked = getUnlockedBadges(stats);
      if (unlocked.length > 0) {
        // award first-time badges (simple logic)
        const creatorDoc = await Creator.findOne({ userId });
        if (creatorDoc) {
          unlocked.forEach(async (b) => {
            if (!creatorDoc.badges.includes(b._id)) {
              creatorDoc.badges.push(b._id);
              const reward = getBadgeReward(b._id);
              creatorDoc.credits += reward;
              await CreditTransaction.create({
                userId,
                type: "earn",
                amount: reward,
                newBalance: creatorDoc.credits,
                source: "badge_unlock",
                description: `Badge reward: ${b.name}`,
              });
            }
          });
          await creatorDoc.save();
        }
      }
    } catch (err) {
      // non-blocking badge check failure
      console.warn("Badge check failed", err);
    }

    return NextResponse.json(
      { ok: true, contentId: created._id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("create content error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
