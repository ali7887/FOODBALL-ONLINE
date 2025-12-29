"use client";

import React from "react";

interface Odds {
  home: number;
  draw: number;
  away: number;
}

export default function LiveOdds({ odds }: { odds: Odds }) {
  const total = odds.home + odds.draw + odds.away;
  const ph = Math.round((odds.home / total) * 100);
  const pd = Math.round((odds.draw / total) * 100);
  const pa = Math.round((odds.away / total) * 100);

  return (
    <div className="text-xs text-right" dir="rtl">
      <div className="flex gap-2">
        <div className="px-2 py-1 rounded bg-green-100">میزبان {odds.home}</div>
        <div className="px-2 py-1 rounded bg-yellow-100">مساوی {odds.draw}</div>
        <div className="px-2 py-1 rounded bg-red-100">میهمان {odds.away}</div>
      </div>
      <div className="flex gap-2 text-xs text-gray-500 mt-1">
        <div>پخش: {ph}%</div>
        <div>پخش: {pd}%</div>
        <div>پخش: {pa}%</div>
      </div>
    </div>
  );
}
