"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { bookService } from "@/services/book";
import { favoriteService } from "@/services/favorite";
import type { BookListItem } from "@/types/book";

const CATEGORY_STYLES: Record<string, string> = {
    "Khoa học & Công nghệ": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    "Tiểu thuyết": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
    "Lịch sử": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    "Thiết kế & Nghệ thuật": "text-tertiary-500 bg-tertiary-500/10 dark:text-white dark:bg-tertiary-500/40",
    "Kinh doanh": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
};
const DEFAULT_CATEGORY_STYLE = "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40";

function BookCard({ book }: { book: BookListItem }) {
    const router = useRouter();

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
        <Link
            href={`/sach/${book.id}`}
            className="level-1-shadow group flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-900"
        >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface-container-low dark:bg-slate-800">
                {book.imageUrl ? (
                    <Image
                        src={book.imageUrl}
                        alt={`Book cover: ${book.title}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <MaterialIcon name="menu_book" className="text-[32px] text-on-surface-variant/50 dark:text-white/40" />
                    </div>
                )}
                <div className="absolute left-2 top-2 flex items-center justify-center rounded-full bg-surface-container-lowest/90 px-2 py-0.5 text-[11px] font-bold text-primary-700 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-white">
                    <MaterialIcon name="star" className="mr-0.5 text-[12px] text-yellow-400" />
                    {book.rating?.toFixed(1) || "5.0"}
                </div>
            </div>

            <div className="flex flex-grow flex-col">
                <h3 className="line-clamp-2 font-sans text-[15px] font-bold leading-[1.3] text-on-surface transition-colors dark:text-white">{book.title}</h3>
                <p className="mt-1 line-clamp-1 font-sans text-[13px] text-on-surface-variant dark:text-white/60">
                    {book.authors?.map((a) => a.name).join(", ")}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                    <span
                        className={`font-mono text-[10px] font-medium tracking-[0.05em] ${CATEGORY_STYLES[book.categories?.[0]?.name] || DEFAULT_CATEGORY_STYLE} rounded px-1.5 py-0.5`}
                    >
                        {book.categories?.[0]?.name || "—"}
                    </span>
                    <button
                        onClick={handleBookmark}
                        className="text-on-surface-variant/30 transition-colors hover:text-secondary-300 dark:text-white/20 dark:hover:text-secondary-300"
                        aria-label="Add to wishlist"
                    >
                        <MaterialIcon name="bookmark_add" className="text-[18px]" />
                    </button>
                </div>
            </div>
        </Link>
    );
}

function CardSkeleton() {
    return (
        <div className="flex animate-pulse flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 dark:bg-slate-900">
            <div className="aspect-[3/4] w-full rounded-xl bg-surface-container-low dark:bg-slate-800" />
            <div className="h-4 w-3/4 rounded bg-surface-container-low dark:bg-slate-800" />
            <div className="h-3 w-1/2 rounded bg-surface-container-low dark:bg-slate-800" />
            <div className="mt-2 h-4 w-1/3 rounded bg-surface-container-low dark:bg-slate-800" />
        </div>
    );
}

export default function TopRatedBooks() {
    const [books, setBooks] = useState<BookListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchBooks = async () => {
            try {
                const data = await bookService.getTopRatedBooks();
                if (isMounted) {
                    setBooks(data.slice(0, 6)); // limit to 6 for a nice grid
                }
            } catch (err) {
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchBooks();
        return () => {
            isMounted = false;
        };
    }, []);

    if (error || (!loading && books.length === 0)) return null;

    return (
        <section className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="font-sans text-[28px] font-bold leading-[36px] tracking-[-0.01em] text-primary-700 transition-colors duration-200 dark:text-white">
                        {UI_TEXT.HOME.TOP_RATED_HEADING}
                    </h2>
                    <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant transition-colors duration-200 dark:text-white/60">
                        {UI_TEXT.HOME.TOP_RATED_SUBHEADING}
                    </p>
                </div>
                <Link
                    href="/sach?sortBy=mostRead"
                    className="flex items-center gap-1 text-[14px] font-semibold text-secondary-500 transition-colors hover:text-primary-700 dark:text-white/70 dark:hover:text-white"
                >
                    {UI_TEXT.HOME.VIEW_ALL}
                    <MaterialIcon name="arrow_forward" className="text-[16px]" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {loading && Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                {!loading && books.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
        </section>
    );
}
