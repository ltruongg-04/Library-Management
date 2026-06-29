"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Plus } from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import BorrowFilters from "@/components/features/luot-muon/BorrowFilters";
import BorrowModal from "@/components/features/luot-muon/BorrowModal";
import BorrowTable, { type BorrowRecord } from "@/components/features/luot-muon/BorrowTable";
import BorrowDetailModal from "@/components/features/luot-muon/BorrowDetailModal";
import { UI_TEXT } from "@/constants/ui-text";
import { getAdminBorrowOrders, AdminBorrowResponse, updateAdminBorrowStatus } from "@/services/adminBorrow";

const T = UI_TEXT.ADMIN_BORROW_MANAGEMENT.HEADER;

export default function LuotMuonPage() {
    const [openModal, setOpenModal] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [records, setRecords] = useState<BorrowRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const fetchBorrows = async () => {
        try {
            setIsLoading(true);
            const response = await getAdminBorrowOrders();
            if (response.success && response.data) {
                const mappedData: BorrowRecord[] = response.data.map((order) => {
                    // Map status to UI format
                    let statusValue = order.status.toLowerCase() as BorrowRecord["status"];
                    if (statusValue === "pending") statusValue = "pending" as any; // Or 'ready' if UI doesn't have pending

                    // Convert dates from YYYY-MM-DD to DD/MM/YYYY for UI
                    const formatDate = (dateStr: string | null) => {
                        if (!dateStr) return null;
                        const [year, month, day] = dateStr.split("-");
                        return `${day}/${month}/${year}`;
                    };

                    return {
                        id: order.id,
                        member: {
                            name: order.customerName,
                            code: order.customerCode,
                        },
                        book: {
                            title: order.bookTitle,
                            author: order.bookAuthor,
                        },
                        borrowDate: formatDate(order.borrowDate),
                        dueDate: formatDate(order.dueDate),
                        status: statusValue,
                        overdayCount: order.overdayCount ?? undefined,
                    };
                });
                setRecords(mappedData);
            }
        } catch (error) {
            console.error("Error fetching borrow orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBorrows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateAdminBorrowStatus(id, newStatus.toUpperCase());
            // Update local state if successful
            setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r)));
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            alert("Cập nhật trạng thái thất bại. Vui lòng thử lại!");
        }
    };

    const handleViewDetail = (id: string) => {
        setSelectedOrderId(id);
        setDetailModalOpen(true);
    };

    const handleApplyDates = (from: string, to: string) => {
        setDateFrom(from);
        setDateTo(to);
    };

    const parseDate = (ddmmyyyy: string | null) => {
        if (!ddmmyyyy) return null;
        const parts = ddmmyyyy.split("/");
        if (parts.length === 3) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
        return null;
    };

    // Filter records
    const filteredRecords = records.filter((r) => {
        const matchSearch =
            search.trim() === "" ||
            r.member.name.toLowerCase().includes(search.toLowerCase()) ||
            r.member.code.toLowerCase().includes(search.toLowerCase()) ||
            r.book.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === "" || r.status === status;

        let matchDate = true;
        const bDate = parseDate(r.borrowDate);
        if (bDate) {
            if (dateFrom) {
                const fromTime = new Date(dateFrom).getTime();
                if (bDate.getTime() < fromTime) matchDate = false;
            }
            if (dateTo) {
                const toTime = new Date(dateTo).getTime();
                if (bDate.getTime() > toTime) matchDate = false;
            }
        } else if (dateFrom || dateTo) {
            matchDate = false; // If filtering by date but record has no borrow date
        }

        return matchSearch && matchStatus && matchDate;
    });

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface text-on-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_BORROWS} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6">
                <div>
                    <h1 className="flex items-center gap-2 font-serif text-2xl font-bold text-ink-950">
                        <ClipboardList size={24} className="text-primary-600" />
                        {T.TITLE}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant">{T.DESCRIPTION}</p>
                </div>
                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-on-primary shadow-md transition-colors hover:bg-primary/90"
                >
                    <Plus size={20} />
                    {T.CREATE_BTN}
                </button>
            </div>

            <main className="flex flex-1 flex-col gap-lg overflow-auto p-8">
                {/* Filters */}
                <BorrowFilters search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} onApplyDates={handleApplyDates} />

                {/* Table */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : (
                    <BorrowTable records={filteredRecords} onStatusUpdate={handleStatusUpdate} onViewDetail={handleViewDetail} />
                )}

                <BorrowModal open={openModal} onClose={() => setOpenModal(false)} onSubmitSuccess={fetchBorrows} />
                <BorrowDetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} orderCode={selectedOrderId} />
            </main>
        </div>
    );
}
