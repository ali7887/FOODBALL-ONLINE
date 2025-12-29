import mongoose from "mongoose";
import type { Prediction as PredictionType } from "@/types/predictions";

const OUTCOMES = ["home_win", "draw", "away_win"];
const CONFIDENCES = ["low", "medium", "high"];
const STATUS = ["pending", "won", "lost", "refunded", "cancelled"];

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
      index: true,
    },

    outcome: { type: String, enum: OUTCOMES, required: true },
    confidenceLevel: { type: String, enum: CONFIDENCES, required: true },
    coinsWagered: { type: Number, required: true, min: 0 },

    odds: { type: Number, required: true, min: 0 },
    potentialReturn: { type: Number, required: true, min: 0 },

    status: { type: String, enum: STATUS, default: "pending", index: true },
    actualOutcome: { type: String, enum: OUTCOMES },
    coinsWon: { type: Number },

    isPublic: { type: Boolean, default: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
predictionSchema.index({ userId: 1 });
predictionSchema.index({ matchId: 1 });
predictionSchema.index({ status: 1 });
predictionSchema.index({ userId: 1, matchId: 1 }, { unique: false });

export const Prediction =
  (mongoose.models.Prediction as mongoose.Model<PredictionType>) ||
  mongoose.model<PredictionType>("Prediction", predictionSchema);

export default Prediction;
