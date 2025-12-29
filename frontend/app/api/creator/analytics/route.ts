import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import CreatorContent from "@/lib/db/models/CreatorContent";
import Creator from "@/lib/db/models/Creator";
import CreditTransaction from "@/lib/db/models/CreditTransaction";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const creator = await Creator.findOne({ userId }).lean();
    if (!creator)
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });

    // Views over time (last 30 days) aggregation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsAgg = await CreatorContent.aggregate([
      {
        $match: {
          creatorId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          views: { $sum: "$views" },
          engagements: { $sum: { $add: ["$likes", "$comments", "$shares"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]).allowDiskUse(true);

    // Best performing content
    const top = await CreatorContent.find({ creatorId: userId })
      .sort({ views: -1 })
      .limit(5)
      .lean();

    // Revenue trajectory (monthly totals)
    const revenueAgg = await CreditTransaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]).allowDiskUse(true);

    const analytics = {
      creatorSummary: {
        followers: creator.followers,
        totalViews: creator.totalViews,
        engagementRate: creator.engagementRate,
        monthlyEarnings: creator.monthlyEarnings,
      },
      viewsOverTime: viewsAgg,
      topContent: top,
      revenue: revenueAgg,
    };

    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    console.error("analytics error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
