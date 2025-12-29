import mongoose from "mongoose";
import type { Creator as CreatorType } from "@/types/creator";

/**
 * Creator model
 * NOTE: Use `.lean()` for read-only queries to improve performance.
 */
const creatorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true, unique: true, trim: true },
    avatar: { type: String },
    title: {
      type: String,
      enum: [
        "Rookie Creator",
        "Active Creator",
        "Rising Star",
        "Pro Creator",
        "Elite Creator",
        "Platform Partner",
        "Legend",
      ],
      default: "Rookie Creator",
    },
    verified: { type: Boolean, default: false },

    // Stats
    followers: { type: Number, default: 0, index: true },
    totalViews: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },

    // Reputation
    reputationScore: { type: Number, default: 50, min: 0, max: 100 },
    strikes: { type: Number, default: 0 },

    // Earnings
    credits: { type: Number, default: 0, index: true },
    monthlyEarnings: { type: Number, default: 0 },
    lifetimeEarnings: { type: Number, default: 0 },

    // Badges (store badge ids)
    badges: [{ type: String }],

    // Analytics
    engagementRate: { type: Number, default: 0 },
    avgViewsPerPost: { type: Number, default: 0 },
    bestPerformingType: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes
creatorSchema.index({ userId: 1 });
creatorSchema.index({ credits: -1 });
creatorSchema.index({ username: 1 });

export const Creator =
  (mongoose.models.Creator as mongoose.Model<CreatorType>) ||
  mongoose.model<CreatorType>("Creator", creatorSchema);

export default Creator;
