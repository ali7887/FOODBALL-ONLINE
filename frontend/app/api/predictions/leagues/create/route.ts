import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import PredictionLeague from "@/lib/db/models/PredictionLeague";

const createLeagueSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(200).optional(),
  isPrivate: z.boolean().optional(),
  maxMembers: z.number().min(2).max(50).optional(),
});

function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const body = await request.json();
    const parsed = createLeagueSchema.parse(body);

    const inviteCode = parsed.isPrivate ? generateInviteCode() : undefined;

    const league = await PredictionLeague.create({
      name: parsed.name,
      description: parsed.description || "",
      creatorId: userId,
      isPrivate: Boolean(parsed.isPrivate),
      inviteCode,
      maxMembers: parsed.maxMembers || 50,
      members: [
        {
          userId,
          username: session.user.name || "unknown",
          points: 0,
          rank: 1,
        },
      ],
      startDate: new Date(),
      status: "active",
    });

    return NextResponse.json({ ok: true, league }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    console.error("create league error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
