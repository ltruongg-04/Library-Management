"use client";

import { useEffect, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, Eye, Mail, PackageCheck, X } from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE;

export type BorrowStatus = "borrowed" | "overdue" | "ready" | "returned" | "pending" | "pending_renewal";

export type BorrowRecord = {
    id: string;
    member: {
        name: string;
        code: string;
        avatarUrl?: string;
        avatarInitials?: string;
        avatarColor?: "secondary" | "tertiary" | "primary";
    };
    book: {
        title: string;
        author: string;
        coverUrl?: string;
    };
    borrowDate: string | null;
    dueDate: string | null;
    status: BorrowStatus;
    overdayCount?: number;
};

function StatusBadge({ status, overdayCount }: { status: BorrowStatus; overdayCount?: number }) {
    switch (status) {
        case "borrowed":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary-fixed bg-secondary-fixed/50 px-2.5 py-1 text-xs font-medium text-on-secondary-container">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {T.STATUS_BORROWED}
                </span>
            );
        case "overdue":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-error-container bg-error-container/50 px-2.5 py-1 text-xs font-medium text-error">
                    <span className="h-1.5 w-1.5 rounded-full bg-error" />
                    {T.STATUS_OVERDUE}
                    {overdayCount ? ` (${overdayCount} ngày)` : ""}
                </span>
            );
        case "ready":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/50 bg-surface-container-high px-2.5 py-1 text-xs font-medium text-on-surface">
                    <span className="h-1.5 w-1.5 rounded-full bg-outline" />
                    {T.STATUS_READY}
                </span>
            );
        case "returned":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container px-2.5 py-1 text-xs font-medium text-on-surface-variant">
                    <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
                    {T.STATUS_RETURNED}
                </span>
            );
        case "pending":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-tertiary-fixed bg-tertiary-fixed/20 px-2.5 py-1 text-xs font-medium text-on-tertiary-fixed-variant">
                    <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                    {T.STATUS_PENDING}
                </span>
            );
        case "pending_renewal":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {T.STATUS_PENDING_RENEWAL || "Chờ duyệt gia hạn"}
                </span>
            );
        default:
            return null;
    }
}

function ActionButtons({
    id,
    status,
    onStatusUpdate,
    onViewDetail,
    onRenewalUpdate,
}: {
    id: string;
    status: BorrowStatus;
    onStatusUpdate: (newStatus: BorrowStatus) => void;
    onViewDetail?: (id: string) => void;
    onRenewalUpdate?: (id: string, approved: boolean) => void;
}) {
    return (
        <div className="flex justify-end gap-1 transition-opacity">
            {/* View detail — available for all */}
            <button
                onClick={() => onViewDetail?.(id)}
                className="rounded p-1.5 text-secondary transition-colors hover:bg-secondary-fixed/50"
                title={T.BTN_VIEW}
            >
                <Eye size={20} />
            </button>
            {/* Context-specific action */}
            {status === "pending" && (
                <button
                    onClick={() => onStatusUpdate("ready")}
                    className="rounded p-1.5 text-primary transition-colors hover:bg-primary-fixed/50"
                    title="Duyệt đơn (Chuyển sang Chờ lấy)"
                >
                    <CheckCircle size={20} />
                </button>
            )}
            {status === "borrowed" && (
                <button
                    onClick={() => onStatusUpdate("returned")}
                    className="rounded p-1.5 text-primary transition-colors hover:bg-primary-fixed/50"
                    title={T.BTN_RETURN}
                >
                    <CheckCircle size={20} />
                </button>
            )}
            {status === "overdue" && (
                <button className="rounded p-1.5 text-error transition-colors hover:bg-error-container/50" title={T.BTN_REMIND}>
                    <Mail size={20} />
                </button>
            )}
            {status === "ready" && (
                <button
                    onClick={() => onStatusUpdate("borrowed")}
                    className="rounded p-1.5 text-primary transition-colors hover:bg-primary-fixed/50"
                    title={T.BTN_CONFIRM_HANDOVER}
                >
                    <PackageCheck size={20} />
                </button>
            )}
            {status === "pending_renewal" && (
                <>
                    <button
                        onClick={() => onRenewalUpdate?.(id, true)}
                        className="text-success hover:bg-success-container/50 rounded p-1.5 transition-colors"
                        title="Duyệt gia hạn"
                    >
                        <CheckCircle size={20} />
                    </button>
                    <button
                        onClick={() => onRenewalUpdate?.(id, false)}
                        className="rounded p-1.5 text-error transition-colors hover:bg-error-container/50"
                        title="Từ chối gia hạn"
                    >
                        <X size={20} />
                    </button>
                </>
            )}
        </div>
    );
}

