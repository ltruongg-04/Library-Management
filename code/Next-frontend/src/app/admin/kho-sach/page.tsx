"use client";

import { Suspense, useState } from "react";
import { ScanLine, Sparkles } from "lucide-react";
import AddBookModal from "@/components/features/admin/inventory/AddBookModal";
import BookFilters from "@/components/features/admin/inventory/BookFilters";
import BookTable from "@/components/features/admin/inventory/BookTable";
import { ADMIN, ADMIN_PAGES } from "@/constants/ui-text/admin";

export default function KhoSachPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                    <h1 className="text-3xl font-bold tracking-tight text-primary-900">{ADMIN.SIDEBAR.NAV_BOOKS}</h1>
                    <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant">{ADMIN_PAGES.INVENTORY.PAGE_DESC}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-center overflow-hidden rounded-lg shadow-sm">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="focus-ring flex items-center gap-2 bg-primary-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-900"
                    >
                        <ScanLine size={18} />
                        {ADMIN.SIDEBAR.ADD_BOOK}
                    </button>
                    <button className="focus-ring flex items-center gap-1.5 border-l border-white/20 bg-info-400 px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-info-500">
                        <Sparkles size={16} />
                        {ADMIN_PAGES.INVENTORY.AI_OCR_BTN}
                    </button>
                </div>
            </div>

            <div className="flex flex-col">
                {/* Filters and Search */}
                <Suspense fallback={<div className="mb-6 h-14 animate-pulse rounded-xl bg-surface-container-high"></div>}>
                    <BookFilters />
                </Suspense>

                {/* Table View */}
                <Suspense fallback={<div className="min-h-[400px] animate-pulse rounded-xl bg-surface-container-high"></div>}>
                    <BookTable />
                </Suspense>
            </div>

            {isAddModalOpen && (
                <AddBookModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => {
                        // Dùng window.location.reload() hoặc cập nhật global state nếu có,
                        // ở đây tạm reload trang để reset lại dữ liệu bảng
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
