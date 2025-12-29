"use client";

import React, { useState } from "react";

interface PredictionItem {
  _id: string;
  matchSummary: string;
  outcome: string;
  status: string;
  coinsWagered: number;
}

export default function PredictionHistory({
  predictions,
}: {
  predictions: PredictionItem[];
}) {
  const [filter, setFilter] = useState<"all" | "won" | "lost" | "pending">(
    "all"
  );

  const filtered = predictions.filter((p) =>
    filter === "all" ? true : p.status === filter
  );

  const winCount = predictions.filter((p) => p.status === "won").length;
  const total = predictions.length;
  const accuracy = total ? ((winCount / total) * 100).toFixed(0) : "0";

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold">تاریخچه پیش‌بینی</div>
          <div className="text-xs text-gray-500">
            دقت: {accuracy}% — مجموع: {total}
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="p-2 border rounded"
          >
            <option value="all">همه</option>
            <option value="pending">در انتظار</option>
            <option value="won">برد</option>
            <option value="lost">باخت</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="p-2 rounded bg-gray-50 flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{p.matchSummary}</div>
              <div className="text-xs text-gray-500">نتیجه: {p.outcome}</div>
            </div>
            <div className="text-sm">
              {p.coinsWagered} سکه — {p.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
