"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import type { Book } from "@/types/book";

interface BorrowSuccessProps {
    book: Book;
    requestId?: string; // e.g. "#BRW-9042"
}

export default function BorrowSuccess({ book, requestId = "#BRW-9042" }: BorrowSuccessProps) {
    const { SUCCESS_PAGE } = UI_TEXT.BORROW;

    // Thay thế đoạn chữ "Book Title" bằng tên sách thực tế, hoặc hiển thị tên sách in đậm
    const parts = SUCCESS_PAGE.PENDING_APPROVAL.split('"Book Title"');

    return (
        <div className="relative flex min-h-[60vh] w-full flex-grow items-center justify-center overflow-hidden px-4 py-12">
            {/* Subtle Ambient Background Decorations */}
            <div className="absolute left-10 top-1/4 h-64 w-64 animate-pulse rounded-full bg-primary-500/5 blur-3xl"></div>
            <div
                className="absolute bottom-1/4 right-10 h-96 w-96 animate-pulse rounded-full bg-secondary-500/5 blur-3xl"
                style={{ animationDelay: "-2s" }}
            ></div>

            {/* Success Container */}
            <div className="z-10 w-full max-w-2xl">
                {/* Glassmorphism Card */}
                <div className="transform rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.01] dark:border-slate-700 dark:bg-slate-900 md:p-12">
                    {/* Animated Icon Container */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary-fixed/30 shadow-[0_0_20px_2px_rgba(45,188,254,0.2)] dark:bg-primary-900/30">
                            <div className="absolute inset-0 animate-ping rounded-full bg-secondary-container/20 opacity-25"></div>
                            <MaterialIcon
                                name="check_circle"
                                className="scale-125 text-[48px] text-primary-700 transition-transform delay-300 duration-500 dark:text-primary-300"
                            />
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="mb-6 font-display-lg text-3xl text-display-lg tracking-tight text-primary-700 dark:text-primary-300 md:text-4xl">
                        {SUCCESS_PAGE.TITLE}
                    </h1>

                    {/* Request Summary Pill */}
                    <div className="mb-8 inline-flex items-center rounded-full bg-surface-container-high px-4 py-1.5 dark:bg-slate-800">
                        <span className="text-secondary-600 dark:text-secondary-400 mr-2 font-label-caps text-label-caps font-bold uppercase">
                            {SUCCESS_PAGE.REQUEST_ID}:
                        </span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">{requestId}</span>
                    </div>

                    {/* Subtext */}
                    <div className="mx-auto mb-10 max-w-lg">
                        <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant dark:text-slate-300">
                            {parts.length === 2 ? (
                                <>
                                    {parts[0]}
                                    <span className="font-semibold text-on-surface dark:text-white">&quot;{book.title}&quot;</span>
                                    {parts[1]}
                                </>
                            ) : (
                                SUCCESS_PAGE.PENDING_APPROVAL
                            )}
                        </p>
                    </div>

                    {/* Book Preview Card */}
                    <div className="mb-10 flex items-center gap-4 rounded-lg border border-outline-variant/20 bg-surface p-4 text-left dark:border-slate-700 dark:bg-slate-800">
                        <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded border border-outline-variant/10 bg-surface-dim shadow-sm dark:border-slate-600 dark:bg-slate-700">
                            {book.imageUrl ? (
                                <Image src={book.imageUrl} alt={book.title} width={64} height={96} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary-100 dark:bg-slate-700">
                                    <MaterialIcon name="book" className="text-primary-500" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="mb-1 line-clamp-1 font-title-md text-title-md text-on-surface dark:text-white">{book.title}</p>
                            <p className="line-clamp-1 font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">
                                {book.authors?.map((a) => a.name).join(", ") || "Unknown Author"} • {book.categories?.[0]?.name || "Sách"}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/lich-su"
                            className="hover:bg-primary-800 w-full rounded-lg bg-primary-700 px-8 py-3 text-center font-title-md text-title-md text-white shadow-md transition-all active:scale-95 sm:w-auto"
                        >
                            {SUCCESS_PAGE.VIEW_LOANS}
                        </Link>
                        <Link
                            href="/"
                            className="border-secondary-600 text-secondary-600 dark:border-secondary-400 dark:text-secondary-400 w-full rounded-lg border-2 px-8 py-3 text-center font-title-md text-title-md transition-all hover:bg-secondary-50 active:scale-95 dark:hover:bg-slate-800 sm:w-auto"
                        >
                            {SUCCESS_PAGE.CONTINUE_BROWSING}
                        </Link>
                    </div>

                    {/* Status Link */}
                    <div className="mt-10">
                        <Link
                            href="#"
                            className="flex items-center justify-center gap-2 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300"
                        >
                            <MaterialIcon name="help_outline" className="text-[18px]" />
                            {SUCCESS_PAGE.HOW_LONG}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
