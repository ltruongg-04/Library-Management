"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";
import { type UserBorrowDetail, userBorrowService } from "@/services/userBorrow";

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "—";
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
    } catch {
        return dateStr;
    }
};

const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return "0 đ";
    return `${amount.toLocaleString("vi-VN")} đ`;
};

const mapStatus = (status: string): string => {
    const map: Record<string, string> = {
        PENDING: "pending",
        READY: "pending",
        BORROWED: "borrowing",
        RETURNED: "returned",
        OVERDUE: "overdue",
        CANCELLED: "cancelled",
    };
    return map[status] || status.toLowerCase();
};

export default function LoanDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [loan, setLoan] = useState<UserBorrowDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { LOAN_DETAIL } = UI_TEXT.BORROW;

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);
            const detail = await userBorrowService.getDetail(id);
            setLoan(detail);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không thể tải chi tiết đơn mượn");
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
            <div className="mx-auto w-full max-w-container-max flex-grow px-md py-xl md:px-lg">
                <div className="flex items-center justify-center py-24">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error || !loan) {
        return (
            <div className="mx-auto w-full max-w-container-max flex-grow px-md py-xl md:px-lg">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="material-symbols-outlined mb-4 text-6xl text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>
                        {"error_outline"}
                    </span>
                    <p className="text-body-md text-on-surface-variant dark:text-slate-400">{error || "Không tìm thấy đơn mượn"}</p>
                    <Link href="/lich-su" className="mt-4 text-primary hover:underline dark:text-primary-300">
                        {UI_TEXT.PUBLIC_LAYOUT.MY_HISTORY}
                    </Link>
                </div>
            </div>
        );
    }

    const displayStatus = mapStatus(loan.status);
    const isOverdue = displayStatus === "overdue";

    return (
        <div className="mx-auto w-full max-w-container-max flex-grow px-md py-xl md:px-lg">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-lg flex font-body-sm text-body-sm text-on-surface-variant">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link
                            className="inline-flex items-center transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary-300"
                            href="/lich-su"
                        >
                            {UI_TEXT.PUBLIC_LAYOUT.MY_HISTORY}
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <span className="material-symbols-outlined mx-1 text-sm dark:text-slate-500" style={{ fontVariationSettings: "'FILL' 0" }}>
                                {"chevron_right"}
                            </span>
                            <span className="ml-1 font-medium text-on-surface dark:text-white md:ml-2">{`#${loan.orderCode}`}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Page Header & Actions */}
            <div className="mb-xl flex flex-col justify-between gap-md md:flex-row md:items-start">
                <div>
                    <div className="mb-2 flex items-center gap-sm">
                        <h1 className="m-0 font-display-lg text-display-lg text-on-background dark:text-white">{LOAN_DETAIL.TITLE}</h1>
                        {isOverdue && (
                            <span className="inline-flex items-center rounded-full border border-error/20 bg-error-container px-2.5 py-0.5 text-xs font-medium text-on-error-container">
                                {LOAN_DETAIL.OVERDUE}
                            </span>
                        )}
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">
                        {LOAN_DETAIL.TRANSACTION_ID} {loan.orderCode}
                    </p>
                </div>
                <div className="flex flex-wrap gap-sm">
                    <button className="dark:border-secondary-400 dark:text-secondary-400 flex items-center gap-2 rounded-lg border-2 border-secondary px-6 py-2 font-body-md text-body-md font-medium text-secondary transition-colors hover:bg-secondary/5">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>
                            {"contact_support"}
                        </span>
                        {LOAN_DETAIL.CONTACT_LIBRARIAN}
                    </button>
                    <button
                        className="cursor-not-allowed rounded-lg bg-primary px-6 py-2 font-body-md text-body-md font-medium text-on-primary opacity-50 shadow-sm transition-colors hover:bg-primary/90"
                        disabled
                        title={LOAN_DETAIL.CANNOT_RENEW}
                    >
                        {LOAN_DETAIL.RENEW_LOAN}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-xl lg:grid-cols-3">
                {/* Left Column: Details & Books */}
                <div className="flex flex-col gap-xl lg:col-span-2">
                    {/* Section 1: Loan Overview */}
                    <section className="rounded-xl border border-surface-container bg-surface-container-lowest p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-md border-b border-surface-container-high pb-sm font-title-md text-title-md text-on-background dark:border-slate-700 dark:text-white">
                            {LOAN_DETAIL.OVERVIEW}
                        </h2>
                        <div className="grid grid-cols-1 gap-md md:grid-cols-3">
                            <div>
                                <p className="mb-xs font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{LOAN_DETAIL.BORROW_DATE}</p>
                                <p className="font-body-md text-body-md font-medium text-on-surface dark:text-white">{formatDate(loan.borrowDate)}</p>
                            </div>
                            <div>
                                <p className="mb-xs font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{LOAN_DETAIL.DUE_DATE}</p>
                                <p className={`font-body-md text-body-md font-medium ${isOverdue ? "text-error" : "dark:text-white"}`}>
                                    {formatDate(loan.dueDate)}
                                </p>
                            </div>
                            <div>
                                <p className="mb-xs font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{LOAN_DETAIL.STATUS}</p>
                                <p
                                    className={`flex items-center gap-1 font-body-md text-body-md font-medium ${isOverdue ? "text-error" : "text-primary dark:text-primary-300"}`}
                                >
                                    {isOverdue && (
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            {"warning"}
                                        </span>
                                    )}
                                    {isOverdue ? LOAN_DETAIL.OVERDUE_DAYS : loan.status}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Borrowed Book */}
                    <section className="rounded-xl border border-surface-container bg-surface-container-lowest p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-md border-b border-surface-container-high pb-sm font-title-md text-title-md text-on-background dark:border-slate-700 dark:text-white">
                            {LOAN_DETAIL.BORROWED_BOOKS}
                        </h2>
                        <div className="flex flex-col gap-md">
                            <div className="flex flex-col gap-md rounded-lg border border-surface-container bg-surface-bright p-md transition-shadow hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] dark:border-slate-700 dark:bg-slate-800 sm:flex-row">
                                <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded bg-surface-container shadow-sm dark:border-slate-600">
                                    {loan.bookCoverImage ? (
                                        <Image src={loan.bookCoverImage} alt="Cover" fill className="object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-surface-container-high dark:bg-slate-700">
                                            <span className="material-symbols-outlined text-3xl text-outline">{"book"}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-grow flex-col justify-between">
                                    <div>
                                        <h3 className="mb-xs font-title-md text-title-md text-on-surface dark:text-white">{loan.bookTitle}</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{loan.bookAuthor}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between sm:mt-0">
                                        <span
                                            className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                                                loan.bookDetailStatus === "RETURNED"
                                                    ? "bg-primary-fixed text-primary dark:bg-primary-900/30 dark:text-primary-300"
                                                    : "bg-surface-container-highest text-on-surface-variant dark:bg-slate-700 dark:text-slate-300"
                                            }`}
                                        >
                                            {loan.bookDetailStatus === "RETURNED" ? LOAN_DETAIL.RETURNED : LOAN_DETAIL.IN_USE}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Financials & Timeline */}
                <div className="flex flex-col gap-xl">
                    {/* Section 3: Financial Summary */}
                    <section className="relative overflow-hidden rounded-xl border border-primary/10 bg-primary/5 p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-primary-900/10">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {"account_balance_wallet"}
                            </span>
                        </div>
                        <h2 className="mb-md font-title-md text-title-md text-primary dark:text-primary-300">{LOAN_DETAIL.FINANCIALS}</h2>
                        <div className="space-y-sm font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">
                            <div className="flex items-center justify-between border-b border-primary/10 py-2">
                                <span>{LOAN_DETAIL.DEPOSIT}</span>
                                <span className="font-medium text-on-surface dark:text-white">{formatCurrency(loan.totalDeposit)}</span>
                            </div>
                            {isOverdue && (
                                <div className="flex items-center justify-between border-b border-primary/10 py-2 text-error">
                                    <span>{LOAN_DETAIL.LATE_FEE}</span>
                                    <span className="font-medium">{`+${formatCurrency(loan.lateFee)}`}</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-md flex items-end justify-between border-t-2 border-primary/20 pt-md">
                            <span className="font-body-md text-body-md font-medium text-on-surface dark:text-white">{LOAN_DETAIL.TOTAL_PAYMENT}</span>
                            <span className={`font-title-md text-title-md font-bold ${isOverdue ? "text-error" : "text-primary dark:text-primary-300"}`}>
                                {formatCurrency((loan.totalDeposit || 0) + (loan.lateFee || 0))}
                            </span>
                        </div>
                        <button className="mt-lg w-full rounded-lg bg-primary py-3 font-body-md text-body-md font-medium text-on-primary shadow-sm transition-colors hover:bg-primary-container">
                            {LOAN_DETAIL.PAY_NOW}
                        </button>
                    </section>

                    {/* Section 4: Activity Timeline */}
                    <section className="rounded-xl border border-surface-container bg-surface-container-lowest p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-md border-b border-surface-container-high pb-sm font-title-md text-title-md text-on-background dark:border-slate-700 dark:text-white">
                            {LOAN_DETAIL.ACTIVITY_HISTORY}
                        </h2>
                        <div className="relative mt-md space-y-6 pl-6 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-surface-container-high dark:before:bg-slate-700">
                            {/* Timeline: Due date */}
                            <div className="relative">
                                <span
                                    className={`absolute -left-8 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-surface-container-lowest dark:bg-slate-900 ${isOverdue ? "border-error" : "border-secondary"}`}
                                ></span>
                                <div className="flex flex-col">
                                    <h3 className={`font-body-md text-body-md font-medium ${isOverdue ? "text-error" : "text-on-surface dark:text-white"}`}>
                                        {LOAN_DETAIL.DEADLINE}
                                    </h3>
                                    <time className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{formatDate(loan.dueDate)}</time>
                                </div>
                            </div>
                            {/* Timeline: Borrow date */}
                            <div className="relative">
                                <span className="absolute -left-8 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-primary"></span>
                                <div className="flex flex-col">
                                    <h3 className="font-body-md text-body-md font-medium text-on-surface dark:text-white">{LOAN_DETAIL.BORROW_SUCCESS}</h3>
                                    <time className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{formatDate(loan.borrowDate)}</time>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
