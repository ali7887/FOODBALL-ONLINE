"use client";

import React from "react";

interface Props {
  prediction: any;
}

export default function PredictionCard({ prediction }: Props) {
  return (
    <div
      className="bg-white rounded-lg shadow p-3 flex items-center justify-between"
      dir="rtl"
    >
      <div>
        <div className="font-semibold">
          {prediction.user?.username || "شما"}
        </div>
        <div className="text-sm text-gray-500">
          {prediction.matchSummary || ""}
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm">نتیجه: {prediction.outcome}</div>
        <div className="text-sm">اعتماد: {prediction.confidence}</div>
        <div className="text-sm">سکه: {prediction.coinsWagered}</div>
        <div className="text-xs mt-1">
          وضعیت: <span className="font-medium">{prediction.status}</span>
        </div>
      </div>
    </div>
  );
}
