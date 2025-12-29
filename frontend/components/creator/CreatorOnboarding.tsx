"use client";
import React, { useState } from "react";

export function CreatorOnboarding({ dir = "rtl" }: { dir?: "ltr" | "rtl" }) {
  const [step, setStep] = useState<number>(1);

  return (
    <div dir={dir} className="bg-white rounded p-4 border">
      <h3 className="font-semibold mb-2">شروع فعالیت سازنده</h3>
      <div className="mb-4">مرحله {step} از 4</div>

      {step === 1 && (
        <div>
          <div className="mb-2">انتخاب علاقه‌مندی (نیچ)</div>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1 border rounded">تحلیل</button>
            <button className="px-3 py-1 border rounded">میم</button>
            <button className="px-3 py-1 border rounded">آموزش</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-2">راهنمای سریع</div>
          <p className="text-sm text-gray-600">
            نکات ساده برای جذب دنبال‌کننده و تعامل.
          </p>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="mb-2">پست اول</div>
          <p className="text-sm text-gray-600">یک پست ساده بساز و منتشر کن.</p>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="mb-2">چالش دریافت دنبال‌کننده</div>
          <p className="text-sm text-gray-600">
            هدفی برای جذب 10 دنبال‌کننده در 7 روز.
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className="px-3 py-1 border rounded"
        >
          قبلی
        </button>
        <button
          onClick={() => setStep(Math.min(4, step + 1))}
          className="px-3 py-1 bg-emerald-600 text-white rounded"
        >
          بعدی
        </button>
      </div>
    </div>
  );
}

export default CreatorOnboarding;
