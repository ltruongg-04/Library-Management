"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { BookOpen, Plus, QrCode, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import AddBookModal, { InitialBookData } from "@/components/features/admin/inventory/AddBookModal";
import BookCopiesModal from "@/components/features/admin/inventory/BookCopiesModal";
import BookFilters from "@/components/features/admin/inventory/BookFilters";
import BookScannerModal from "@/components/features/admin/inventory/BookScannerModal";
import BookTable from "@/components/features/admin/inventory/BookTable";
import ChooseAddMethodModal from "@/components/features/admin/inventory/ChooseAddMethodModal";
import { ADMIN, ADMIN_PAGES } from "@/constants/ui-text/admin";
import { adminRoleService } from "@/services/adminRole";

export default function KhoSachPage() {
    const { data: session } = useSession();
    const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scannedIsbn, setScannedIsbn] = useState<string | null>(null);
    const [initialBookData, setInitialBookData] = useState<InitialBookData | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

    // Copies Modal State
    const [copiesBookId, setCopiesBookId] = useState<number | null>(null);
    const [copiesBookTitle, setCopiesBookTitle] = useState<string>("");
    const [isCopiesModalOpen, setIsCopiesModalOpen] = useState(false);

    const handleManageCopies = (id: number, title: string) => {
        setCopiesBookId(id);
        setCopiesBookTitle(title);
        setIsCopiesModalOpen(true);
    };

    const isAdmin = session?.user?.role?.toUpperCase() === "ADMIN";
    const canAddBook = useMemo(() => isAdmin || permissions.includes("books.add-book"), [isAdmin, permissions]);
    const canEditBook = useMemo(() => isAdmin || permissions.includes("books.edit-book"), [isAdmin, permissions]);

    useEffect(() => {
        if (!session?.backendToken || isAdmin) {
            return;
        }

        let isMounted = true;
        adminRoleService
            .getMyPermissions()
            .then((nextPermissions) => {
                if (isMounted) {
                    setPermissions(nextPermissions);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setPermissions([]);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [isAdmin, session?.backendToken]);

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface dark:bg-slate-950">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={ADMIN.SIDEBAR.NAV_BOOKS} />
            </div>

            {/* Header Section */}
            <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-900">
                <div>
                    <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950 dark:text-white">
                        <BookOpen size={24} className="text-primary-600 dark:text-primary-400" />
                        {ADMIN.SIDEBAR.NAV_BOOKS}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant dark:text-slate-400">{ADMIN_PAGES.INVENTORY.PAGE_DESC}</p>
                </div>

                {/* Action Buttons */}
                {canAddBook && (
                    <div className="flex shrink-0 items-center overflow-hidden rounded-lg shadow-sm">
                        <button
                            onClick={() => {
                                setScannedIsbn(null);
                                setIsChooseModalOpen(true);
                            }}
                            className="focus-ring flex items-center gap-2 bg-primary-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-900"
                        >
                            <Plus size={18} />
                            {ADMIN.SIDEBAR.ADD_BOOK}
                        </button>
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="focus-ring bg-secondary-700 hover:bg-secondary-800 flex items-center gap-1.5 border-l border-white/20 px-4 py-2.5 text-[14px] font-bold text-white transition-colors"
                            title={ADMIN_PAGES.INVENTORY.SCAN_QR_BTN}
                        >
                            <QrCode size={16} />
                            {ADMIN_PAGES.INVENTORY.SCAN_QR_BTN}
                        </button>
                        <button className="focus-ring flex items-center gap-1.5 border-l border-white/20 bg-info-400 px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-info-500">
                            <Sparkles size={16} />
                            {ADMIN_PAGES.INVENTORY.AI_OCR_BTN}
                        </button>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col space-y-6 p-8">
                {/* Filters and Search */}
                <Suspense fallback={<div className="h-14 animate-pulse rounded-xl bg-surface-container-high dark:bg-slate-800"></div>}>
                    <BookFilters />
                </Suspense>

                {/* Table View */}
                <Suspense fallback={<div className="min-h-[400px] animate-pulse rounded-xl bg-surface-container-high dark:bg-slate-800"></div>}>
                    <BookTable canEditBook={canEditBook} onManageCopies={handleManageCopies} refreshKey={refreshKey} />
                </Suspense>
            </div>

            {isChooseModalOpen && (
                <ChooseAddMethodModal
                    isOpen={isChooseModalOpen}
                    initialIsbn={scannedIsbn || undefined}
                    autoSearch={!!scannedIsbn}
                    onClose={() => {
                        setIsChooseModalOpen(false);
                        setScannedIsbn(null);
                    }}
                    onSelectManual={() => {
                        setIsChooseModalOpen(false);
                        setScannedIsbn(null);
                        setInitialBookData(null);
                        setIsAddModalOpen(true);
                    }}
                    onSelectAutofill={(data) => {
                        setIsChooseModalOpen(false);
                        setScannedIsbn(null);
                        setInitialBookData(data);
                        setIsAddModalOpen(true);
                    }}
                    onManageCopies={(id, title) => {
                        setIsChooseModalOpen(false);
                        setScannedIsbn(null);
                        handleManageCopies(id, title);
                    }}
                    onSuccess={() => {
                        triggerRefresh();
                    }}
                />
            )}

            {isScannerOpen && (
                <BookScannerModal
                    isOpen={isScannerOpen}
                    onClose={() => setIsScannerOpen(false)}
                    onScanSuccess={(isbn) => {
                        setIsScannerOpen(false);
                        setScannedIsbn(isbn);
                        setIsChooseModalOpen(true);
                    }}
                />
            )}

            {isAddModalOpen && (
                <AddBookModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => {
                        triggerRefresh();
                    }}
                    initialData={initialBookData}
                    onManageCopies={(id, title) => {
                        setIsAddModalOpen(false);
                        handleManageCopies(id, title);
                    }}
                />
            )}

            {isCopiesModalOpen && copiesBookId !== null && (
                <BookCopiesModal
                    bookId={copiesBookId}
                    bookTitle={copiesBookTitle}
                    isOpen={isCopiesModalOpen}
                    onClose={() => setIsCopiesModalOpen(false)}
                    onSuccess={() => {
                        triggerRefresh();
                    }}
                />
            )}
        </div>
    );
}
