"use client";
import React from "react";
import type { CreatorContent } from "@/types/creator";

interface ContentGridProps {
  content: CreatorContent[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  dir?: "ltr" | "rtl";
}

export function ContentGrid({
  content = [],
  onEdit,
  onDelete,
  dir = "rtl",
}: ContentGridProps) {
  return (
    <div dir={dir} className="">
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
        {content.map((c) => (
          <div
            key={c._id}
            className="mb-4 break-inside-avoid rounded overflow-hidden border bg-white"
          >
            {c.media?.[0]?.url && (
              <img
                src={c.media[0].url}
                alt={c.media[0].alt || c.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-3">
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-gray-500">
                {c.views} بازدید • {c.likes} لایک
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onEdit && onEdit(c._id)}
                  className="text-sm px-2 py-1 bg-green-50 rounded"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => onDelete && onDelete(c._id)}
                  className="text-sm px-2 py-1 bg-red-50 rounded"
                >
                  حذف
                </button>
                <div className="ml-auto text-xs text-gray-600">{c.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentGrid;
