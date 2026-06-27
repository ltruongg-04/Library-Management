import BookFilters from "@/components/features/admin/inventory/BookFilters";
import BookTable from "@/components/features/admin/inventory/BookTable";
import { ScanLine, Sparkles } from "lucide-react";
import { Suspense } from "react";

export default function KhoSachPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-primary-900 tracking-tight">Quản lý kho sách</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant">
            Quản lý các mục trong danh mục, giám sát tình trạng có sẵn và tận dụng tính năng quét AI để nhập liệu nhanh chóng.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center shrink-0 shadow-sm rounded-lg overflow-hidden">
          <button className="flex items-center gap-2 bg-primary-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-900 focus-ring">
            <ScanLine size={18} />
            Thêm sách
          </button>
          <button className="flex items-center gap-1.5 bg-info-400 px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-info-500 focus-ring border-l border-white/20">
            <Sparkles size={16} />
            AI OCR
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Filters and Search */}
        <Suspense fallback={<div className="mb-6 h-14 bg-surface-container-high rounded-xl animate-pulse"></div>}>
          <BookFilters />
        </Suspense>

        {/* Table View */}
        <Suspense fallback={<div className="min-h-[400px] bg-surface-container-high rounded-xl animate-pulse"></div>}>
          <BookTable />
        </Suspense>
      </div>
    </div>
  );
}
