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

export default function MyBooksPage() {
    const [loan1, loan2, loan3] = MOCK_LOANS;

    return (
        <div className="mx-auto max-w-container-max px-lg pb-xl pt-6">
            {/* Title & Breadcrumb */}
            <div className="mb-lg">
                <div className="mb-sm flex items-center gap-xs text-body-sm text-on-surface-variant">
                    <span>{MY_BOOKS_PAGE.BREADCRUMB_ACCOUNT}</span>
                    <span className="material-symbols-outlined text-[16px]">{"chevron_right"}</span>
                    <span className="font-medium text-primary">{MY_BOOKS_PAGE.TITLE}</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-primary">{MY_BOOKS_PAGE.TITLE}</h1>
            </div>

            {/* Filter Bar */}
            <div className="mb-lg flex flex-wrap items-center justify-between gap-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-md">
                    <div className="flex flex-col gap-xs">
                        <label className="ml-1 font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">
                            {MY_BOOKS_PAGE.FILTER.STATUS_LABEL}
                        </label>
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
                        <label className="ml-1 font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">
                            {MY_BOOKS_PAGE.FILTER.DATE_RANGE_LABEL}
                        </label>
                        <div className="flex items-center gap-sm">
                            <div className="relative">
                                <input
                                    className="h-10 cursor-pointer rounded-lg border-none bg-surface-container-low px-md text-body-sm focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white"
                                    type="date"
                                />
                            </div>
                            <span className="text-outline">{MY_BOOKS_PAGE.FILTER.DATE_TO}</span>
                            <div className="relative">
                                <input
                                    className="h-10 cursor-pointer rounded-lg border-none bg-surface-container-low px-md text-body-sm focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white"
                                    type="date"
                                />
                            </div>
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
                {/* Loan Record Item 1: Borrowing */}
                <div className="group rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-lg md:flex-row">
                        <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm dark:border-slate-700">
                            <Image src={loan1.imgSrc} alt="Cover" fill className="object-cover" />
                        </div>
                        <div className="flex flex-grow flex-col justify-between md:flex-row">
                            <div className="space-y-sm">
                                <div className="flex items-center gap-md">
                                    <h3 className="font-title-md text-title-md text-on-surface transition-colors group-hover:text-primary dark:text-white">
                                        {loan1.title}
                                    </h3>
                                    <span className="flex items-center gap-xs rounded-full bg-secondary-container/20 px-sm py-1 font-label-caps text-label-caps text-secondary">
                                        <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                                        {MY_BOOKS_PAGE.CARD.STATUS_BORROWING}
                                    </span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant dark:text-slate-400">
                                    {MY_BOOKS_PAGE.CARD.AUTHOR_PREFIX} {loan1.author}
                                </p>
                                <div className="grid grid-cols-2 gap-lg pt-sm lg:grid-cols-3">
                                    <div>
                                        <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.BORROW_DATE}</p>
                                        <p className="text-body-md font-medium dark:text-white">{loan1.borrowDate}</p>
                                    </div>
                                    <div>
                                        <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.DUE_DATE}</p>
                                        <p className="text-body-md font-medium text-secondary">{loan1.dueDate}</p>
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.ACTUAL_RETURN_DATE}</p>
                                        <p className="text-body-md text-on-surface-variant dark:text-slate-400">{loan1.actualReturnDate ?? DASH}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-md flex flex-col justify-between border-t border-outline-variant/30 pt-md dark:border-slate-700 md:mt-0 md:border-l md:border-t-0 md:pl-lg md:pt-0 md:text-right">
                                <div>
                                    <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.DEPOSIT}</p>
                                    <p className="text-body-md font-bold dark:text-white">{loan1.deposit}</p>
                                </div>
                                <Link
                                    href={`/my-books/${loan1.id}`}
                                    className="mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-primary decoration-2 hover:underline"
                                >
                                    {MY_BOOKS_PAGE.CARD.VIEW_DETAIL}
                                    <MaterialIcon name="arrow_forward" className="text-[18px]" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Record Item 2: Overdue */}
                <div className="group rounded-xl border border-error/20 bg-surface-container-lowest p-lg shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900">
                    <div className="flex flex-col gap-lg md:flex-row">
                        <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm dark:border-slate-700">
                            <Image src={loan2.imgSrc} alt="Cover" fill className="object-cover" />
                        </div>
                        <div className="flex flex-grow flex-col justify-between md:flex-row">
                            <div className="space-y-sm">
                                <div className="flex items-center gap-md">
                                    <h3 className="font-title-md text-title-md text-on-surface dark:text-white">{loan2.title}</h3>
                                    <span className="flex items-center gap-xs rounded-full bg-error-container/30 px-sm py-1 font-label-caps text-label-caps text-error">
                                        <span className="h-1.5 w-1.5 rounded-full bg-error"></span>
                                        {MY_BOOKS_PAGE.STATUS_OVERDUE}
                                    </span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant dark:text-slate-400">
                                    {MY_BOOKS_PAGE.CARD.AUTHOR_PREFIX} {loan2.author}
                                </p>
                                <div className="grid grid-cols-2 gap-lg pt-sm lg:grid-cols-3">
                                    <div>
                                        <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.BORROW_DATE}</p>
                                        <p className="text-body-md font-medium dark:text-white">{loan2.borrowDate}</p>
                                    </div>
                                    <div>
                                        <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.DUE_DATE}</p>
                                        <p className="text-body-md font-medium text-error">{loan2.dueDate}</p>
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.ACTUAL_RETURN_DATE}</p>
                                        <p className="text-body-md text-on-surface-variant dark:text-slate-400">{loan2.actualReturnDate ?? DASH}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-md flex flex-col justify-between border-t border-outline-variant/30 pt-md dark:border-slate-700 md:mt-0 md:border-l md:border-t-0 md:pl-lg md:pt-0 md:text-right">
                                <div className="space-y-xs">
                                    <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.DEPOSIT}</p>
                                    <p className="text-body-sm text-on-surface-variant line-through dark:text-slate-500">{loan2.deposit}</p>
                                    <p className="mt-2 font-label-caps text-label-caps uppercase text-error">{MY_BOOKS_PAGE.CARD.LATE_FEE_LABEL}</p>
                                    <p className="text-body-md font-bold text-error">{loan2.lateFee}</p>
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                    <Link
                                        href={`/my-books/${loan2.id}`}
                                        className="mr-4 mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-primary decoration-2 hover:underline"
                                    >
                                        {MY_BOOKS_PAGE.CARD.VIEW_DETAIL}
                                    </Link>
                                    <button className="mt-md rounded-lg bg-error px-md py-2 font-body-md text-body-sm text-on-error transition-all hover:opacity-90">
                                        {MY_BOOKS_PAGE.RENEW_NOW}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Record Item 3: Returned */}
                <div className="group rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg opacity-80 shadow-sm transition-opacity transition-shadow hover:opacity-100 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-lg md:flex-row">
                        <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm grayscale transition-all group-hover:grayscale-0 dark:border-slate-700">
                            <Image src={loan3.imgSrc} alt="Cover" fill className="object-cover" />
                        </div>
                        <div className="flex flex-grow flex-col justify-between md:flex-row">
                            <div className="space-y-sm">
                                <div className="flex items-center gap-md">
                                    <h3 className="font-title-md text-title-md text-on-surface dark:text-white">{loan3.title}</h3>
                                    <span className="flex items-center gap-xs rounded-full bg-surface-container-high px-sm py-1 font-label-caps text-label-caps text-on-surface-variant dark:bg-slate-800 dark:text-slate-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-outline"></span>
                                        {MY_BOOKS_PAGE.CARD.STATUS_RETURNED}
                                    </span>
                                </div>
                                <p className="text-body-sm text-on-surface-variant dark:text-slate-400">
                                    {MY_BOOKS_PAGE.CARD.AUTHOR_PREFIX} {loan3.author}
                                </p>
                                <div className="grid grid-cols-2 gap-lg pt-sm lg:grid-cols-3">
                                    <div>
                                        <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.BORROW_DATE}</p>
                                        <p className="text-body-md font-medium dark:text-white">{loan3.borrowDate}</p>
                                    </div>
                                    <div>
                                        <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.DUE_DATE}</p>
                                        <p className="text-body-md font-medium dark:text-white">{loan3.dueDate}</p>
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.ACTUAL_RETURN_DATE}</p>
                                        <p className="text-body-md font-medium text-primary">{loan3.actualReturnDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-md flex flex-col justify-between border-t border-outline-variant/30 pt-md dark:border-slate-700 md:mt-0 md:border-l md:border-t-0 md:pl-lg md:pt-0 md:text-right">
                                <div>
                                    <p className="font-label-caps text-label-caps uppercase text-outline">{MY_BOOKS_PAGE.CARD.DEPOSIT_RETURN}</p>
                                    <p className="text-body-md font-bold text-on-surface-variant dark:text-slate-300">{loan3.depositReturn}</p>
                                </div>
                                <Link
                                    href={`/my-books/${loan3.id}`}
                                    className="mt-md flex items-center justify-end gap-xs text-body-sm font-medium text-primary hover:underline"
                                >
                                    {MY_BOOKS_PAGE.CARD.VIEW_RECEIPT}
                                    <MaterialIcon name="receipt_long" className="text-[18px]" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
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
