import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { MY_BOOKS_PAGE } from "@/constants/ui-text/public";
import { MOCK_LOANS } from "@/mocks/loans";

const DASH = "—";

const CoverPlaceholder = () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-container-high dark:bg-slate-800">
        <MaterialIcon name="book" className="text-[32px] text-outline dark:text-slate-500" />
    </div>
);

export const LoanCard = ({ loan, onCancel }: { loan: (typeof MOCK_LOANS)[number]; onCancel?: () => void }) => {
    return (
        <div
            className={`group rounded-xl border bg-surface-container-lowest p-lg shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 ${
                loan.status === "overdue" ? "border-error/20" : "border-outline-variant/30"
            } opacity-80 transition-opacity hover:opacity-100`}
        >
            <div className="flex flex-col gap-lg md:flex-row">
                <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm dark:border-slate-700">
                    {loan.imgSrc ? <Image src={loan.imgSrc} alt="Cover" fill className="object-cover" /> : <CoverPlaceholder />}
                </div>
                <div className="flex flex-grow flex-col justify-between md:flex-row">
                    <div className="space-y-sm">
                        <div className="flex items-center gap-md">
                            <h3 className="font-title-md text-title-md text-on-surface transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary-300">
                                {loan.title}
                            </h3>
                            <span
                                className={`flex items-center gap-xs rounded-full px-sm py-1 font-label-caps text-label-caps ${
                                    loan.status === "borrowing"
                                        ? "bg-secondary-container/20 text-secondary dark:bg-slate-800 dark:text-secondary-300"
                                        : loan.status === "overdue"
                                          ? "bg-error-container/30 text-error dark:bg-slate-800 dark:text-error-300"
                                          : loan.status === "pending"
                                            ? "bg-primary-container/30 text-primary dark:bg-slate-800 dark:text-primary-300"
                                            : "bg-surface-container-high text-on-surface-variant dark:bg-slate-800 dark:text-slate-200"
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                        loan.status === "borrowing"
                                            ? "bg-secondary dark:bg-secondary-300"
                                            : loan.status === "overdue"
                                              ? "bg-error dark:bg-error-300"
                                              : loan.status === "pending"
                                                ? "bg-primary dark:bg-primary-300"
                                                : "bg-outline dark:bg-slate-400"
                                    }`}
                                ></span>
                                {loan.status === "borrowing"
                                    ? MY_BOOKS_PAGE.CARD.STATUS_BORROWING
                                    : loan.status === "overdue"
                                      ? MY_BOOKS_PAGE.STATUS_OVERDUE
                                      : loan.status === "pending"
                                        ? "Đang giữ chỗ"
                                        : loan.status === "cancelled"
                                          ? "Đã huỷ"
                                          : MY_BOOKS_PAGE.CARD.STATUS_RETURNED}
                            </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant dark:text-slate-400">
                            {MY_BOOKS_PAGE.CARD.AUTHOR_PREFIX} {loan.author}
                        </p>
                        <div className="grid grid-cols-2 gap-lg pt-sm lg:grid-cols-3">
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{MY_BOOKS_PAGE.CARD.BORROW_DATE}</p>
                                <p className="text-body-md font-medium dark:text-white">{loan.borrowDate}</p>
                            </div>
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{MY_BOOKS_PAGE.CARD.DUE_DATE}</p>
                                <p
                                    className={`text-body-md font-medium ${
                                        loan.status === "overdue"
                                            ? "text-error dark:text-error-300"
                                            : loan.status === "borrowing"
                                              ? "text-secondary"
                                              : "dark:text-white"
                                    }`}
                                >
                                    {loan.dueDate}
                                </p>
                            </div>
                            <div className="hidden lg:block">
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">
                                    {MY_BOOKS_PAGE.CARD.ACTUAL_RETURN_DATE}
                                </p>
                                <p
                                    className={`text-body-md ${
                                        loan.status === "returned"
                                            ? "font-medium text-primary dark:text-primary-300"
                                            : "text-on-surface-variant dark:text-slate-400"
                                    }`}
                                >
                                    {loan.actualReturnDate ?? DASH}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-md flex flex-col justify-between border-t border-outline-variant/30 pt-md dark:border-slate-700 md:mt-0 md:border-l md:border-t-0 md:pl-lg md:pt-0 md:text-right">
                        {loan.status === "overdue" && (
                            <div className="space-y-xs">
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{MY_BOOKS_PAGE.CARD.DEPOSIT}</p>
                                <p className="text-body-sm text-on-surface-variant line-through dark:text-slate-400">{(loan as any).deposit}</p>
                                <p className="mt-2 font-label-caps text-label-caps uppercase text-error dark:text-error-300">
                                    {MY_BOOKS_PAGE.CARD.LATE_FEE_LABEL}
                                </p>
                                <p className="text-body-md font-bold text-error dark:text-error-300">{(loan as any).lateFee}</p>
                            </div>
                        )}
                        {(loan.status === "borrowing" || loan.status === "pending" || loan.status === "cancelled") && (
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{MY_BOOKS_PAGE.CARD.DEPOSIT}</p>
                                <p className={`text-body-md font-bold ${loan.status === "cancelled" ? "text-outline line-through" : "dark:text-white"}`}>
                                    {(loan as any).deposit}
                                </p>
                            </div>
                        )}
                        {loan.status === "returned" && (
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">
                                    {MY_BOOKS_PAGE.CARD.DEPOSIT_RETURN}
                                </p>
                                <p className="text-body-md font-bold text-on-surface-variant dark:text-slate-300">{(loan as any).depositReturn}</p>
                            </div>
                        )}

                        {loan.status === "overdue" ? (
                            <div className="mt-4 flex justify-end gap-2">
                                <Link
                                    href={`/lich-su/${loan.id}`}
                                    className="group mr-4 mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-primary decoration-2 dark:text-primary-300"
                                >
                                    <span className="group-hover:underline">{MY_BOOKS_PAGE.CARD.VIEW_DETAIL}</span>
                                </Link>
                                <Link
                                    href={`/lich-su/${loan.id}/gia-han`}
                                    className="mt-md rounded-lg bg-error px-md py-2 font-body-md text-body-sm text-on-error transition-all hover:opacity-90"
                                >
                                    {MY_BOOKS_PAGE.RENEW_NOW}
                                </Link>
                            </div>
                        ) : loan.status === "pending" ? (
                            <div className="mt-4 flex items-center justify-end gap-2">
                                <button
                                    onClick={onCancel}
                                    className="group mr-4 mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-error decoration-2 dark:text-error-300"
                                >
                                    <span className="group-hover:underline">{UI_TEXT.MY_BOOKS_PAGE.CARD.CANCEL_RESERVATION}</span>
                                </button>
                                <Link
                                    href={`/lich-su/${loan.id}`}
                                    className="mt-md rounded-lg bg-primary px-md py-2 font-body-md text-body-sm text-on-primary transition-all hover:opacity-90"
                                >
                                    {UI_TEXT.MY_BOOKS_PAGE.CARD.VIEW_DETAIL}
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href={`/lich-su/${loan.id}`}
                                className="group mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-primary dark:text-primary-300"
                            >
                                <span className="group-hover:underline">
                                    {loan.status === "returned" ? MY_BOOKS_PAGE.CARD.VIEW_RECEIPT : MY_BOOKS_PAGE.CARD.VIEW_DETAIL}
                                </span>
                                {loan.status === "returned" ? (
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
