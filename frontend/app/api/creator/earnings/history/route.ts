import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import CreditTransaction from "@/lib/db/models/CreditTransaction";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Math.min(Number(url.searchParams.get("limit") || "20"), 100);

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      CreditTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CreditTransaction.countDocuments({ userId }),
    ]);

    return NextResponse.json({ items, total, page, limit }, { status: 200 });
  } catch (error) {
    console.error("earnings history error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
