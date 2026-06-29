"use client";

import { useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import BorrowFilters from "@/components/features/luot-muon/BorrowFilters";
import BorrowModal from "@/components/features/luot-muon/BorrowModal";
import BorrowTable, { type BorrowRecord } from "@/components/features/luot-muon/BorrowTable";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN_BORROW_MANAGEMENT.HEADER;

const MOCK_RECORDS: BorrowRecord[] = [
    {
        id: "BW-001",
        member: {
            name: "Nguyễn Văn Hải",
            code: "#MB-0921",
            avatarInitials: "NH",
            avatarColor: "secondary",
        },
        book: {
            title: "The Design of Everyday Things",
            author: "Don Norman",
        },
        borrowDate: "12/10/2024",
        dueDate: "26/10/2024",
        status: "borrowed",
    },
    {
        id: "BW-002",
        member: {
            name: "Trần Thị Minh",
            code: "#MB-1102",
        },
        book: {
            title: "Neuromancer",
            author: "William Gibson",
        },
        borrowDate: "01/10/2024",
        dueDate: "15/10/2024",
        status: "overdue",
        overdayCount: 2,
    },
    {
        id: "BW-003",
        member: {
            name: "Lê Tuấn Khang",
            code: "#MB-0844",
            avatarInitials: "LK",
            avatarColor: "tertiary",
        },
        book: {
            title: "Clean Code: A Handbook",
            author: "Robert C. Martin",
        },
        borrowDate: null,
        dueDate: null,
        status: "ready",
    },
];

export default function LuotMuonPage() {
    const [openModal, setOpenModal] = useState(false);
    const [records, setRecords] = useState<BorrowRecord[]>(MOCK_RECORDS);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const handleStatusUpdate = (id: string, newStatus: string) => {
        setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r)));
    };

    const handleCreateRecord = (newRecord: Partial<BorrowRecord>) => {
        const fullRecord: BorrowRecord = {
            id: `BW-${String(records.length + 1).padStart(3, "0")}`,
            ...newRecord,
        } as BorrowRecord;
        setRecords([fullRecord, ...records]);
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
                    <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">
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
                <BorrowTable records={filteredRecords} onStatusUpdate={handleStatusUpdate} />

                <BorrowModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleCreateRecord} />
            </main>
        </div>
    );
}
