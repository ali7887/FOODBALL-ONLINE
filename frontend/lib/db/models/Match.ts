import mongoose from "mongoose";
import type { MatchForPrediction as MatchForPredictionType } from "@/types/predictions";

const outcomeEnum = ["home_win", "draw", "away_win"];
const statusEnum = ["scheduled", "in_progress", "completed", "cancelled"];

const matchSchema = new mongoose.Schema(
  {
    homeTeam: {
      id: { type: String, required: false },
      name: { type: String, required: true },
    },
    awayTeam: {
      id: { type: String, required: false },
      name: { type: String, required: true },
    },
    scheduledAt: { type: Date, required: true, index: true },
    season: { type: String },
    league: { type: String },

    status: {
      type: String,
      enum: statusEnum,
      default: "scheduled",
      index: true,
    },
    totalPredictions: { type: Number, default: 0 },
    outcomeDistribution: {
      home_win: { type: Number, default: 0 },
      draw: { type: Number, default: 0 },
      away_win: { type: Number, default: 0 },
    },

    result: { type: String, enum: outcomeEnum },
    finalScore: {
      home: { type: Number },
      away: { type: Number },
    },
    predictionsResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
matchSchema.index({ scheduledAt: 1 });
matchSchema.index({ status: 1 });

export const Match =
  (mongoose.models.Match as mongoose.Model<MatchForPredictionType>) ||
  mongoose.model<MatchForPredictionType>("Match", matchSchema);

export default Match;
