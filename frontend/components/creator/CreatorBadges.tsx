"use client";
import React from "react";
import type { Badge } from "@/types/creator";

interface CreatorBadgesProps {
  badges: Badge[];
  owned?: string[]; // badge ids
  dir?: "ltr" | "rtl";
}

const RARITY_COLORS: Record<Badge["rarity"], string> = {
  common: "bg-gray-100",
  rare: "bg-blue-100",
  epic: "bg-purple-100",
  legendary: "bg-pink-100",
};

export function CreatorBadges({
  badges,
  owned = [],
  dir = "rtl",
}: CreatorBadgesProps) {
  return (
    <div
      dir={dir}
      className="bg-white rounded-xl shadow p-4 border border-gray-200"
    >
      <h3 className="text-lg font-semibold mb-3">نشان‌ها</h3>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((b) => {
          const unlocked = owned.includes(b._id);
          return (
            <div
              key={b._id}
              className={`p-3 rounded ${RARITY_COLORS[b.rarity]} relative`}
              title={b.description}
            >
              <div className="text-2xl">{b.icon}</div>
              <div className="text-sm font-medium">{b.name}</div>
              <div className="text-xs text-gray-600">{b.rarity}</div>
              {!unlocked && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm">
                  قفل
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CreatorBadges;
