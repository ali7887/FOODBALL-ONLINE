import { NextRequest, NextResponse } from "next/server";
import Prediction from "@/lib/db/models/Prediction";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get("limit") || "20"), 100);
    const period = url.searchParams.get("period") || "all_time";

    const matchStart =
      period === "monthly"
        ? new Date(new Date().setMonth(new Date().getMonth() - 1))
        : undefined;

    const matchStage: any[] = [];
    if (matchStart)
      matchStage.push({ $match: { createdAt: { $gte: matchStart } } });

    // Aggregate top predictors by coins earned and accuracy
    const agg = [
      ...matchStage,
      {
        $group: {
          _id: "$userId",
          totalWins: { $sum: { $cond: [{ $eq: ["$status", "won"] }, 1, 0] } },
          totalPredictions: { $sum: 1 },
          coinsEarned: { $sum: "$coinsWon" },
        },
      },
      {
        $project: {
          totalWins: 1,
          totalPredictions: 1,
          coinsEarned: 1,
          accuracy: {
            $cond: [
              { $eq: ["$totalPredictions", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$totalWins", "$totalPredictions"] },
                  100,
                ],
              },
            ],
          },
        },
      },
      { $sort: { coinsEarned: -1, accuracy: -1 } },
      { $limit: limit },
    ];

    const results = await Prediction.aggregate(agg).allowDiskUse(true);
    return NextResponse.json({ leaderboard: results }, { status: 200 });
  } catch (error) {
    console.error("leaderboard error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
