import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { MY_BOOKS_PAGE } from "@/constants/ui-text/public";
import type { UserBorrowHistoryItem } from "@/services/userBorrow";

const DASH = "—";

const CoverPlaceholder = () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-container-high dark:bg-slate-800">
        <MaterialIcon name="book" className="text-[32px] text-outline dark:text-slate-500" />
    </div>
);

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return DASH;
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
        return dateStr;
    }
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

export const LoanCard = ({ loan, onCancel }: { loan: UserBorrowHistoryItem; onCancel?: () => void }) => {
    const displayStatus = mapStatus(loan.status);

    return (
        <div
            className={`group rounded-xl border bg-surface-container-lowest p-lg shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 ${
                displayStatus === "overdue" ? "border-error/20" : "border-outline-variant/30"
            } opacity-80 transition-opacity hover:opacity-100`}
        >
            <div className="flex flex-col gap-lg md:flex-row">
                <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm dark:border-slate-700">
                    {loan.bookCoverImage ? <Image src={loan.bookCoverImage} alt="Cover" fill className="object-cover" /> : <CoverPlaceholder />}
                </div>
                <div className="flex flex-grow flex-col justify-between md:flex-row">
                    <div className="space-y-sm">
                        <div className="flex items-center gap-md">
                            <h3 className="font-title-md text-title-md text-on-surface transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary-300">
                                {loan.bookTitle || loan.orderCode}
                            </h3>
                            <span
                                className={`flex items-center gap-xs rounded-full px-sm py-1 font-label-caps text-label-caps ${
                                    displayStatus === "borrowing"
                                        ? "bg-secondary-container/20 text-secondary dark:bg-slate-800 dark:text-secondary-300"
                                        : displayStatus === "overdue"
                                          ? "bg-error-container/30 text-error dark:bg-slate-800 dark:text-error-300"
                                          : loan.status === "pending"
                                            ? "bg-primary-container/30 text-primary dark:bg-slate-800 dark:text-primary-300"
                                            : loan.status === "pending_renewal"
                                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                              : loan.status === "ready"
                                                ? "bg-tertiary-container/30 text-tertiary dark:bg-slate-800 dark:text-tertiary-300"
                                                : loan.status === "cancelled"
                                                  ? "bg-surface-container-high text-on-surface-variant dark:bg-slate-800 dark:text-slate-400"
                                                  : "bg-surface-container-high text-on-surface-variant dark:bg-slate-800 dark:text-slate-200"
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                        displayStatus === "borrowing"
                                            ? "bg-secondary dark:bg-secondary-300"
                                            : displayStatus === "overdue"
                                              ? "bg-error dark:bg-error-300"
                                              : loan.status === "pending"
                                                ? "bg-primary dark:bg-primary-300"
                                                : loan.status === "pending_renewal"
                                                  ? "bg-amber-500 dark:bg-amber-400"
                                                  : loan.status === "ready"
                                                    ? "bg-tertiary dark:bg-tertiary-300"
                                                    : loan.status === "cancelled"
                                                      ? "bg-outline dark:bg-slate-500"
                                                      : "bg-outline dark:bg-slate-400"
                                    }`}
                                ></span>
                                {loan.status === "borrowed"
                                    ? MY_BOOKS_PAGE.CARD.STATUS_BORROWING
                                    : displayStatus === "overdue"
                                      ? MY_BOOKS_PAGE.STATUS_OVERDUE
                                      : loan.status === "pending"
                                        ? MY_BOOKS_PAGE.CARD.STATUS_PENDING
                                        : loan.status === "pending_renewal"
                                          ? MY_BOOKS_PAGE.CARD.STATUS_PENDING_RENEWAL
                                          : loan.status === "ready"
                                            ? MY_BOOKS_PAGE.CARD.STATUS_READY
                                            : loan.status === "cancelled"
                                              ? MY_BOOKS_PAGE.CARD.STATUS_CANCELLED
                                              : MY_BOOKS_PAGE.CARD.STATUS_RETURNED}
                            </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant dark:text-slate-400">
                            {MY_BOOKS_PAGE.CARD.AUTHOR_PREFIX} {loan.bookAuthor || DASH}
                        </p>
                        <div className="grid grid-cols-2 gap-lg pt-sm lg:grid-cols-3">
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{MY_BOOKS_PAGE.CARD.BORROW_DATE}</p>
                                <p className="text-body-md font-medium dark:text-white">{formatDate(loan.borrowDate)}</p>
                            </div>
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{MY_BOOKS_PAGE.CARD.DUE_DATE}</p>
                                <p
                                    className={`text-body-md font-medium ${
                                        displayStatus === "overdue"
                                            ? "text-error dark:text-error-300"
                                            : displayStatus === "borrowing"
                                              ? "text-secondary"
                                              : "dark:text-white"
                                    }`}
                                >
                                    {formatDate(loan.dueDate)}
                                </p>
                            </div>
                            <div className="hidden lg:block">
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">
                                    {MY_BOOKS_PAGE.CARD.ACTUAL_RETURN_DATE}
                                </p>
                                <p
                                    className={`text-body-md ${
                                        displayStatus === "returned"
                                            ? "font-medium text-primary dark:text-primary-300"
                                            : "text-on-surface-variant dark:text-slate-400"
                                    }`}
                                >
                                    {DASH}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-md flex flex-col justify-between border-t border-outline-variant/30 pt-md dark:border-slate-700 md:mt-0 md:border-l md:border-t-0 md:pl-lg md:pt-0 md:text-right">
                        {(() => {
                            const isEverOverdue = loan.status === "overdue";
                            const formattedDeposit = loan.totalDeposit != null ? `${loan.totalDeposit.toLocaleString("vi-VN")} đ` : DASH;

                            if (isEverOverdue) {
                                return (
                                    <div className="space-y-xs">
                                        <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">
                                            {MY_BOOKS_PAGE.CARD.DEPOSIT} {MY_BOOKS_PAGE.CARD.DEPOSIT_FORFEITED}
                                        </p>
                                        <p className="text-body-sm text-error line-through dark:text-error-300">{formattedDeposit}</p>
                                    </div>
                                );
                            } else if (
                                loan.status === "borrowed" ||
                                loan.status === "pending_renewal" ||
                                loan.status === "pending" ||
                                loan.status === "ready"
                            ) {
                                return (
                                    <div>
                                        <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">
                                            {MY_BOOKS_PAGE.CARD.DEPOSIT}
                                        </p>
                                        <p className="text-body-md font-bold dark:text-white">{formattedDeposit}</p>
                                    </div>
                                );
                            } else if (loan.status === "returned") {
                                return (
                                    <div>
                                        <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">
                                            {MY_BOOKS_PAGE.CARD.DEPOSIT_RETURN}
                                        </p>
                                        <p className="text-body-md font-bold text-on-surface-variant dark:text-slate-300">{formattedDeposit}</p>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {loan.status === "overdue" || loan.status === "borrowed" ? (
                            <div className="mt-4 flex justify-end gap-2">
                                <Link
                                    href={`/lich-su/${loan.orderCode}`}
                                    className="group mr-4 mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-primary decoration-2 dark:text-primary-300"
                                >
                                    <span className="group-hover:underline">{MY_BOOKS_PAGE.CARD.VIEW_DETAIL}</span>
                                </Link>
                                <Link
                                    href={`/lich-su/${loan.orderCode}/gia-han`}
                                    className={`mt-md flex items-center justify-center rounded-lg px-md py-2 font-body-md text-body-sm transition-all hover:opacity-90 ${loan.status === "overdue" ? "bg-error text-on-error" : "dark:bg-secondary-400 bg-secondary text-on-secondary dark:text-slate-900"}`}
                                >
                                    {MY_BOOKS_PAGE.RENEW_NOW}
                                </Link>
                            </div>
                        ) : displayStatus === "pending" ? (
                            <div className="mt-4 flex items-center justify-end gap-2">
                                <button
                                    onClick={onCancel}
                                    className="group mr-4 mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-error decoration-2 dark:text-error-300"
                                >
                                    <span className="group-hover:underline">{MY_BOOKS_PAGE.CARD.CANCEL_RESERVATION}</span>
                                </button>
                                <Link
                                    href={`/lich-su/${loan.orderCode}`}
                                    className="mt-md rounded-lg bg-primary px-md py-2 font-body-md text-body-sm text-on-primary transition-all hover:opacity-90"
                                >
                                    {MY_BOOKS_PAGE.CARD.VIEW_DETAIL}
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href={`/lich-su/${loan.orderCode}`}
                                className="group mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-primary dark:text-primary-300"
                            >
                                <span className="group-hover:underline">
                                    {displayStatus === "returned" ? MY_BOOKS_PAGE.CARD.VIEW_RECEIPT : MY_BOOKS_PAGE.CARD.VIEW_DETAIL}
                                </span>
                                {displayStatus === "returned" ? (
                                    <MaterialIcon name="receipt_long" className="text-[18px]" />
                                ) : (
                                    <MaterialIcon name="arrow_forward" className="text-[18px]" />
                                )}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
