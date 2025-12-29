import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import Prediction from "@/lib/db/models/Prediction";
import Match from "@/lib/db/models/Match";
import Creator from "@/lib/db/models/Creator";
import CreditTransaction from "@/lib/db/models/CreditTransaction";
import { calculatePotentialReturn } from "@/lib/predictions/rewards";

const createPredictionSchema = z.object({
  matchId: z.string(),
  outcome: z.enum(["home_win", "draw", "away_win"]),
  confidenceLevel: z.enum(["low", "medium", "high"]),
  coinsWagered: z.number().min(50).max(500),
  isPublic: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const body = await request.json();
    const parsed = createPredictionSchema.parse(body);

    // Check match exists and is upcoming
    const match = await Match.findById(parsed.matchId).lean();
    if (!match)
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    if (
      match.status !== "scheduled" ||
      new Date(match.scheduledAt) <= new Date()
    ) {
      return NextResponse.json(
        { error: "Match not open for predictions" },
        { status: 400 }
      );
    }

    // Check duplicate
    const existing = await Prediction.findOne({
      userId,
      matchId: parsed.matchId,
    }).lean();
    if (existing)
      return NextResponse.json(
        { error: "Prediction already placed for this match" },
        { status: 400 }
      );

    // Check user balance
    const creator = await Creator.findOne({ userId });
    if (!creator)
      return NextResponse.json(
        { error: "Creator profile required" },
        { status: 400 }
      );
    if ((creator as any).credits < parsed.coinsWagered)
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );

    // Calculate potential return
    const potentialReturn = calculatePotentialReturn(
      parsed.coinsWagered,
      parsed.confidenceLevel as any,
      0
    );

    // Deduct coins (atomic recommended in production)
    creator.credits = (creator as any).credits - parsed.coinsWagered;
    await creator.save();

    await CreditTransaction.create({
      userId,
      type: "spend",
      amount: parsed.coinsWagered,
      newBalance: creator.credits,
      source: "prediction_wager",
      description: `Wager on match ${parsed.matchId}`,
      relatedId: parsed.matchId,
      relatedType: "match",
    });

    const created = await Prediction.create({
      userId,
      matchId: parsed.matchId,
      outcome: parsed.outcome,
      confidenceLevel: parsed.confidenceLevel,
      coinsWagered: parsed.coinsWagered,
      odds: Number((potentialReturn / parsed.coinsWagered).toFixed(2)),
      potentialReturn,
      status: "pending",
      isPublic: parsed.isPublic ?? true,
    });

    return NextResponse.json(
      { ok: true, prediction: created },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    console.error("create prediction error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
