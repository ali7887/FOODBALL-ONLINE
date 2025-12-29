import { NextRequest, NextResponse } from "next/server";
import Match from "@/lib/db/models/Match";
import Prediction from "@/lib/db/models/Prediction";
import Creator from "@/lib/db/models/Creator";
import CreditTransaction from "@/lib/db/models/CreditTransaction";
import { calculatePredictionReward } from "@/lib/predictions/rewards";

const CRON_SECRET = process.env.CRON_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-cron-secret") || "";
    if (!CRON_SECRET || secret !== CRON_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Find matches that are completed and not yet resolved
    const matches = await Match.find({
      status: "completed",
      predictionsResolved: { $ne: true },
    }).lean();

    for (const m of matches) {
      const matchId = (m as any)._id;
      const predictions = await Prediction.find({ matchId, status: "pending" });

      for (const p of predictions) {
        const isCorrect = p.outcome === (m as any).result;

        const creator = await Creator.findOne({ userId: p.userId });
        if (!creator) continue;

        if (isCorrect) {
          const reward = calculatePredictionReward(
            p.coinsWagered,
            p.confidenceLevel as any,
            "correct",
            (creator as any).predictionStreak || 0
          );
          p.status = "won";
          p.coinsWon = reward;

          // Award credits
          creator.credits = (creator as any).credits + reward;
          // Increment streak
          (creator as any).predictionStreak =
            ((creator as any).predictionStreak || 0) + 1;

          await CreditTransaction.create({
            userId: p.userId,
            type: "earn",
            amount: reward,
            newBalance: creator.credits,
            source: "prediction_win",
            description: `Winnings for prediction ${p._id}`,
            relatedId: p._id,
            relatedType: "prediction",
          });
        } else {
          p.status = "lost";
          p.coinsWon = 0;
          // Reset streak
          (creator as any).predictionStreak = 0;
        }

        await p.save();
        await creator.save();
      }

      // Mark match as resolved
      await Match.updateOne(
        { _id: matchId },
        { $set: { predictionsResolved: true } }
      );
    }

    return NextResponse.json({ ok: true, processed: matches.length });
  } catch (error) {
    console.error("results cron error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