const AVATAR_COLORS: Record<string, string> = {
    secondary: "bg-secondary-container/20 text-secondary",
    tertiary: "bg-tertiary-container/20 text-tertiary",
    primary: "bg-primary-container/20 text-primary",
};

export default function BorrowTable({
    records,
    onStatusUpdate,
    onViewDetail,
    onRenewalUpdate,
    loading,
    error,
}: {
    records: BorrowRecord[];
    onStatusUpdate?: (id: string, newStatus: BorrowStatus) => void;
    onViewDetail?: (id: string) => void;
    onRenewalUpdate?: (id: string, approved: boolean) => void;
    loading?: boolean;
    error?: string | null;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [records]);

    const totalPages = Math.max(1, Math.ceil(records.length / ITEMS_PER_PAGE));
    const paginatedRecords = records.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="level-1-shadow flex flex-1 flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    {/* Header */}
                    <thead className="border-b border-outline-variant/30 bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant">
                        <tr>
                            <th className="w-[250px] min-w-[250px] px-6 py-4 font-medium">{T.COL_MEMBER}</th>
                            <th className="w-[300px] min-w-[300px] px-6 py-4 font-medium">{T.COL_BOOK}</th>
                            <th className="w-[150px] min-w-[150px] px-6 py-4 font-medium">{T.COL_BORROW_DATE}</th>
                            <th className="w-[150px] min-w-[150px] px-6 py-4 font-medium">{T.COL_DUE_DATE}</th>
                            <th className="w-[150px] min-w-[150px] px-6 py-4 font-medium">{T.COL_STATUS}</th>
                            <th className="w-[120px] min-w-[120px] px-6 py-4 text-right font-medium">{T.COL_ACTIONS}</th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-outline-variant/20">
                        {loading ? (
                            <TableSkeleton columns={6} rows={5} />
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-error">
                                    <p>{error}</p>
                                </td>
                            </tr>
                        ) : paginatedRecords.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-outline-variant">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <PackageCheck size={32} className="text-outline-variant" />
                                        <p>{T.EMPTY_STATE}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedRecords.map((rec) => (
                                <tr key={rec.id} className="group transition-colors hover:bg-surface-container-low/50">
                                    {/* Member */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {rec.member.avatarUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={rec.member.avatarUrl}
                                                    alt={rec.member.name}
                                                    className="h-8 w-8 rounded-full border border-outline-variant/30 object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                                        AVATAR_COLORS[rec.member.avatarColor ?? "secondary"]
                                                    }`}
                                                >
                                                    {rec.member.avatarInitials}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-on-background">{rec.member.name}</p>
                                                <p className="font-label-caps text-xs text-on-surface-variant">{rec.member.code}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Book */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-surface-variant shadow-sm">
                                                {rec.book.coverUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={rec.book.coverUrl} alt={rec.book.title} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-outline-variant">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="max-w-[200px]">
                                                <p className="truncate font-medium text-on-background">{rec.book.title}</p>
                                                <p className="truncate text-xs text-on-surface-variant">{rec.book.author}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Borrow date */}
                                    <td className={`px-6 py-4 ${rec.borrowDate ? "text-on-surface" : "italic text-on-surface-variant"}`}>
                                        {rec.borrowDate ?? T.NO_DATE}
                                    </td>

                                    {/* Due date */}
                                    <td
                                        className={`px-6 py-4 ${
                                            rec.status === "overdue"
                                                ? "font-medium text-error"
                                                : rec.dueDate
                                                  ? "text-on-surface"
                                                  : "italic text-on-surface-variant"
                                        }`}
                                    >
                                        {rec.dueDate ?? T.NO_DATE}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <StatusBadge status={rec.status} overdayCount={rec.overdayCount} />
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end">
                                            <ActionButtons
                                                id={rec.id}
                                                status={rec.status}
                                                onStatusUpdate={(newStatus) => onStatusUpdate?.(rec.id, newStatus)}
                                                onViewDetail={onViewDetail}
                                                onRenewalUpdate={onRenewalUpdate}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-lowest px-6 py-4">
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {UI_TEXT.ADMIN_BORROW_MANAGEMENT.FILTERS.PAGINATION_PAGE} {currentPage} / {totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
