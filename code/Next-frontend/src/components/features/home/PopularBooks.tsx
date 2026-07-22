"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { API_ERRORS, API_SUCCESS } from "@/constants/ui-text/shared/api";
import { useTrendingBooks } from "@/hooks/useBooks";
import { favoriteService } from "@/services/favorite";
import type { Book } from "@/types/book";

const CATEGORY_STYLES: Record<string, string> = {
    "Khoa học & Công nghệ": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    "Tiểu thuyết": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
    "Lịch sử": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    "Thiết kế & Nghệ thuật": "text-tertiary-500 bg-tertiary-500/10 dark:text-white dark:bg-tertiary-500/40",
    "Kinh doanh": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
};
const DEFAULT_CATEGORY_STYLE = "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40";

// ---------- Featured (Large) Card ----------
function FeaturedBookCard({ book }: { book: Book }) {
    const router = useRouter();

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await favoriteService.addFavorite(book.id);
            toast.success(API_SUCCESS.FAVORITE_ADD_SUCCESS, {
                action: {
                    label: "Tới Sách của tôi",
                    onClick: () => router.push("/sach-cua-toi"),
                },
            });
        } catch (error: any) {
            toast.error(error.message || API_ERRORS.FAVORITE_ADD_FAILED);
        }
    };

    return (
        <Link
            href={`/sach/${book.id}`}
            className="level-1-shadow level-2-shadow-hover group relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-primary-50/60 to-surface-container-lowest transition-all duration-300 dark:from-primary-900/20 dark:to-slate-900"
        >
            {/* Image area — takes up most space */}
            <div className="relative flex min-h-[280px] flex-grow items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50/50 dark:from-primary-900/30 dark:to-slate-800">
                {book.imageUrl ? (
                    <Image
                        src={book.imageUrl}
                        alt={`${UI_TEXT.BOOK_DETAIL.IMAGE_ALT} ${book.title}`}
                        width={200}
                        height={300}
                        className="h-64 w-auto rounded-xl object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                    />
                ) : (
                    <div className="flex h-64 w-40 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-xl">
                        <MaterialIcon name="menu_book" className="text-[80px]" />
                    </div>
                )}
                {/* Rank badge */}
                <div className="ai-gradient-bg absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-bold text-white shadow-lg">
                    1
                </div>
                {/* Gradient overlay at bottom */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-surface-container-lowest/80 to-transparent dark:from-slate-900/80" />
            </div>

            {/* Content */}
            <div className="flex flex-col p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <span
                        className={`font-mono text-[11px] font-medium tracking-[0.05em] ${CATEGORY_STYLES[book.categories?.[0]?.name] || DEFAULT_CATEGORY_STYLE} rounded px-2 py-1`}
                    >
                        {book.categories?.[0]?.name || "—"}
                    </span>
                    <button
                        onClick={handleBookmark}
                        className="flex-shrink-0 text-primary-700 transition-colors hover:text-secondary-300 dark:text-white/50 dark:hover:text-secondary-300"
                        aria-label={`${UI_TEXT.BOOK_DETAIL.ADD_WISHLIST}: ${book.title}`}
                    >
                        <MaterialIcon name="bookmark_add" />
                    </button>
                </div>
                <h3 className="mb-1 line-clamp-1 font-sans text-[20px] font-bold leading-[1.3] text-on-surface transition-colors duration-200 dark:text-white">
                    {book.title}
                </h3>
                <p className="mb-3 line-clamp-1 font-sans text-[13px] text-on-surface-variant transition-colors duration-200 dark:text-white/60">
                    {book.authors?.map((a) => a.name).join(", ")}
                </p>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-700/10 px-3 py-1 text-[12px] font-semibold text-primary-700 dark:bg-white/10 dark:text-white">
                        <MaterialIcon name="trending_up" className="text-[14px]" />
                        {UI_TEXT.HOME.BADGES.TRENDING_1}
                    </span>
                    <span className="ml-auto text-[12px] text-on-surface-variant dark:text-white/50">{UI_TEXT.HOME.VIEW_DETAILS}</span>
                </div>
            </div>
        </Link>
    );
}

