"use client";
import React, { useState } from "react";
import type { ContentType } from "@/types/creator";

interface ContentEditorProps {
  onSubmit: (data: any) => Promise<void> | void;
  templates?: any[];
  dir?: "ltr" | "rtl";
}

export function ContentEditor({
  onSubmit,
  templates = [],
  dir = "rtl",
}: ContentEditorProps) {
  const [type, setType] = useState<ContentType>("meme");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ type, title, description, media: [] });
      setTitle("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      dir={dir}
      onSubmit={handleSubmit}
      className="bg-white rounded p-4 border"
    >
      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">نوع محتوا</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ContentType)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="meme">میم</option>
          <option value="analysis">تحلیل</option>
          <option value="highlight">درخشش</option>
          <option value="prediction">پیش‌بینی</option>
          <option value="quiz">کوییز</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">عنوان</label>
        <input
          dir="rtl"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">توضیحات</label>
        <textarea
          dir="rtl"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-2 py-1"
          rows={4}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={submitting}
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          ارسال
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setDescription("");
          }}
          className="px-4 py-2 bg-gray-100 rounded"
        >
          لغو
        </button>
      </div>
    </form>
  );
}

export default ContentEditor;
