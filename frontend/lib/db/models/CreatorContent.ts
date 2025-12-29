import mongoose from "mongoose";
import type { CreatorContent as CreatorContentType } from "@/types/creator";

/**
 * CreatorContent schema
 * Includes media, engagement stats, credits earned and moderation flags
 */
const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video", "gif"], required: true },
    url: { type: String, required: true },
    alt: { type: String },
    duration: { type: Number },
  },
  { _id: false }
);

const flagSchema = new mongoose.Schema(
  {
    reason: { type: String, required: true },
    reportedAt: { type: Date, default: Date.now },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    resolutionNote: { type: String },
  },
  { _id: false }
);

const creatorContentSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
      index: true,
    },
    type: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    media: { type: [mediaSchema], default: [] },

    // Engagement
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },

    // Monetization
    creditsEarned: { type: Number, default: 0 },

    // Status & moderation
    status: {
      type: String,
      enum: ["pending", "approved", "removed", "under_review"],
      default: "pending",
      index: true,
    },
    flags: { type: [flagSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

// Indexes
creatorContentSchema.index({ creatorId: 1 });
creatorContentSchema.index({ status: 1 });
creatorContentSchema.index({ createdAt: -1 });
creatorContentSchema.index({ title: "text", description: "text" });

export const CreatorContent =
  (mongoose.models.CreatorContent as mongoose.Model<CreatorContentType>) ||
  mongoose.model<CreatorContentType>("CreatorContent", creatorContentSchema);

export default CreatorContent;