// ---------- Small Card ----------
function SmallBookCard({ book, rank }: { book: Book; rank: number }) {
    const router = useRouter();

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await favoriteService.addFavorite(book.id);
            toast.success(API_SUCCESS.FAVORITE_ADD_SUCCESS, {
                action: {
                    label: "Tới Sách của tôi",
                    onClick: () => router.push("/sach-cua-toi"),
                },
            });
        } catch (error: any) {
            toast.error(error.message || API_ERRORS.FAVORITE_ADD_FAILED);
        }
    };

    return (
        <Link
            href={`/sach/${book.id}`}
            className="level-1-shadow group flex items-center gap-4 rounded-xl bg-surface-container-lowest p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900"
        >
            {/* Rank */}
            <span className="w-6 flex-shrink-0 text-center font-mono text-[13px] font-bold text-on-surface-variant/40 dark:text-white/25">{rank}</span>

            {/* Cover */}
            <div className="relative flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-surface-container-low dark:bg-slate-800">
                {book.imageUrl ? (
                    <Image
                        src={book.imageUrl}
                        alt={`${UI_TEXT.BOOK_DETAIL.IMAGE_ALT} ${book.title}`}
                        width={40}
                        height={56}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        unoptimized
                    />
                ) : (
                    <MaterialIcon name="menu_book" className="text-[20px] text-on-surface-variant dark:text-white/40" />
                )}
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-grow flex-col">
                <h3 className="line-clamp-1 font-sans text-[14px] font-semibold text-on-surface transition-colors duration-200 dark:text-white">
                    {book.title}
                </h3>
                <p className="line-clamp-1 font-sans text-[12px] text-on-surface-variant transition-colors duration-200 dark:text-white/50">
                    {book.authors?.map((a) => a.name).join(", ")}
                </p>
                <span
                    className={`mt-1 self-start font-mono text-[10px] font-medium tracking-[0.05em] ${CATEGORY_STYLES[book.categories?.[0]?.name] || DEFAULT_CATEGORY_STYLE} rounded px-1.5 py-0.5`}
                >
                    {book.categories?.[0]?.name || "—"}
                </span>
            </div>

            {/* Bookmark */}
            <button
                onClick={handleBookmark}
                className="flex-shrink-0 text-on-surface-variant/30 transition-colors hover:text-secondary-300 dark:text-white/20 dark:hover:text-secondary-300"
                aria-label={`${UI_TEXT.BOOK_DETAIL.ADD_WISHLIST}: ${book.title}`}
            >
                <MaterialIcon name="bookmark_add" className="text-[18px]" />
            </button>
        </Link>
    );
}

// ---------- Skeleton ----------
function FeaturedSkeleton() {
    return (
        <div className="level-1-shadow flex animate-pulse flex-col overflow-hidden rounded-2xl bg-surface-container-lowest dark:bg-slate-900 md:col-span-2 md:flex-row">
            <div className="h-56 w-full shrink-0 bg-surface-container-low dark:bg-slate-800 md:h-auto md:w-56" />
            <div className="flex flex-grow flex-col gap-3 p-6">
                <div className="h-4 w-16 rounded bg-surface-container-low dark:bg-slate-800" />
                <div className="h-7 w-3/4 rounded bg-surface-container-low dark:bg-slate-800" />
                <div className="h-4 w-1/2 rounded bg-surface-container-low dark:bg-slate-800" />
            </div>
        </div>
    );
}

function SmallSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-4 rounded-xl bg-surface-container-lowest p-3 dark:bg-slate-900">
            <div className="h-4 w-6 rounded bg-surface-container-low dark:bg-slate-800" />
            <div className="h-14 w-10 shrink-0 rounded bg-surface-container-low dark:bg-slate-800" />
            <div className="flex flex-grow flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-surface-container-low dark:bg-slate-800" />
                <div className="h-3 w-1/2 rounded bg-surface-container-low dark:bg-slate-800" />
            </div>
        </div>
    );
}

// ---------- Main export ----------
export default function PopularBooks() {
    const { books, loading, error } = useTrendingBooks(7);

    const featuredBook = books[0] ?? null;
    const listBooks = books.slice(1);

    return (
        <section className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
            {/* Section Header */}
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="font-sans text-[28px] font-bold leading-[36px] tracking-[-0.01em] text-primary-700 transition-colors duration-200 dark:text-white">
                        {UI_TEXT.HOME.TRENDING_HEADING}
                    </h2>
                    <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant transition-colors duration-200 dark:text-white/60">
                        {UI_TEXT.HOME.TRENDING_SUBHEADING}
                    </p>
                </div>
                <Link
                    href="/sach"
                    className="flex items-center gap-1 text-[14px] font-semibold text-secondary-500 transition-colors hover:text-primary-700 dark:text-white/70 dark:hover:text-white"
                >
                    {UI_TEXT.HOME.VIEW_ALL}
                    <MaterialIcon name="arrow_forward" className="text-[16px]" />
                </Link>
            </div>

            {/* Bento Grid */}
            <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
                {/* Left: Featured Book (fixed width ~40%) */}
                <div className="w-full flex-shrink-0 md:w-[38%] lg:w-[32%]">
                    {loading && <FeaturedSkeleton />}
                    {!loading && error && (
                        <div className="flex h-full items-center justify-center gap-2 rounded-2xl bg-surface-container-lowest p-10 text-on-surface-variant dark:bg-slate-900 dark:text-white/60">
                            <MaterialIcon name="error_outline" className="text-[32px] text-red-400" />
                            <p>{UI_TEXT.COMMON.ERROR_LOAD_TRENDING}</p>
                        </div>
                    )}
                    {!loading && !error && featuredBook && <FeaturedBookCard book={featuredBook} />}
                </div>

                {/* Right: List of 6 small books */}
                <div className="flex flex-grow flex-col gap-2">
                    {loading && (
                        <>
                            <SmallSkeleton />
                            <SmallSkeleton />
                            <SmallSkeleton />
                            <SmallSkeleton />
                            <SmallSkeleton />
                            <SmallSkeleton />
                        </>
                    )}
                    {!loading && !error && listBooks.map((book, index) => <SmallBookCard key={book.id} book={book} rank={index + 2} />)}
                    {!loading && !error && books.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-2 py-12 text-on-surface-variant dark:text-white/60">
                            <MaterialIcon name="library_books" className="text-[40px]" />
                            <p className="text-[14px]">{UI_TEXT.COMMON.EMPTY_DATA}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
