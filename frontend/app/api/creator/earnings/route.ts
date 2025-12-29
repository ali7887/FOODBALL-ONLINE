import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Creator from "@/lib/db/models/Creator";
import CreditTransaction from "@/lib/db/models/CreditTransaction";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "monthly";

    const creator = await Creator.findOne({ userId }).lean();
    if (!creator)
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });

    // Basic breakdown from stored fields
    const breakdown = {
      currentBalance: (creator as any).credits || 0,
      monthlyEarnings: (creator as any).monthlyEarnings || 0,
      lifetimeEarnings: (creator as any).lifetimeEarnings || 0,
    };

    // Projection example: simple linear projection
    const projection = {
      period,
      projectedNextMonth: Math.floor(breakdown.monthlyEarnings * 1.05),
    };

    // Quick recent transactions sample
    const recent = await CreditTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json(
      { breakdown, projection, recent },
      { status: 200 }
    );
  } catch (error) {
    console.error("earnings GET error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
