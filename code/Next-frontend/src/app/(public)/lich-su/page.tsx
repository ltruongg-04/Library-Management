import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { MY_BOOKS_PAGE } from "@/constants/ui-text/public";
import { MOCK_LOANS } from "@/mocks/loans";

export const metadata: Metadata = {
    title: `${MY_BOOKS_PAGE.TITLE} | Lumina Library`,
    description: "Quản lý và theo dõi lịch sử mượn sách của bạn.",
};

const DASH = "—";

const CoverPlaceholder = () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-container-high dark:bg-slate-800">
        <MaterialIcon name="book" className="text-[32px] text-outline dark:text-slate-500" />
    </div>
);

const LoanCard = ({ loan }: { loan: (typeof MOCK_LOANS)[number] }) => {
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
                                          : "bg-surface-container-high text-on-surface-variant dark:bg-slate-800 dark:text-slate-200"
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                        loan.status === "borrowing"
                                            ? "bg-secondary dark:bg-secondary-300"
                                            : loan.status === "overdue"
                                              ? "bg-error dark:bg-error-300"
                                              : "bg-outline dark:bg-slate-400"
                                    }`}
                                ></span>
                                {loan.status === "borrowing"
                                    ? MY_BOOKS_PAGE.CARD.STATUS_BORROWING
                                    : loan.status === "overdue"
                                      ? MY_BOOKS_PAGE.STATUS_OVERDUE
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
                        {loan.status === "borrowing" && (
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{MY_BOOKS_PAGE.CARD.DEPOSIT}</p>
                                <p className="text-body-md font-bold dark:text-white">{(loan as any).deposit}</p>
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
                                    className="mr-4 mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-primary decoration-2 hover:underline dark:text-primary-300"
                                >
                                    {MY_BOOKS_PAGE.CARD.VIEW_DETAIL}
                                </Link>
                                <button className="mt-md rounded-lg bg-error px-md py-2 font-body-md text-body-sm text-on-error transition-all hover:opacity-90">
                                    {MY_BOOKS_PAGE.RENEW_NOW}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href={`/lich-su/${loan.id}`}
                                className="mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-primary hover:underline dark:text-primary-300"
                            >
                                {loan.status === "returned" ? MY_BOOKS_PAGE.CARD.VIEW_RECEIPT : MY_BOOKS_PAGE.CARD.VIEW_DETAIL}
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

export default function MyBooksPage() {
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
            <div className="mb-lg flex flex-wrap items-center justify-between gap-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-md">
                    <div className="flex flex-col gap-xs">
                        <label className="ml-1 text-body-sm text-on-surface-variant dark:text-slate-400">{MY_BOOKS_PAGE.FILTER.STATUS_LABEL}</label>
                        <select className="h-10 min-w-[160px] cursor-pointer rounded-lg border-none bg-surface-container-low px-md text-body-sm focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white">
                            <option>{MY_BOOKS_PAGE.FILTER.STATUS_ALL}</option>
                            <option>{MY_BOOKS_PAGE.FILTER.STATUS_BORROWING}</option>
                            <option>{MY_BOOKS_PAGE.FILTER.STATUS_RETURNED}</option>
                            <option>{MY_BOOKS_PAGE.FILTER.STATUS_OVERDUE}</option>
                            <option>{MY_BOOKS_PAGE.FILTER.STATUS_PENDING}</option>
                            <option>{MY_BOOKS_PAGE.FILTER.STATUS_CANCELLED}</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-xs">
                        <label className="ml-1 text-body-sm text-on-surface-variant dark:text-slate-400">{MY_BOOKS_PAGE.FILTER.DATE_RANGE_LABEL}</label>
                        <div className="flex items-center gap-sm">
                            <input
                                className="relative h-10 w-full cursor-pointer rounded-lg border-none bg-surface-container-low px-md text-body-sm text-on-surface transition-all [color-scheme:light] focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                                type="date"
                            />
                            <span className="text-body-sm text-outline">{MY_BOOKS_PAGE.FILTER.DATE_TO}</span>
                            <input
                                className="relative h-10 w-full cursor-pointer rounded-lg border-none bg-surface-container-low px-md text-body-sm text-on-surface transition-all [color-scheme:light] focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                                type="date"
                            />
                        </div>
                    </div>
                </div>
                <button className="flex h-10 items-center gap-sm self-end rounded-lg bg-primary px-lg font-body-md text-body-sm text-on-primary transition-all hover:bg-primary-container">
                    <MaterialIcon name="filter_list" className="text-[20px]" />
                    {MY_BOOKS_PAGE.FILTER.APPLY_BUTTON}
                </button>
            </div>

            {/* Content Area */}
            <div className="space-y-md" id="loan-list-container">
                {MOCK_LOANS.map((loan) => (
                    <LoanCard key={loan.id} loan={loan} />
                ))}
            </div>

            {/* Empty State Variation (Hidden by default for this demo) */}
            <div className="mx-auto hidden max-w-md flex-col items-center justify-center py-24 text-center" id="empty-state">
                <div className="mb-lg flex h-32 w-32 items-center justify-center rounded-full bg-surface-container dark:bg-slate-800">
                    <MaterialIcon name="auto_stories" className="text-[64px] text-outline" style={{ fontVariationSettings: "'wght' 200" }} />
                </div>
                <h2 className="mb-sm font-title-md text-title-md text-on-surface dark:text-white">{MY_BOOKS_PAGE.EMPTY_STATE.HEADING}</h2>
                <p className="mb-xl text-body-md text-on-surface-variant dark:text-slate-400">{MY_BOOKS_PAGE.EMPTY_STATE.DESC}</p>
                <Link
                    href="/"
                    className="flex items-center gap-md rounded-full bg-primary px-xl py-lg font-title-md text-title-md text-on-primary shadow-md transition-all duration-200 hover:bg-primary-container active:scale-95"
                >
                    <MaterialIcon name="explore" />
                    {MY_BOOKS_PAGE.EMPTY_STATE.BROWSE_BUTTON}
                </Link>
            </div>
        </div>
    );
}
