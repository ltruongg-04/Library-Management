"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { UI_TEXT } from "@/constants/ui-text";

// Dynamic category palette based on hash
const CATEGORY_PALETTE = [
    "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
    "text-tertiary-500 bg-tertiary-500/10 dark:text-white dark:bg-tertiary-500/40",
    "text-error bg-error/10 dark:text-white dark:bg-error/40",
    "text-green-600 bg-green-600/10 dark:text-white dark:bg-green-600/40",
    "text-blue-500 bg-blue-500/10 dark:text-white dark:bg-blue-500/40",
];

const DEFAULT_CATEGORY_STYLE = CATEGORY_PALETTE[0];

const getCategoryStyle = (categoryName?: string) => {
    if (!categoryName) return DEFAULT_CATEGORY_STYLE;
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
        hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length];
};

interface BookItem {
    id: number;
    title: string;
    imageUrl?: string;
    authors?: { name: string }[];
    categories?: { name: string }[];
}

interface BookListGridProps {
    books: BookItem[];
    loading: boolean;
    error: string | null;
    onClearFilters: () => void;
}

export default function BookListGrid({ books, loading, error, onClearFilters }: BookListGridProps) {
    /* Loading State */
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="level-1-shadow flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest dark:bg-slate-900">
                        <Skeleton className="h-56 w-full rounded-none" />
                        <div className="space-y-3 p-5">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    /* Error State */
    if (error) {
        return (
            <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-12 text-center dark:bg-slate-900">
                <MaterialIcon name="error_outline" className="mb-4 text-[64px] text-red-400" />
                <h3 className="mb-2 text-[20px] font-semibold text-on-surface dark:text-white">{UI_TEXT.COMMON.ERROR_LOAD_BOOKS}</h3>
                <button onClick={onClearFilters} className="hover:bg-primary-800 mt-6 rounded-lg bg-primary-700 px-6 py-2 text-white transition-colors">
                    {UI_TEXT.COMMON.RETRY_BTN}
                </button>
            </div>
        );
    }

    /* Empty State */
    if (books.length === 0) {
        return (
            <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-12 text-center dark:bg-slate-900">
                <MaterialIcon name="search_off" className="mb-4 text-[64px] text-on-surface-variant/50 dark:text-white/30" />
                <h3 className="mb-2 text-[20px] font-semibold text-on-surface dark:text-white">{UI_TEXT.BOOK_LIST.NO_RESULTS_HEADING}</h3>
                <p className="text-on-surface-variant dark:text-white/70">{UI_TEXT.BOOK_LIST.NO_RESULTS_DESC}</p>
                <button onClick={onClearFilters} className="hover:bg-primary-800 mt-6 rounded-lg bg-primary-700 px-6 py-2 text-white transition-colors">
                    {UI_TEXT.BOOK_LIST.CLEAR_FILTER_BTN}
                </button>
            </div>
        );
    }

    /* Books Grid */
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {books.map((book) => (
                <Link
                    key={book.id}
                    href={`/sach/${book.id}`}
                    className="level-1-shadow level-2-shadow-hover group flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest transition-all duration-300 dark:bg-slate-900"
                >
                    {/* Cover Image */}
                    <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-surface-container-low p-4 transition-colors duration-200 dark:bg-slate-800">
                        {book.imageUrl ? (
                            <Image
                                src={book.imageUrl}
                                alt={`${UI_TEXT.BOOK_LIST.IMAGE_ALT} ${book.title}`}
                                width={128}
                                height={192}
                                className="h-full w-auto rounded object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                        ) : (
                            <div className="flex h-40 w-28 items-center justify-center rounded bg-primary-container shadow-md transition-transform duration-500 group-hover:scale-105">
                                <MaterialIcon name="menu_book" className="text-[56px] text-on-primary-container" />
                            </div>
                        )}
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-grow flex-col p-5">
                        <h3 className="mb-2 line-clamp-2 font-sans text-[18px] font-semibold leading-tight text-on-surface transition-colors duration-200 group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">
                            {book.title}
                        </h3>
                        <p className="mb-4 line-clamp-1 font-sans text-[14px] text-on-surface-variant transition-colors duration-200 dark:text-white/70">
                            {book.authors?.map((a) => a.name).join(", ")}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                            <span
                                className={`font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] ${getCategoryStyle(book.categories?.[0]?.name)} max-w-[120px] truncate rounded px-2 py-1`}
                                title={book.categories?.[0]?.name}
                            >
                                {book.categories?.[0]?.name || "—"}
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-700/5 text-primary-700 transition-colors hover:bg-primary-700 hover:text-white dark:bg-primary-700/20 dark:text-primary-300 dark:hover:bg-primary-700 dark:hover:text-white">
                                <MaterialIcon name="arrow_forward" className="text-[18px]" />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
