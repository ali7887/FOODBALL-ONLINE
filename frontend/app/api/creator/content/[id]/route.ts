import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import CreatorContent from "@/lib/db/models/CreatorContent";
import { moderateContent } from "@/lib/moderation/content-filter";

const updateSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().max(1000).optional(),
  media: z
    .array(
      z.object({
        type: z.enum(["image", "video", "gif"]),
        url: z.string().url(),
      })
    )
    .optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const content = await CreatorContent.findById(id).lean();
    if (!content)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error("GET content error", error);
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

    const parsed = updateSchema.parse(await request.json());
    const content = await CreatorContent.findById(id);
    if (!content)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (String(content.creatorId) !== String(userId))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    Object.assign(content, parsed);
    // Re-run moderation for updated content
    const mod = await moderateContent(content as any);
    if (!mod.approved) {
      content.status = mod.action === "remove" ? "removed" : "under_review";
    } else {
      content.status = "approved";
    }

    await content.save();
    return NextResponse.json({ ok: true, content }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    console.error("PATCH content error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;
    const id = params.id;

    const content = await CreatorContent.findById(id);
    if (!content)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (String(content.creatorId) !== String(userId))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    content.status = "removed";
    await content.save();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE content error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
