"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { getBorrowOrderDetail } from "@/services/borrow";
import { BorrowOrderDetailResponseDto } from "@/types/borrow";

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
    const router = useRouter();
    const id = params?.id as string;
    const [loan, setLoan] = useState<BorrowOrderDetailResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLimitModal, setShowLimitModal] = useState(false);

    const { MY_BOOKS_PAGE } = UI_TEXT;
    const { LOAN_DETAIL } = UI_TEXT.BORROW;

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getBorrowOrderDetail(id);
            if (response.success && response.data) {
                setLoan(response.data);
            } else {
                setError(response.message || "Không thể tải chi tiết đơn mượn");
            }
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
                            <span className="ml-1 font-medium text-on-surface dark:text-white md:ml-2">{`#${loan.id}`}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Page Header & Actions */}
            <div className="mb-xl flex flex-col justify-between gap-md md:flex-row md:items-start">
                <div>
                    <div className="mb-2 flex items-center gap-sm">
                        <h1 className="m-0 font-display-lg text-display-lg text-on-background dark:text-white">{LOAN_DETAIL.TITLE}</h1>
                        {loan.status === "overdue" && (
                            <span className="inline-flex items-center rounded-full border border-error/20 bg-error-container px-2.5 py-0.5 text-xs font-medium text-on-error-container">
                                {MY_BOOKS_PAGE.CARD.STATUS_OVERDUE}
                            </span>
                        )}
                        {loan.status === "borrowed" && (
                            <span className="inline-flex items-center rounded-full border border-secondary/20 bg-secondary-container px-2.5 py-0.5 text-xs font-medium text-on-secondary-container">
                                {MY_BOOKS_PAGE.CARD.STATUS_BORROWING}
                            </span>
                        )}
                        {loan.status === "returned" && (
                            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary-container px-2.5 py-0.5 text-xs font-medium text-on-primary-container">
                                {MY_BOOKS_PAGE.CARD.STATUS_RETURNED}
                            </span>
                        )}
                        {loan.status === "pending" && (
                            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary-container/30 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {MY_BOOKS_PAGE.CARD.STATUS_PENDING}
                            </span>
                        )}
                        {loan.status === "ready" && (
                            <span className="inline-flex items-center rounded-full border border-tertiary/20 bg-tertiary-container/30 px-2.5 py-0.5 text-xs font-medium text-tertiary">
                                {MY_BOOKS_PAGE.CARD.STATUS_READY}
                            </span>
                        )}
                        {loan.status === "cancelled" && (
                            <span className="inline-flex items-center rounded-full border border-outline/20 bg-surface-container-high px-2.5 py-0.5 text-xs font-medium text-on-surface-variant">
                                {MY_BOOKS_PAGE.CARD.STATUS_CANCELLED}
                            </span>
                        )}
                        {loan.status === "pending_renewal" && (
                            <span className="inline-flex items-center rounded-full border border-amber-200/20 bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/30 dark:text-amber-400">
                                {MY_BOOKS_PAGE.CARD.STATUS_PENDING_RENEWAL}
                            </span>
                        )}
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">
                        {LOAN_DETAIL.TRANSACTION_ID} {loan.id}
                    </p>
                </div>
                <div className="flex flex-wrap gap-sm">
                    <button className="dark:border-secondary-400 dark:text-secondary-400 flex items-center gap-2 rounded-lg border-2 border-secondary px-6 py-2 font-body-md text-body-md font-medium text-secondary transition-colors hover:bg-secondary/5">
                        <MaterialIcon name="contact_support" className="text-sm" />
                        {LOAN_DETAIL.CONTACT_LIBRARIAN}
                    </button>
                    {(loan.status === "overdue" || loan.status === "borrowed") && (
                        <button
                            onClick={() => {
                                if (loan.extensionCount && loan.extensionCount >= 2) {
                                    setShowLimitModal(true);
                                } else {
                                    router.push(`/lich-su/${loan.id}/gia-han`);
                                }
                            }}
                            className={`rounded-lg px-6 py-2 font-body-md text-body-md font-medium shadow-sm transition-colors ${loan.status === "overdue" ? "bg-error text-on-error hover:bg-error/90" : "dark:bg-secondary-400 bg-secondary text-on-secondary hover:bg-secondary/90 dark:text-slate-900"}`}
                        >
                            {LOAN_DETAIL.RENEW_LOAN}
                        </button>
                    )}
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
                                <p className="font-body-md text-body-md font-medium text-on-surface dark:text-white">{loan.borrowDate || "—"}</p>
                            </div>
                            <div>
                                <p className="mb-xs font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{LOAN_DETAIL.DUE_DATE}</p>
                                <p
                                    className={`font-body-md text-body-md font-medium ${loan.status === "overdue" ? "text-error" : loan.status === "borrowing" ? "dark:text-secondary-400 text-secondary" : "text-on-surface dark:text-white"}`}
                                >
                                    {loan.dueDate || "—"}
                                </p>
                            </div>
                            {loan.actualReturnDate && (
                                <div>
                                    <p className="mb-xs font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">
                                        {LOAN_DETAIL.ACTUAL_RETURN_DATE}
                                    </p>
                                    <p className="font-body-md text-body-md font-medium text-primary dark:text-primary-300">{loan.actualReturnDate}</p>
                                </div>
                            )}
                            <div>
                                <p className="mb-xs font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{LOAN_DETAIL.STATUS}</p>
                                <p
                                    className={`flex items-center gap-1 font-body-md text-body-md font-medium ${loan.status === "overdue" ? "text-error" : loan.status === "borrowed" ? "dark:text-secondary-400 text-secondary" : "text-on-surface dark:text-white"}`}
                                >
                                    {loan.status === "overdue" && <MaterialIcon name="warning" className="text-sm" />}
                                    {loan.status === "overdue"
                                        ? `Quá hạn ${loan.overdueDays} ngày`
                                        : loan.status === "borrowed"
                                          ? MY_BOOKS_PAGE.CARD.STATUS_BORROWING
                                          : loan.status === "returned"
                                            ? MY_BOOKS_PAGE.CARD.STATUS_RETURNED
                                            : loan.status === "ready"
                                              ? MY_BOOKS_PAGE.CARD.STATUS_READY
                                              : loan.status === "cancelled"
                                                ? MY_BOOKS_PAGE.CARD.STATUS_CANCELLED
                                                : loan.status === "pending_renewal"
                                                  ? MY_BOOKS_PAGE.CARD.STATUS_PENDING_RENEWAL
                                                  : MY_BOOKS_PAGE.CARD.STATUS_PENDING}
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
                            {loan.books.map((book, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-md rounded-lg border border-surface-container bg-surface-bright p-md transition-shadow hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] dark:border-slate-700 dark:bg-slate-800 sm:flex-row"
                                >
                                    <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded bg-surface-container shadow-sm dark:border-slate-600">
                                        {book.imgSrc ? (
                                            <Image src={book.imgSrc} alt="Cover" fill className="object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <MaterialIcon name="book" className="text-[32px] text-outline" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-grow flex-col justify-between">
                                        <div>
                                            <h3 className="mb-xs font-title-md text-title-md text-on-surface dark:text-white">{book.title}</h3>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{book.author}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between sm:mt-0">
                                            <span
                                                className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                                                    book.status === "returned"
                                                        ? "bg-primary-fixed text-primary dark:bg-primary-900/30 dark:text-primary-300"
                                                        : "bg-surface-container-highest text-on-surface-variant dark:bg-slate-700 dark:text-slate-300"
                                                }`}
                                            >
                                                {book.status === "returned" ? "Đã trả" : book.status === "inUse" ? "Đang sử dụng" : "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Financials & Timeline */}
                <div className="flex flex-col gap-xl">
                    {/* Section 3: Financial Summary */}
                    <section className="relative overflow-hidden rounded-xl border border-primary/10 bg-primary/5 p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-primary-900/10">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <MaterialIcon name="account_balance_wallet" className="text-6xl" />
                        </div>
                        <h2 className="mb-md font-title-md text-title-md text-primary dark:text-primary-300">{LOAN_DETAIL.FINANCIALS}</h2>
                        <div className="space-y-sm font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">
                            <div className="flex items-center justify-between border-b border-primary/10 py-2 text-on-surface dark:text-slate-300">
                                <span>
                                    {LOAN_DETAIL.DEPOSIT} {isOverdue ? LOAN_DETAIL.DEPOSIT_FORFEITED : LOAN_DETAIL.DEPOSIT_PAID}
                                </span>
                                <span className={isOverdue ? "font-medium text-error line-through" : "font-medium"}>{loan.deposit}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-primary/10 py-2">
                                <span>{LOAN_DETAIL.TOTAL_BORROW_FEE}</span>
                                <span className="font-medium text-on-surface dark:text-white">{loan.rentalFee}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-primary/10 py-2 text-error">
                                <span>{LOAN_DETAIL.TOTAL_LATE_FEE}</span>
                                <span className="font-medium">{loan.lateFee}</span>
                            </div>
                            {loan.paidOnline && loan.paidOnline !== "0 đ" && (
                                <div className="flex items-center justify-between border-b border-primary/10 py-2 text-primary dark:text-primary-300">
                                    <span>{LOAN_DETAIL.PAID_ONLINE}</span>
                                    <span className="font-medium">-{loan.paidOnline}</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-md flex items-end justify-between border-t-2 border-primary/20 pt-md">
                            <span className="font-body-md text-body-md font-medium text-on-surface dark:text-white">{LOAN_DETAIL.TO_PAY}</span>
                            <span className="font-title-md text-title-md font-bold text-error">{loan.total}</span>
                        </div>
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
                                    <h3 className="font-body-md text-body-md font-medium text-error">{LOAN_DETAIL.DEADLINE}</h3>
                                    <time className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{loan.deadlineDate || "—"}</time>
                                </div>
                            </div>
                            {/* Timeline Item 2 */}
                            <div className="relative">
                                <span className="absolute -left-8 flex h-4 w-4 items-center justify-center rounded-full border-2 border-secondary bg-surface-container-lowest dark:bg-slate-900"></span>
                                <div className="flex flex-col">
                                    <h3 className="font-body-md text-body-md font-medium text-on-surface dark:text-white">{LOAN_DETAIL.REMINDER_SENT}</h3>
                                    <time className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">{loan.reminderDate || "—"}</time>
                                </div>
                            </div>
                            {/* Timeline Item 3 */}
                            <div className="relative">
                                <span className="absolute -left-8 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-primary"></span>
                                <div className="flex flex-col">
                                    <h3 className="font-body-md text-body-md font-medium text-on-surface dark:text-white">{LOAN_DETAIL.BORROW_SUCCESS}</h3>
                                    <time className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">
                                        {loan.borrowSuccessDate || "—"}
                                    </time>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Limit Modal */}
            {showLimitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-xl dark:bg-slate-800">
                        <div className="mb-4 flex items-center gap-3 text-error">
                            <MaterialIcon name="error" className="text-3xl" />
                            <h2 className="font-title-lg text-title-lg font-bold">{LOAN_DETAIL.LIMIT_MODAL_TITLE}</h2>
                        </div>
                        <p className="mb-6 font-body-md text-body-md text-on-surface-variant dark:text-slate-300">{LOAN_DETAIL.LIMIT_MODAL_DESC}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowLimitModal(false)}
                                className="rounded-lg bg-primary px-6 py-2 font-body-md text-body-md font-medium text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container"
                            >
                                {LOAN_DETAIL.LIMIT_MODAL_ACKNOWLEDGE}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
