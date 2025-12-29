"use client";

import React from "react";

interface LeaderboardEntry {
  rank: number;
  user: { username: string; avatar?: string };
  accuracy: number;
  totalPredictions: number;
  coinsEarned: number;
}

export function PredictionLeaderboard({
  entries,
}: {
  entries: LeaderboardEntry[];
}) {
  return (
    <div dir="rtl" className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">جدول لیدربورد</h3>
        <div className="text-sm text-gray-500">به‌روز</div>
      </div>

      <div className="space-y-2">
        {entries.map((e) => (
          <div
            key={e.rank}
            className={`flex items-center justify-between p-2 rounded ${
              e.rank <= 3 ? "bg-yellow-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                {e.user.avatar ? <img src={e.user.avatar} alt="a" /> : null}
              </div>
              <div>
                <div className="font-medium">{e.user.username}</div>
                <div className="text-xs text-gray-500">
                  پیش‌بینی‌ها: {e.totalPredictions}
                </div>
              </div>
            </div>
            <div className="text-sm text-right">
              <div>دقت: {(e.accuracy * 100).toFixed(0)}%</div>
              <div className="font-semibold">{e.coinsEarned} سکه</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PredictionLeaderboard;
