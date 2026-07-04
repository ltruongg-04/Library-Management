"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import { RENEW_PAGE } from "@/constants/ui-text/public";
import { type UserBorrowDetail, userBorrowService } from "@/services/userBorrow";

const RENEWAL_OPTIONS = [
    { days: 7, fee: 10000 },
    { days: 14, fee: 20000 },
];

const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("vi-VN")}đ`;
};

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "—";
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
        return dateStr;
    }
};

export default function RenewBookPage() {
    const params = useParams();
    const id = params?.id as string;
    const [loan, setLoan] = useState<UserBorrowDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDuration, setSelectedDuration] = useState(RENEWAL_OPTIONS[0].days);

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);
            const detail = await userBorrowService.getDetail(id);
            setLoan(detail);
        } catch {
            setLoan(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchDetail();
        }
    }, [id, fetchDetail]);

    if (loading) {
        return (
            <div className="mx-auto max-w-container-max px-lg pb-xl pt-6">
                <div className="flex items-center justify-center py-24">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (!loan) {
        return (
            <div className="mx-auto max-w-container-max px-lg pb-xl pt-6">
                <p className="py-24 text-center text-on-surface-variant dark:text-slate-400">{RENEW_PAGE.NOT_FOUND}</p>
            </div>
        );
    }

    const currentLateFee = loan.lateFee || 0;
    const initialDeposit = loan.totalDeposit || 0;
    const selectedOption = RENEWAL_OPTIONS.find((opt) => opt.days === selectedDuration)!;
    const totalNewCost = currentLateFee + selectedOption.fee;

    // Calculate overdue days
    let overdueDays = 0;
    if (loan.dueDate) {
        const dueDate = new Date(loan.dueDate);
        const now = new Date();
        const diff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 0) overdueDays = diff;
    }

    return (
        <div className="mx-auto max-w-container-max px-lg pb-xl pt-6">
            {/* Breadcrumb */}
            <nav className="mb-lg flex items-center gap-xs text-body-sm text-on-surface-variant dark:text-slate-400">
                <Link href="/lich-su" className="transition-colors hover:text-primary dark:hover:text-primary-300">
                    {RENEW_PAGE.BREADCRUMB_ACCOUNT}
                </Link>
                <MaterialIcon name="chevron_right" className="text-[16px]" />
                <Link href="/lich-su" className="transition-colors hover:text-primary dark:hover:text-primary-300">
                    {RENEW_PAGE.BREADCRUMB_HISTORY}
                </Link>
                <MaterialIcon name="chevron_right" className="text-[16px]" />
                <span className="font-medium text-primary dark:text-primary-300">{RENEW_PAGE.BREADCRUMB_RENEW}</span>
            </nav>

            {/* Page Title */}
            <h1 className="mb-xl font-headline-lg text-headline-lg text-primary dark:text-white">{RENEW_PAGE.TITLE}</h1>

            {/* Section 1: Book Info Card */}
            <section className="mb-xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-lg md:flex-row">
                    {/* Cover Image */}
                    <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm dark:border-slate-700">
                        {loan.bookCoverImage ? (
                            <Image src={loan.bookCoverImage} alt={loan.bookTitle} fill className="object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-surface-container-high dark:bg-slate-800">
                                <MaterialIcon name="book" className="text-[32px] text-outline dark:text-slate-500" />
                            </div>
                        )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-grow space-y-sm">
                        <div className="flex flex-wrap items-center gap-md">
                            <h2 className="font-title-md text-title-md text-on-surface dark:text-white">{loan.bookTitle}</h2>
                            {overdueDays > 0 && (
                                <span className="flex items-center gap-xs rounded-full bg-error-container/30 px-sm py-1 font-label-caps text-label-caps text-error dark:bg-slate-800 dark:text-error-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-error dark:bg-error-300"></span>
                                    {RENEW_PAGE.OVERDUE_BADGE_PREFIX} ({overdueDays} {RENEW_PAGE.OVERDUE_DAYS_SUFFIX})
                                </span>
                            )}
                        </div>
                        <p className="text-body-sm text-on-surface-variant dark:text-slate-400">
                            {RENEW_PAGE.AUTHOR_PREFIX} {loan.bookAuthor}
                        </p>

                        {/* Dates Row */}
                        <div className="grid grid-cols-2 gap-lg pt-sm lg:grid-cols-3">
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{RENEW_PAGE.BORROW_DATE}</p>
                                <p className="text-body-md font-medium dark:text-white">{formatDate(loan.borrowDate)}</p>
                            </div>
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{RENEW_PAGE.DUE_DATE}</p>
                                <p className="text-body-md font-medium text-error dark:text-error-300">{formatDate(loan.dueDate)}</p>
                            </div>
                            <div className="hidden lg:block">
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{RENEW_PAGE.ACTUAL_RETURN_DATE}</p>
                                <p className="text-body-md text-on-surface-variant dark:text-slate-400">{RENEW_PAGE.ACTUAL_RETURN_DASH}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Renewal Details */}
            <section className="mb-xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-lg font-title-md text-title-md text-on-surface dark:text-white">{RENEW_PAGE.DETAIL.HEADING}</h2>

                <div className="space-y-md">
                    {/* Current Late Fee */}
                    <div className="flex items-center justify-between">
                        <span className="text-body-md text-on-surface dark:text-slate-300">{RENEW_PAGE.DETAIL.CURRENT_LATE_FEE}</span>
                        <span className="text-body-md font-medium text-error dark:text-error-300">{formatCurrency(currentLateFee)}</span>
                    </div>

                    {/* Initial Deposit */}
                    <div className="flex items-center justify-between">
                        <span className="text-body-md text-on-surface dark:text-slate-300">{RENEW_PAGE.DETAIL.INITIAL_DEPOSIT}</span>
                        <span className="text-body-md font-medium text-on-surface dark:text-white">{formatCurrency(initialDeposit)}</span>
                    </div>
                </div>

                {/* Duration Selection + Summary */}
                <div className="mt-xl flex flex-col gap-xl lg:flex-row lg:items-start lg:justify-between">
                    {/* Radio Options */}
                    <div>
                        <h3 className="mb-md font-title-md text-title-md text-on-surface dark:text-white">{RENEW_PAGE.DURATION.HEADING}</h3>
                        <div className="space-y-md">
                            {RENEWAL_OPTIONS.map((option) => (
                                <label key={option.days} className="flex cursor-pointer items-center gap-md" htmlFor={`duration-${option.days}`}>
                                    <input
                                        type="radio"
                                        id={`duration-${option.days}`}
                                        name="renewal-duration"
                                        value={option.days}
                                        checked={selectedDuration === option.days}
                                        onChange={() => setSelectedDuration(option.days)}
                                        className="h-5 w-5 cursor-pointer border-2 border-outline text-primary accent-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-500 dark:accent-primary-300"
                                    />
                                    <span className="text-body-md text-on-surface dark:text-white">
                                        {option.days} {RENEW_PAGE.DURATION.DAYS_SUFFIX} ({RENEW_PAGE.DURATION.FEE_PREFIX}
                                        {formatCurrency(option.fee)})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Cost Summary Panel */}
                    <div className="w-full space-y-md rounded-xl bg-surface-container-high p-lg dark:bg-slate-800 lg:max-w-sm">
                        {/* Total with selected fee */}
                        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-md dark:border-slate-700">
                            <span className="font-title-md text-body-md font-semibold text-on-surface dark:text-white">
                                {RENEW_PAGE.SUMMARY.TOTAL_NEW_COST}
                            </span>
                            <span className="font-title-md text-title-md font-bold text-on-surface dark:text-white">{formatCurrency(totalNewCost)}</span>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-sm text-body-sm">
                            <div className="flex items-center justify-between text-on-surface-variant dark:text-slate-400">
                                <span>{RENEW_PAGE.SUMMARY.INITIAL_DEPOSIT_LABEL}</span>
                                <span>{formatCurrency(initialDeposit)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-outline-variant/30 pt-sm dark:border-slate-700">
                                <span className="font-semibold text-on-surface dark:text-white">{RENEW_PAGE.SUMMARY.TOTAL_LABEL}</span>
                                <span className="font-semibold text-on-surface dark:text-white">{formatCurrency(totalNewCost)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Confirm Button */}
            <button
                className="w-full rounded-lg bg-primary py-4 font-title-md text-title-md text-on-primary shadow-sm transition-all hover:bg-primary-container hover:text-on-primary-container active:scale-[0.99]"
                id="confirm-renewal-btn"
            >
                {RENEW_PAGE.CONFIRM_BUTTON}
            </button>
        </div>
    );
}
