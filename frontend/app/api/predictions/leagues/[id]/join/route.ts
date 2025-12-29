import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import PredictionLeague from "@/lib/db/models/PredictionLeague";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;
    const username = session.user.name || "unknown";
    const id = params.id;

    const league = await PredictionLeague.findById(id);
    if (!league)
      return NextResponse.json({ error: "League not found" }, { status: 404 });

    if ((league.members || []).length >= (league.maxMembers || 50))
      return NextResponse.json({ error: "League is full" }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    if (league.isPrivate) {
      const code = body.inviteCode;
      if (!code || code !== league.inviteCode)
        return NextResponse.json(
          { error: "Invalid invite code" },
          { status: 400 }
        );
    }

    const already = (league.members || []).some(
      (m: any) => String(m.userId) === String(userId)
    );
    if (already)
      return NextResponse.json({ error: "Already a member" }, { status: 400 });

    league.members.push({
      userId,
      username,
      points: 0,
      rank: (league.members || []).length + 1,
    });
    await league.save();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("join league error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
