import { NextRequest, NextResponse } from "next/server";
import Prediction from "@/lib/db/models/Prediction";
import Match from "@/lib/db/models/Match";
import Creator from "@/lib/db/models/Creator";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const prediction = await Prediction.findById(id).lean();
    if (!prediction)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const match = await Match.findById(prediction.matchId).lean();

    // Basic stats for the prediction
    const stats = {
      likes: prediction.likes || 0,
      comments: prediction.comments || 0,
      potentialReturn: prediction.potentialReturn,
      odds: prediction.odds,
      status: prediction.status,
      match,
    };

    return NextResponse.json({ prediction, stats }, { status: 200 });
  } catch (error) {
    console.error("get prediction error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
