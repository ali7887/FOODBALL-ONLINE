"use client";

import React, { useMemo, useState } from "react";
import ConfidenceSlider from "./ConfidenceSlider";
import {
  MatchForPrediction,
  MatchOutcome,
  ConfidenceLevel,
} from "@/types/predictions";

interface PredictionFormProps {
  match: MatchForPrediction;
  userCredits: number;
}

export function PredictionForm({ match, userCredits }: PredictionFormProps) {
  const [outcome, setOutcome] = useState<MatchOutcome | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel>("medium");
  const [coins, setCoins] = useState<number>(Math.min(100, userCredits || 100));
  const [publicPick, setPublicPick] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const multiplier = useMemo(() => {
    return confidence === "low" ? 1.5 : confidence === "medium" ? 2 : 3;
  }, [confidence]);

  const potentialReturn = useMemo(
    () => Math.round(coins * multiplier),
    [coins, multiplier]
  );

  const handleSubmit = async () => {
    if (!outcome) return;
    if (coins <= 0 || coins > userCredits) return;

    const tempId = `temp-${Date.now()}`;
    const newPrediction = {
      _id: tempId,
      matchId: match._id,
      outcome,
      confidence,
      coinsWagered: coins,
      multiplier,
      potentialReturn,
      status: "pending",
      createdAt: new Date().toISOString(),
    } as any;

    setSubmitting(true);

    // Optimistic UI: dispatch an event so parent lists can pick it up
    window.dispatchEvent(
      new CustomEvent("prediction:optimistic", { detail: newPrediction })
    );

    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match._id,
          outcome,
          confidence,
          coins: coins,
          isPublic: publicPick,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      // inform listeners about server result
      window.dispatchEvent(
        new CustomEvent("prediction:created", {
          detail: { tempId, server: data },
        })
      );
    } catch (err) {
      // rollback
      window.dispatchEvent(
        new CustomEvent("prediction:rollback", { detail: { tempId } })
      );
      // basic feedback
      // eslint-disable-next-line no-console
      console.error(err);
      alert("خطا در ثبت پیش‌بینی — لطفا دوباره تلاش کنید");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow p-4">
      <div className="flex gap-3 mb-3">
        <button
          className={`flex-1 py-2 rounded ${
            outcome === "home" ? "bg-emerald-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setOutcome("home")}
        >
          میزبان
        </button>
        <button
          className={`flex-1 py-2 rounded ${
            outcome === "draw" ? "bg-amber-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setOutcome("draw")}
        >
          مساوی
        </button>
        <button
          className={`flex-1 py-2 rounded ${
            outcome === "away" ? "bg-red-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setOutcome("away")}
        >
          میهمان
        </button>
      </div>

      <div className="mb-3">
        <ConfidenceSlider
          value={confidence}
          onChange={(v) => setConfidence(v)}
        />
      </div>

      <div className="mb-3">
        <label className="text-sm mb-1 block">سکه‌ها: {coins}</label>
        <input
          aria-label="coins"
          className="w-full"
          type="range"
          min={1}
          max={Math.max(1, userCredits)}
          value={coins}
          onChange={(e) => setCoins(Number(e.target.value))}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-gray-500">پتانسیل بازگشت</div>
          <div className="text-lg font-semibold">{potentialReturn} سکه</div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">عمومی</label>
          <input
            type="checkbox"
            checked={publicPick}
            onChange={() => setPublicPick((s) => !s)}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !outcome || coins <= 0 || coins > userCredits}
        className="w-full py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
      >
        {submitting ? "در حال ارسال..." : "ثبت پیش‌بینی"}
      </button>
    </div>
  );
}

export default PredictionForm;
