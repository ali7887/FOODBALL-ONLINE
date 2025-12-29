import mongoose from "mongoose";
import type { PredictionLeague as PredictionLeagueType } from "@/types/predictions";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    points: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const leagueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isPrivate: { type: Boolean, default: false },
    inviteCode: { type: String },
    maxMembers: { type: Number, default: 100 },

    members: { type: [memberSchema], default: [] },

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// Indexes
leagueSchema.index({ creatorId: 1 });
leagueSchema.index({ isPrivate: 1 });
leagueSchema.index({ inviteCode: 1 });

export const PredictionLeague =
  (mongoose.models.PredictionLeague as mongoose.Model<PredictionLeagueType>) ||
  mongoose.model<PredictionLeagueType>("PredictionLeague", leagueSchema);

export default PredictionLeague;
