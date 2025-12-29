import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import PredictionLeague from "@/lib/db/models/PredictionLeague";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const league = await PredictionLeague.findById(id).lean();
    if (!league)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Sort members by points desc
    league.members = (league.members || []).sort(
      (a: any, b: any) => b.points - a.points
    );
    return NextResponse.json({ league }, { status: 200 });
  } catch (error) {
    console.error("get league error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;
    const id = params.id;

    const league = await PredictionLeague.findById(id);
    if (!league)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (String(league.creatorId) !== String(userId))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const allowed = ["name", "description", "maxMembers", "isPrivate"];
    allowed.forEach((k) => {
      if (body[k] !== undefined) (league as any)[k] = body[k];
    });

    await league.save();
    return NextResponse.json({ ok: true, league }, { status: 200 });
  } catch (error) {
    console.error("patch league error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
