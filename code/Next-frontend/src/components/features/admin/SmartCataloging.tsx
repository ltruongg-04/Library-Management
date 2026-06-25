"use client";

import { useState, useCallback } from "react";
import { ScanLine, UploadCloud, PenLine } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const { SMART_CATALOGING } = UI_TEXT.ADMIN;

export default function SmartCataloging() {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="rounded-xl border border-ink-950/[0.06] bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <ScanLine size={17} className="text-brass-600" strokeWidth={2.25} />
        <h2 className="font-serif text-[16px] font-semibold text-ink-950">
          {SMART_CATALOGING.TITLE}
        </h2>
      </div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-950/50">
        {SMART_CATALOGING.SUBTITLE}
      </p>

      <label
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`focus-ring mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 text-center transition-colors ${
          isDragging
            ? "border-brass-500 bg-brass-500/5"
            : "border-ink-950/15 bg-parchment-50/60 hover:border-ink-950/25 hover:bg-parchment-50"
        }`}
      >
        <input type="file" className="sr-only" accept="image/*" />
        <div className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-card">
          <UploadCloud size={19} className="text-ink-950/40" strokeWidth={1.75} />
        </div>
        <p className="text-[13px] font-medium text-ink-950/60">
          {SMART_CATALOGING.DRAG_DROP}
        </p>
        <p className="text-[12px] text-ink-950/35">{SMART_CATALOGING.OR_CLICK}</p>
      </label>

      <button className="focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-ink-950/10 py-2.5 text-[13px] font-medium text-ink-950/60 transition-colors hover:bg-ink-950/[0.03] hover:text-ink-950">
        <PenLine size={14} strokeWidth={2} />
        {SMART_CATALOGING.MANUAL_ENTRY}
      </button>
    </div>
  );
}
