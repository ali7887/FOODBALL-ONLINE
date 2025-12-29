"use client";
import React, { useState } from "react";
import type { CreatorEarnings } from "@/types/creator";

interface EarningsWidgetProps {
  earnings: CreatorEarnings;
  dir?: "ltr" | "rtl";
}

export function EarningsWidget({ earnings, dir = "ltr" }: EarningsWidgetProps) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "monthly"
  );

  return (
    <div
      dir={dir}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">درآمد (شبیه‌سازی)</h3>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
            aria-label="Select period"
          >
            <option value="daily">روزانه</option>
            <option value="weekly">هفتگی</option>
            <option value="monthly">ماهانه</option>
          </select>
        </div>
      </div>

      <div className="flex items-baseline gap-4">
        <div>
          <div className="text-3xl font-mono text-emerald-700">
            {Math.floor(earnings.lifetimeEarnings)}
          </div>
          <div className="text-sm text-gray-500">اعتبار کل</div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">این ماه</div>
              <div className="font-mono text-lg text-gray-800">
                {Math.floor(earnings.monthlyEarnings)}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">میانگین ماهیانه</div>
              <div className="font-mono text-lg text-gray-800">
                {Math.floor(earnings.averageMonthlyEarnings || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-2">منابع</div>
        <div className="flex gap-2">
          <div className="flex-1 bg-green-50 p-2 rounded text-sm">
            نمایش:{" "}
            {Math.floor(
              (earnings.thisMonth?.bySource?.impressions as any) || 0
            )}
          </div>
          <div className="flex-1 bg-blue-50 p-2 rounded text-sm">
            تعامل:{" "}
            {Math.floor((earnings.thisMonth?.bySource?.engagement as any) || 0)}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          رتبه: <span className="font-medium">—</span>
        </div>
        <button
          disabled
          className="px-3 py-1 bg-gray-200 text-sm rounded text-gray-600"
          aria-disabled
        >
          نقد کردن (شبیه‌سازی)
        </button>
      </div>
    </div>
  );
}

export default EarningsWidget;
