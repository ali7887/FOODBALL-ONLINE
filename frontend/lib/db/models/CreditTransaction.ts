import mongoose from "mongoose";
import type { CreditTransaction as CreditTransactionType } from "@/types/monetization";

const creditTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    newBalance: { type: Number },
    source: { type: String, required: true },
    description: { type: String },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    relatedType: { type: String },
    status: {
      type: String,
      enum: ["completed", "pending", "failed", "refunded"],
      default: "completed",
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

creditTransactionSchema.index({ userId: 1, createdAt: -1 });

export const CreditTransaction =
  (mongoose.models
    .CreditTransaction as mongoose.Model<CreditTransactionType>) ||
  mongoose.model<CreditTransactionType>(
    "CreditTransaction",
    creditTransactionSchema
  );

export default CreditTransaction;
