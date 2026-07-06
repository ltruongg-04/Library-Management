"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/base/material-icon";
import { LoanCard } from "@/components/features/history/LoanCard";
import { LoanFilter } from "@/components/features/history/LoanFilter";
import { MY_BOOKS_PAGE } from "@/constants/ui-text/public/my-books";
import { API_SUCCESS } from "@/constants/ui-text/shared/api";
import { getBorrowHistory } from "@/services/borrow";
import { type UserBorrowHistoryItem } from "@/services/userBorrow";

export default function MyBooksPage() {
    const [loans, setLoans] = useState<UserBorrowHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(MY_BOOKS_PAGE.FILTER.STATUS_ALL);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const [appliedFilter, setAppliedFilter] = useState({
        status: MY_BOOKS_PAGE.FILTER.STATUS_ALL,
        start: "",
        end: "",
    });

    const fetchLoans = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getBorrowHistory();
            if (response.success && response.data) {
                const mappedData = response.data.map((item: any) => ({
                    id: 0,
                    orderCode: item.id,
                    status: item.status.toLowerCase(),
                    borrowDate: item.borrowDate,
                    pickupDate: item.borrowDate,
                    dueDate: item.dueDate,
                    actualReturnDate: item.actualReturnDate,
                    totalDeposit: parseFloat((item.deposit || "0").replace(/[^0-9]/g, "")),
                    bookTitle: item.title,
                    bookAuthor: item.author,
                    bookCoverImage: item.imgSrc,
                }));
                setLoans(mappedData);
            } else {
                setLoans([]);
            }
        } catch {
            setLoans([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const handleApplyFilter = () => {
        setAppliedFilter({
            status: statusFilter,
            start: startDate,
            end: endDate,
        });
        setCurrentPage(1);
    };

    const handleCancel = (orderCode: string) => {
        setLoans((prev) => prev.map((loan) => (loan.orderCode === orderCode ? { ...loan, status: "CANCELLED" } : loan)));
        toast.success(API_SUCCESS.HOLD_CANCEL_SUCCESS);
    };

    const mapStatusToFilter = (status: string): string => {
        const statusMap: Record<string, string> = {
            pending: "pending",
            ready: "pending",
            borrowing: "borrowing",
            borrowed: "borrowing",
            returned: "returned",
            overdue: "overdue",
            cancelled: "cancelled",
        };
        return statusMap[status.toLowerCase()] || status.toLowerCase();
    };

    const parseDate = (dateStr: string) => {
        if (!dateStr) return null;
        // Backend now returns dd/MM/yyyy
        const parts = dateStr.split("/");
        if (parts.length === 3) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
        return new Date(dateStr);
    };

    const filteredLoans = loans.filter((loan) => {
        // Status filter
        let statusMatch = true;
        if (appliedFilter.status !== MY_BOOKS_PAGE.FILTER.STATUS_ALL) {
            const mappedStatus = mapStatusToFilter(loan.status);
            switch (appliedFilter.status) {
                case MY_BOOKS_PAGE.FILTER.STATUS_BORROWING:
                    statusMatch = mappedStatus === "borrowing";
                    break;
                case MY_BOOKS_PAGE.FILTER.STATUS_RETURNED:
                    statusMatch = mappedStatus === "returned";
                    break;
                case MY_BOOKS_PAGE.FILTER.STATUS_OVERDUE:
                    statusMatch = mappedStatus === "overdue";
                    break;
                case MY_BOOKS_PAGE.FILTER.STATUS_PENDING:
                    statusMatch = mappedStatus === "pending";
                    break;
                case MY_BOOKS_PAGE.FILTER.STATUS_CANCELLED:
                    statusMatch = mappedStatus === "cancelled";
                    break;
            }
        }

        // Date filter
        let dateMatch = true;
        const loanDate = parseDate(loan.borrowDate);
        if (loanDate) {
            if (appliedFilter.start) {
                const start = new Date(appliedFilter.start);
                if (loanDate < start) dateMatch = false;
            }
            if (appliedFilter.end) {
                const end = new Date(appliedFilter.end);
                if (loanDate > end) dateMatch = false;
            }
        }

        return statusMatch && dateMatch;
    });

    const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);
    const paginatedLoans = filteredLoans.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    if (loading) {
        return (
            <div className="mx-auto max-w-container-max px-lg pb-xl pt-6">
                <div className="flex items-center justify-center py-24">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-container-max px-lg pb-xl pt-6">
            {/* Title & Breadcrumb */}
            <div className="mb-lg">
                <div className="mb-sm flex items-center gap-xs text-body-sm text-on-surface-variant dark:text-slate-400">
                    <span>{MY_BOOKS_PAGE.BREADCRUMB_ACCOUNT}</span>
                    <span className="material-symbols-outlined text-[16px]">{"chevron_right"}</span>
                    <span className="font-medium text-primary dark:text-primary-300">{MY_BOOKS_PAGE.TITLE}</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-primary dark:text-white">{MY_BOOKS_PAGE.TITLE}</h1>
            </div>

            {/* Filter Bar */}
            <LoanFilter
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onApply={handleApplyFilter}
            />

            {/* Content Area */}
            {filteredLoans.length > 0 ? (
                <div className="space-y-md" id="loan-list-container">
                    {paginatedLoans.map((loan) => (
                        <LoanCard key={loan.orderCode} loan={loan} onCancel={() => handleCancel(loan.orderCode)} />
                    ))}
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-xl flex items-center justify-center gap-sm">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface transition-colors hover:bg-surface-container disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                            >
                                <MaterialIcon name="chevron_left" />
                            </button>
                            <span className="font-body-md text-on-surface-variant dark:text-slate-400">
                                {MY_BOOKS_PAGE.PAGINATION_PAGE} {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface transition-colors hover:bg-surface-container disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                            >
                                <MaterialIcon name="chevron_right" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mx-auto flex max-w-md flex-col items-center justify-center py-24 text-center" id="empty-state">
                    <div className="mb-lg flex h-32 w-32 items-center justify-center rounded-full bg-surface-container dark:bg-slate-800">
                        <MaterialIcon name="auto_stories" className="text-[64px] text-outline" style={{ fontVariationSettings: "'wght' 200" }} />
                    </div>
                    <h2 className="mb-sm font-title-md text-title-md text-on-surface dark:text-white">{MY_BOOKS_PAGE.FILTER_EMPTY_STATE.HEADING}</h2>
                    <p className="mb-xl text-body-md text-on-surface-variant dark:text-slate-400">{MY_BOOKS_PAGE.FILTER_EMPTY_STATE.DESC}</p>
                </div>
            )}
        </div>
    );
}
