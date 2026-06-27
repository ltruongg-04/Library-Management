"use client";

import { Sparkles, ChevronDown } from "lucide-react";

export default function BookFilters() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-surface-container-high bg-white p-2 shadow-sm">
      {/* Search Input */}
      <div className="flex flex-1 items-center gap-2 rounded-lg bg-surface px-3 py-2 text-on-surface-variant focus-within:ring-2 focus-within:ring-primary-500/20">
        <Sparkles size={18} className="text-secondary-300" />
        <input
          type="text"
          placeholder="Tìm kiếm ngữ nghĩa theo tiêu đề, tác giả hoặc chủ đề..."
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-outline-variant"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 pr-2">
        {/* Status Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 rounded-lg border border-surface-container-high px-3 py-1.5 text-[14px] font-medium text-on-surface hover:bg-surface">
            <span className="text-on-surface-variant">Trạng thái:</span> Tất cả
            <ChevronDown size={14} className="text-outline" />
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 rounded-lg border border-surface-container-high px-3 py-1.5 text-[14px] font-medium text-on-surface hover:bg-surface">
            <span className="text-on-surface-variant">Thể loại:</span> Tất cả
            <ChevronDown size={14} className="text-outline" />
          </button>
        </div>
      </div>
    </div>
  );
}
