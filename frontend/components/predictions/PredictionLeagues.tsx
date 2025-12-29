"use client";

import React, { useState } from "react";

export default function PredictionLeagues() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [invite, setInvite] = useState("");

  const createLeague = async () => {
    // optimistic add
    const newL = {
      id: `temp-${Date.now()}`,
      name: "لیگ جدید",
      inviteCode: Math.random().toString(36).slice(2, 8),
    };
    setLeagues((s) => [newL, ...s]);
    // TODO: call API
  };

  const joinLeague = () => {
    if (!invite) return;
    // TODO: API join
    setLeagues((s) => [
      { id: invite, name: `عضو ${invite}`, inviteCode: invite },
      ...s,
    ]);
    setInvite("");
  };

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">لیگ‌ها</h4>
        <button
          onClick={createLeague}
          className="px-3 py-1 bg-indigo-600 text-white rounded"
        >
          ایجاد لیگ
        </button>
      </div>

      <div className="space-y-2 mb-3">
        {leagues.map((l) => (
          <div
            key={l.id}
            className="p-2 rounded bg-gray-50 flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{l.name}</div>
              <div className="text-xs text-gray-500">
                کد دعوت: {l.inviteCode}
              </div>
            </div>
            <div className="text-sm">اعضا: 1</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={invite}
          onChange={(e) => setInvite(e.target.value)}
          className="flex-1 p-2 rounded border"
          placeholder="کد دعوت"
        />
        <button
          onClick={joinLeague}
          className="px-3 py-2 bg-emerald-500 text-white rounded"
        >
          پیوستن
        </button>
      </div>
    </div>
  );
}
