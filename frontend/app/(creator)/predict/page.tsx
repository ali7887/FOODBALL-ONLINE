import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MatchPredictionList from "@/components/predictions/MatchPredictionList";
import PredictionLeaderboard from "@/components/predictions/PredictionLeaderboard";
import PredictionHistory from "@/components/predictions/PredictionHistory";
import {
  getUpcomingMatches,
  getUserCredits,
  getUserPredictions,
  getPredictionLeaderboard,
} from "@/lib/api-client";

export default async function PredictPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const [matches, userCredits, predictions, leaderboard] = await Promise.all([
    getUpcomingMatches({ limit: 10 }),
    getUserCredits(session.user.id),
    getUserPredictions(session.user.id, { limit: 10 }),
    getPredictionLeaderboard({ limit: 10 }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MatchPredictionList matches={matches} userCredits={userCredits} />
        </div>
        <div className="space-y-4">
          <PredictionLeaderboard entries={leaderboard} />
          <PredictionHistory predictions={predictions} />
        </div>
      </div>
    </div>
  );
}
