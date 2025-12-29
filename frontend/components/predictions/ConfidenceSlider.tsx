"use client";

import React from "react";
import { ConfidenceLevel } from "@/types/predictions";

interface Props {
  value: ConfidenceLevel;
  onChange: (v: ConfidenceLevel) => void;
}

const levelIndex = (v: ConfidenceLevel) =>
  v === "low" ? 0 : v === "medium" ? 1 : 2;
const indexToLevel = (i: number) =>
  (i === 0 ? "low" : i === 1 ? "medium" : "high") as ConfidenceLevel;

export default function ConfidenceSlider({ value, onChange }: Props) {
  const idx = levelIndex(value);

  return (
    <div className="flex flex-col gap-2" dir="rtl">
      <div className="flex items-center justify-between text-sm">
        <div className="text-xs">ریسک</div>
        <div className="font-semibold">
          {value === "low" ? "کم" : value === "medium" ? "متوسط" : "زیاد"}
        </div>
      </div>

      <div className="relative">
        <div className="h-3 rounded-md overflow-hidden bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500" />
        <input
          aria-label="confidence"
          type="range"
          min={0}
          max={2}
          value={idx}
          onChange={(e) => onChange(indexToLevel(Number(e.target.value)))}
          className="absolute inset-0 opacity-0 touch-none"
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className={`text-center w-1/3 ${idx === 0 ? "font-bold" : ""}`}>
          کم
          <br />
          1.5x
        </div>
        <div className={`text-center w-1/3 ${idx === 1 ? "font-bold" : ""}`}>
          متوسط
          <br />
          2x
        </div>
        <div className={`text-center w-1/3 ${idx === 2 ? "font-bold" : ""}`}>
          زیاد
          <br />
          3x
        </div>
      </div>
    </div>
  );
}
