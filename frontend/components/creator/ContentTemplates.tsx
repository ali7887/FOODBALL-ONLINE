"use client";
import React from "react";
import type { ContentTemplate } from "@/lib/creator/templates";

interface ContentTemplatesProps {
  templates: ContentTemplate[];
  onSelect?: (templateId: string) => void;
  dir?: "ltr" | "rtl";
}

export function ContentTemplates({
  templates = [],
  onSelect,
  dir = "rtl",
}: ContentTemplatesProps) {
  return (
    <div dir={dir} className="bg-white rounded p-4 border">
      <h4 className="font-semibold mb-3">قالب‌ها</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((t) => (
          <div key={t.id} className="p-3 border rounded">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{t.icon}</div>
              <div>
                <div className="font-medium">{t.nameFA || t.name}</div>
                <div className="text-xs text-gray-500">
                  {t.descriptionFA || t.description}
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => onSelect && onSelect(t.id)}
                className="px-2 py-1 bg-emerald-50 rounded"
              >
                انتخاب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentTemplates;
