"use client";

import React, { useState, useEffect } from "react";
import { MatchForPrediction } from "@/types/predictions";
import PredictionForm from "./PredictionForm";
import LiveOdds from "./LiveOdds";

interface Props {
  matches: MatchForPrediction[];
  userCredits: number;
}

export default function MatchPredictionList({ matches, userCredits }: Props) {
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [localPredictions, setLocalPredictions] = useState<any[]>([]);

  useEffect(() => {
    const onOpt = (e: any) => setLocalPredictions((p) => [e.detail, ...p]);
    const onCreated = (e: any) => {
      const { tempId, server } = e.detail;
      setLocalPredictions((p) => p.map((x) => (x._id === tempId ? server : x)));
    };
    const onRollback = (e: any) =>
      setLocalPredictions((p) => p.filter((x) => x._id !== e.detail.tempId));

    window.addEventListener("prediction:optimistic", onOpt);
    window.addEventListener("prediction:created", onCreated);
    window.addEventListener("prediction:rollback", onRollback);
    return () => {
      window.removeEventListener("prediction:optimistic", onOpt);
      window.removeEventListener("prediction:created", onCreated);
      window.removeEventListener("prediction:rollback", onRollback);
    };
  }, []);

  return (
    <div className="space-y-4">
      {matches.map((m) => (
        <div key={m._id} className="bg-white rounded-lg shadow p-4" dir="rtl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="font-semibold">
                {m.homeTeam} — {m.awayTeam}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(m.scheduledAt).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LiveOdds odds={m.odds || { home: 1.8, draw: 3.2, away: 2.9 }} />
              <button
                onClick={() => setOpenFor(openFor === m._id ? null : m._id)}
                className="px-3 py-1 rounded bg-indigo-600 text-white"
              >
                پیش‌بینی سریع
              </button>
            </div>
          </div>

          <div className="mt-3">
            {openFor === m._id ? (
              <PredictionForm match={m} userCredits={userCredits} />
            ) : null}
          </div>
        </div>
      ))}

      {localPredictions.length > 0 && (
        <div className="bg-gray-50 p-3 rounded">
          پیش‌بینی‌های موقت: {localPredictions.length}
        </div>
      )}
    </div>
  );
}
