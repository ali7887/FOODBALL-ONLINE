"use client";
import React from "react";
import type { Creator } from "@/types/creator";

interface AnalyticsSummaryProps {
  creator: Partial<Creator>;
  className?: string;
  dir?: "ltr" | "rtl";
}

export function AnalyticsSummary({
  creator,
  className = "",
  dir = "rtl",
}: AnalyticsSummaryProps) {
  return (
    <div
      dir={dir}
      className={`bg-white rounded-xl p-4 shadow border ${className}`}
    >
      <h3 className="text-lg font-semibold mb-3">خلاصه تحلیل</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">رشد بازدید</div>
          <div className="text-xl font-mono text-green-600">+23%</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">نرخ تعامل</div>
          <div className="text-xl font-mono">
            {(creator.engagementRate ?? 0).toFixed(1)}%
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">بهترین نوع محتوا</div>
          <div className="text-lg">{creator.bestPerformingType || "—"}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">دنبال‌کنندگان</div>
          <div className="text-xl font-mono">{creator.followers ?? 0}</div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsSummary;
