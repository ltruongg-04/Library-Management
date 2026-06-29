"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import type { BookDetail } from "@/types/book";

interface BookCoverProps {
    book: BookDetail;
}

export default function BookCover({ book }: BookCoverProps) {
    const router = useRouter();
    const isAvailable = book.availableCount > 0;
    const hasCoverImage = book.coverImage && book.coverImage.length > 0;

    return (
        <div className="flex flex-col gap-2">
            {/* Cover Image */}
            <div className="relative overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900">
                {hasCoverImage ? (
                    <Image
                        src={book.coverImage}
                        alt={`Book Cover: ${book.title}`}
                        width={400}
                        height={600}
                        className="aspect-[2/3] h-auto w-full rounded-t-sm object-cover"
                        priority
                        unoptimized
                    />
                ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center bg-primary-container">
                        <MaterialIcon name="menu_book" className="text-[80px] text-on-primary-container" />
                    </div>
                )}

                {/* AI Match Score Badge */}
                {book.aiMatchScore && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest/90 px-2 py-1 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
                        <MaterialIcon name="temp_preferences_custom" className="text-[14px] text-secondary dark:text-white" />
                        <span className="font-label-caps text-label-caps font-bold text-secondary dark:text-white">
                            {book.aiMatchScore}
                            {UI_TEXT.BOOK_DETAIL.MATCH_SCORE_SUFFIX}
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-2 flex flex-col gap-2">
                <button
                    onClick={() => router.push(`/sach/${book.id}/muon`)}
                    disabled={!isAvailable}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-label-caps text-label-caps text-on-primary shadow-sm transition-colors duration-200 hover:bg-on-primary-fixed-variant active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500"
                >
                    <MaterialIcon name="book" />
                    {UI_TEXT.BOOK_DETAIL.BORROW_NOW}
                </button>
                <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-secondary bg-transparent px-4 py-2 font-label-caps text-label-caps text-secondary transition-colors duration-200 hover:bg-secondary/10 active:scale-95 dark:border-white dark:text-white dark:hover:bg-white/10">
                    <MaterialIcon name="bookmark_add" />
                    {UI_TEXT.BOOK_DETAIL.ADD_WISHLIST}
                </button>
            </div>
        </div>
    );
}
