"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/base/material-icon";
import { LoanCard } from "@/components/features/history/LoanCard";
import { LoanFilter } from "@/components/features/history/LoanFilter";
import { MY_BOOKS_PAGE } from "@/constants/ui-text/public";
import { type UserBorrowHistoryItem, userBorrowService } from "@/services/userBorrow";

export default function MyBooksPage() {
    const [loans, setLoans] = useState<UserBorrowHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(MY_BOOKS_PAGE.FILTER.STATUS_ALL);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [appliedFilter, setAppliedFilter] = useState({
        status: MY_BOOKS_PAGE.FILTER.STATUS_ALL,
        start: "",
        end: "",
    });

    const fetchLoans = useCallback(async () => {
        try {
            setLoading(true);
            const result = await userBorrowService.getHistory(0, 50);
            setLoans(result.content);
        } catch {
            // Nếu chưa đăng nhập hoặc chưa có customer profile, hiện danh sách trống
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
    };

    const handleCancel = (orderCode: string) => {
        setLoans((prev) => prev.map((loan) => (loan.orderCode === orderCode ? { ...loan, status: "CANCELLED" } : loan)));
        toast.success("Đã huỷ đặt giữ chỗ thành công!");
    };

    const mapStatusToFilter = (status: string): string => {
        const statusMap: Record<string, string> = {
            PENDING: "pending",
            READY: "pending",
            BORROWED: "borrowing",
            RETURNED: "returned",
            OVERDUE: "overdue",
            CANCELLED: "cancelled",
        };
        return statusMap[status] || status.toLowerCase();
    };

    const parseDate = (dateStr: string) => {
        if (!dateStr) return null;
        // Backend trả về ISO format: yyyy-MM-dd
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
                    {filteredLoans.map((loan) => (
                        <LoanCard key={loan.orderCode} loan={loan} onCancel={() => handleCancel(loan.orderCode)} />
                    ))}
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
