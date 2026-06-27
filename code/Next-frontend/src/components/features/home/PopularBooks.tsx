"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { useTrendingBooks } from "@/hooks/useBooks";
import type { Book } from "@/types/book";

const CATEGORY_STYLES: Record<string, string> = {
    "Khoa học & Công nghệ": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    "Tiểu thuyết": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
    "Lịch sử": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    "Thiết kế & Nghệ thuật": "text-tertiary-500 bg-tertiary-500/10 dark:text-white dark:bg-tertiary-500/40",
    "Kinh doanh": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
};

const DEFAULT_CATEGORY_STYLE = "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40";

function BookCard({ book, hideOnMobile, hideOnTablet }: { book: Book; hideOnMobile?: boolean; hideOnTablet?: boolean }) {
    let wrapperClass =
        "bg-surface-container-lowest dark:bg-slate-900 rounded-lg level-1-shadow level-2-shadow-hover transition-all duration-300 overflow-hidden flex flex-col h-full group";
    if (hideOnTablet) {
        wrapperClass += " hidden lg:flex";
    } else if (hideOnMobile) {
        wrapperClass += " hidden md:flex";
    }

    return (
        <Link href={`/sach/${book.id}`} className={wrapperClass}>
            {/* Cover Image Area */}
            <div className="relative h-48 w-full overflow-hidden bg-surface-container-low p-4 flex items-center justify-center transition-colors duration-200 dark:bg-slate-800">
                {book.imageUrl ? (
                    <Image
                        src={book.imageUrl}
                        alt={`Book cover: ${book.title}`}
                        width={128}
                        height={192}
                        className="h-full w-auto object-cover rounded shadow-sm group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                    />
                ) : (
                    <div className="w-24 h-36 bg-primary-container rounded shadow-md flex items-center justify-center text-on-primary-container group-hover:scale-105 transition-transform duration-500">
                        <MaterialIcon name="menu_book" className="text-[48px]" />
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-sans text-[20px] font-semibold leading-[28px] text-on-surface dark:text-white mb-1 line-clamp-1 transition-colors duration-200">
                    {book.title}
                </h3>
                <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant dark:text-white mb-4 transition-colors duration-200">
                    {book.author}
                </p>
                <div className="mt-auto flex justify-between items-center">
                    <span
                        className={`font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] ${CATEGORY_STYLES[book.category] || DEFAULT_CATEGORY_STYLE} px-2 py-1 rounded max-w-[120px] truncate`}
                        title={book.category}
                    >
                        {book.category || "—"}
                    </span>
                    <button
                        className="text-primary-700 dark:text-white hover:text-secondary-300 dark:hover:text-secondary-300 transition-colors"
                        aria-label={`Bookmark ${book.title}`}
                    >
                        <MaterialIcon name="bookmark_add" />
                    </button>
                </div>
            </div>
        </Link>
    );
}

function BookCardSkeleton() {
    return (
        <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-lg level-1-shadow overflow-hidden flex flex-col h-full animate-pulse">
            <div className="h-48 w-full bg-surface-container-low dark:bg-slate-800"></div>
            <div className="p-6 flex flex-col flex-grow space-y-3">
                <div className="h-5 w-3/4 rounded bg-surface-container-low dark:bg-slate-800"></div>
                <div className="h-4 w-1/2 rounded bg-surface-container-low dark:bg-slate-800"></div>
                <div className="mt-auto h-4 w-1/3 rounded bg-surface-container-low dark:bg-slate-800"></div>
            </div>
        </div>
    );
}

export default function PopularBooks() {
    const { books, loading, error } = useTrendingBooks(4);

    return (
        <section className="py-12 px-4 lg:px-6 max-w-[1440px] mx-auto">
            {/* Section Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="font-sans text-[32px] font-semibold leading-[40px] tracking-[-0.01em] text-primary-700 dark:text-white transition-colors duration-200">
                        {UI_TEXT.HOME.TRENDING_HEADING}
                    </h2>
                    <p className="font-sans text-[16px] leading-[24px] text-on-surface-variant dark:text-white transition-colors duration-200">
                        {UI_TEXT.HOME.TRENDING_SUBHEADING}
                    </p>
                </div>
                <Link
                    href="/sach"
                    className="text-secondary-500 dark:text-white font-semibold text-[20px] leading-[28px] hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center"
                >
                    {UI_TEXT.HOME.VIEW_ALL}{" "}
                    <MaterialIcon name="arrow_forward" className="ml-1 text-sm" />
                </Link>
            </div>

            {/* Book Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading && (
                    <>
                        <BookCardSkeleton />
                        <BookCardSkeleton />
                        <div className="hidden md:block"><BookCardSkeleton /></div>
                        <div className="hidden lg:block"><BookCardSkeleton /></div>
                    </>
                )}

                {!loading && error && (
                    <div className="col-span-full text-center py-8 text-on-surface-variant dark:text-white/70">
                        <MaterialIcon name="error_outline" className="mb-2 text-[40px] text-red-400" />
                        <p>{UI_TEXT.COMMON.ERROR_LOAD_TRENDING}</p>
                    </div>
                )}

                {!loading && !error && books.length === 0 && (
                    <div className="col-span-full text-center py-8 text-on-surface-variant dark:text-white/70">
                        <MaterialIcon name="library_books" className="mb-2 text-[40px]" />
                        <p>{UI_TEXT.COMMON.EMPTY_DATA}</p>
                    </div>
                )}

                {!loading && !error && books.map((book, index) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        hideOnMobile={index >= 2}
                        hideOnTablet={index >= 3}
                    />
                ))}
            </div>
        </section>
    );
}
