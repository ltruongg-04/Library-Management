"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import { LoanCard } from "@/components/features/history/LoanCard";
import { LoanFilter } from "@/components/features/history/LoanFilter";
import { MY_BOOKS_PAGE } from "@/constants/ui-text/public";
import { MOCK_LOANS } from "@/mocks/loans";

export default function MyBooksPage() {
    const [statusFilter, setStatusFilter] = useState(MY_BOOKS_PAGE.FILTER.STATUS_ALL);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [appliedFilter, setAppliedFilter] = useState({
        status: MY_BOOKS_PAGE.FILTER.STATUS_ALL,
        start: "",
        end: "",
    });

    const handleApplyFilter = () => {
        setAppliedFilter({
            status: statusFilter,
            start: startDate,
            end: endDate,
        });
    };

    const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/");
        return new Date(Number(year), Number(month) - 1, Number(day));
    };

    const filteredLoans = MOCK_LOANS.filter((loan) => {
        // Status filter
        let statusMatch = true;
        if (appliedFilter.status !== MY_BOOKS_PAGE.FILTER.STATUS_ALL) {
            switch (appliedFilter.status) {
                case MY_BOOKS_PAGE.FILTER.STATUS_BORROWING:
                    statusMatch = loan.status === "borrowing";
                    break;
                case MY_BOOKS_PAGE.FILTER.STATUS_RETURNED:
                    statusMatch = loan.status === "returned";
                    break;
                case MY_BOOKS_PAGE.FILTER.STATUS_OVERDUE:
                    statusMatch = loan.status === "overdue";
                    break;
                case MY_BOOKS_PAGE.FILTER.STATUS_PENDING:
                    statusMatch = loan.status === ("pending" as any);
                    break;
                case MY_BOOKS_PAGE.FILTER.STATUS_CANCELLED:
                    statusMatch = loan.status === ("cancelled" as any);
                    break;
            }
        }

        // Date filter
        let dateMatch = true;
        const loanDate = parseDate(loan.borrowDate);
        if (appliedFilter.start) {
            const start = new Date(appliedFilter.start);
            if (loanDate < start) dateMatch = false;
        }
        if (appliedFilter.end) {
            const end = new Date(appliedFilter.end);
            if (loanDate > end) dateMatch = false;
        }

        return statusMatch && dateMatch;
    });

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
                        <LoanCard key={loan.id} loan={loan} />
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
