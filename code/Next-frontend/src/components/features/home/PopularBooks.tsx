"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
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

function BookCard({ book, hideOnMobile, hideOnTablet }: { book: Book; hideOnMobile?: boolean; hideOnTablet?: boolean }) {
    const router = useRouter();
    let wrapperClass =
        "bg-surface-container-lowest dark:bg-slate-900 rounded-lg level-1-shadow level-2-shadow-hover transition-all duration-300 overflow-hidden flex flex-col h-full group";
    if (hideOnTablet) {
        wrapperClass += " hidden lg:flex";
    } else if (hideOnMobile) {
        wrapperClass += " hidden md:flex";
    }

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await favoriteService.addFavorite(book.id);
            toast.success("Thêm vào danh sách thành công!", {
                action: {
                    label: "Tới Sách của tôi",
                    onClick: () => router.push("/sach-cua-toi"),
                },
            });
        } catch (error: any) {
            toast.error(error.message || "Không thể thêm vào danh sách yêu thích");
        }
    };

    return (
        <Link href={`/sach/${book.id}`} className={wrapperClass}>
            {/* Cover Image Area */}
            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-surface-container-low p-4 transition-colors duration-200 dark:bg-slate-800">
                {book.imageUrl ? (
                    <Image
                        src={book.imageUrl}
                        alt={`Book cover: ${book.title}`}
                        width={128}
                        height={192}
                        className="h-full w-auto rounded object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                    />
                ) : (
                    <div className="flex h-36 w-24 items-center justify-center rounded bg-primary-container text-on-primary-container shadow-md transition-transform duration-500 group-hover:scale-105">
                        <MaterialIcon name="menu_book" className="text-[48px]" />
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="flex flex-grow flex-col p-6">
                <h3 className="mb-1 line-clamp-1 font-sans text-[20px] font-semibold leading-[28px] text-on-surface transition-colors duration-200 dark:text-white">
                    {book.title}
                </h3>
                <p className="mb-4 font-sans text-[14px] leading-[20px] text-on-surface-variant transition-colors duration-200 dark:text-white">
                    {book.authors?.map((a: any) => a.name).join(", ")}
                </p>
                <div className="mt-auto flex items-center justify-between">
                    <span
                        className={`font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] ${CATEGORY_STYLES[book.categories?.[0]?.name] || DEFAULT_CATEGORY_STYLE} max-w-[120px] truncate rounded px-2 py-1`}
                        title={book.categories?.[0]?.name}
                    >
                        {book.categories?.[0]?.name || "—"}
                    </span>
                    <button
                        onClick={handleBookmark}
                        className="text-primary-700 transition-colors hover:text-secondary-300 dark:text-white dark:hover:text-secondary-300"
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
        <div className="level-1-shadow flex h-full animate-pulse flex-col overflow-hidden rounded-lg bg-surface-container-lowest dark:bg-slate-900">
            <div className="h-48 w-full bg-surface-container-low dark:bg-slate-800"></div>
            <div className="flex flex-grow flex-col space-y-3 p-6">
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
        <section className="mx-auto max-w-[1440px] px-4 py-12 lg:px-6">
            {/* Section Header */}
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="font-sans text-[32px] font-semibold leading-[40px] tracking-[-0.01em] text-primary-700 transition-colors duration-200 dark:text-white">
                        {UI_TEXT.HOME.TRENDING_HEADING}
                    </h2>
                    <p className="font-sans text-[16px] leading-[24px] text-on-surface-variant transition-colors duration-200 dark:text-white">
                        {UI_TEXT.HOME.TRENDING_SUBHEADING}
                    </p>
                </div>
                <Link
                    href="/sach"
                    className="flex items-center text-[20px] font-semibold leading-[28px] text-secondary-500 transition-colors hover:text-primary-700 dark:text-white dark:hover:text-primary-300"
                >
                    {UI_TEXT.HOME.VIEW_ALL} <MaterialIcon name="arrow_forward" className="ml-1 text-sm" />
                </Link>
            </div>

            {/* Book Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {loading && (
                    <>
                        <BookCardSkeleton />
                        <BookCardSkeleton />
                        <div className="hidden md:block">
                            <BookCardSkeleton />
                        </div>
                        <div className="hidden lg:block">
                            <BookCardSkeleton />
                        </div>
                    </>
                )}

                {!loading && error && (
                    <div className="col-span-full py-8 text-center text-on-surface-variant dark:text-white/70">
                        <MaterialIcon name="error_outline" className="mb-2 text-[40px] text-red-400" />
                        <p>{UI_TEXT.COMMON.ERROR_LOAD_TRENDING}</p>
                    </div>
                )}

                {!loading && !error && books.length === 0 && (
                    <div className="col-span-full py-8 text-center text-on-surface-variant dark:text-white/70">
                        <MaterialIcon name="library_books" className="mb-2 text-[40px]" />
                        <p>{UI_TEXT.COMMON.EMPTY_DATA}</p>
                    </div>
                )}

                {!loading && !error && books.map((book, index) => <BookCard key={book.id} book={book} hideOnMobile={index >= 2} hideOnTablet={index >= 3} />)}
            </div>
        </section>
    );
}
