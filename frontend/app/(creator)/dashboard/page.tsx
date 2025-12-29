import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Creator from "@/lib/db/models/Creator";
import CreatorContent from "@/lib/db/models/CreatorContent";
import EarningsWidget from "@/components/creator/EarningsWidget";
import CreatorBadges from "@/components/creator/CreatorBadges";
import AnalyticsSummary from "@/components/creator/AnalyticsSummary";
import ContentGrid from "@/components/creator/ContentGrid";

export default async function CreatorDashboard() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const userId = session.user.id as string;

  const [creator, earnings, badges, content] = await Promise.all([
    Creator.findOne({ userId }).lean(),
    Creator.findOne({ userId }).lean(),
    Creator.findOne({ userId }).lean(),
    CreatorContent.find({ creatorId: userId })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean(),
  ]);

  const earningsData = (earnings as any) || {
    lifetimeEarnings: 0,
    monthlyEarnings: 0,
    averageMonthlyEarnings: 0,
    thisMonth: { bySource: { impressions: 0, engagement: 0 } },
  };

  const badgesList = (badges as any)?.badges || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <EarningsWidget earnings={earningsData} />
        <CreatorBadges badges={badgesList} owned={badgesList} />
      </div>

      <div className="mb-8">
        <AnalyticsSummary creator={creator as any} />
      </div>

      <ContentGrid content={(content as any) || []} />
    </div>
  );
}
