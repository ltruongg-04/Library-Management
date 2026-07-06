"use client";

import { Suspense, useState } from "react";
import { BookOpen, Plus, Sparkles } from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import AddBookModal, { InitialBookData } from "@/components/features/admin/inventory/AddBookModal";
import BookFilters from "@/components/features/admin/inventory/BookFilters";
import BookTable from "@/components/features/admin/inventory/BookTable";
import ChooseAddMethodModal from "@/components/features/admin/inventory/ChooseAddMethodModal";
import { ADMIN, ADMIN_PAGES } from "@/constants/ui-text/admin";

export default function KhoSachPage() {
    const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [initialBookData, setInitialBookData] = useState<InitialBookData | null>(null);

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={ADMIN.SIDEBAR.NAV_BOOKS} />
            </div>

            {/* Header Section */}
            <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6">
                <div>
                    <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">
                        <BookOpen size={24} className="text-primary-600" />
                        {ADMIN.SIDEBAR.NAV_BOOKS}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant">{ADMIN_PAGES.INVENTORY.PAGE_DESC}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-center overflow-hidden rounded-lg shadow-sm">
                    <button
                        onClick={() => setIsChooseModalOpen(true)}
                        className="focus-ring flex items-center gap-2 bg-primary-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-900"
                    >
                        <Plus size={18} />
                        {ADMIN.SIDEBAR.ADD_BOOK}
                    </button>
                    <button className="focus-ring flex items-center gap-1.5 border-l border-white/20 bg-info-400 px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-info-500">
                        <Sparkles size={16} />
                        {ADMIN_PAGES.INVENTORY.AI_OCR_BTN}
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col space-y-6 p-8">
                {/* Filters and Search */}
                <Suspense fallback={<div className="h-14 animate-pulse rounded-xl bg-surface-container-high"></div>}>
                    <BookFilters />
                </Suspense>

                {/* Table View */}
                <Suspense fallback={<div className="min-h-[400px] animate-pulse rounded-xl bg-surface-container-high"></div>}>
                    <BookTable />
                </Suspense>
            </div>

            {isChooseModalOpen && (
                <ChooseAddMethodModal
                    isOpen={isChooseModalOpen}
                    onClose={() => setIsChooseModalOpen(false)}
                    onSelectManual={() => {
                        setIsChooseModalOpen(false);
                        setInitialBookData(null);
                        setIsAddModalOpen(true);
                    }}
                    onSelectAutofill={(data) => {
                        setIsChooseModalOpen(false);
                        setInitialBookData(data);
                        setIsAddModalOpen(true);
                    }}
                />
            )}

            {isAddModalOpen && (
                <AddBookModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => {
                        window.location.reload();
                    }}
                    initialData={initialBookData}
                />
            )}
        </div>
    );
}
