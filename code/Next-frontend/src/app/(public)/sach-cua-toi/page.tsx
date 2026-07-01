"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/providers/auth";

function MyBooksContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();

    const initialLimit = parseInt(searchParams.get("limit") || "12", 10);
    const [limit, setLimit] = useState(initialLimit);

    const { books: displayedBooks, hasMore, removeFavorite } = useFavorites(limit);

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push("/dang-nhap");
        }
    }, [isAuthenticated, router]);

    const handleLoadMore = () => {
        const newLimit = limit + 12;
        setLimit(newLimit);

        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", newLimit.toString());
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col gap-xl px-md py-xl md:px-lg">
            {/* Header & Controls */}
            <div className="flex flex-col items-start gap-md border-b border-outline-variant/30 pb-md md:flex-row md:items-end">
                <div>
                    <h1 className="mb-sm font-display-lg text-display-lg text-on-background">{UI_TEXT.FAVORITE.TITLE}</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">{UI_TEXT.FAVORITE.SUBTITLE}</p>
                </div>

                <div className="relative mt-md w-full max-w-md md:mx-md md:mt-0">
                    <span className="absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">
                        <MaterialIcon name="search" />
                    </span>
                    <input
                        type="text"
                        placeholder={UI_TEXT.FAVORITE.SEARCH_PLACEHOLDER}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-sm pl-xl pr-md font-body-md text-body-md text-on-surface shadow-sm transition-colors focus:border-primary focus:outline-none"
                    />
                </div>

                <div className="flex w-full items-center gap-sm md:w-auto">
                    <button className="flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-on-surface-variant shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-colors hover:bg-surface-container-low">
                        <MaterialIcon name="filter_list" className="text-[18px]" />
                        <span className="font-label-caps text-label-caps uppercase">{UI_TEXT.FAVORITE.FILTER}</span>
                    </button>
                    <button className="flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-on-surface-variant shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-colors hover:bg-surface-container-low">
                        <MaterialIcon name="sort" className="text-[18px]" />
                        <span className="font-label-caps text-label-caps uppercase">{UI_TEXT.FAVORITE.SORT}</span>
                    </button>
                </div>
            </div>

            {/* Bento Grid / Book Cards */}
            <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayedBooks.map((book) => (
                    <article
                        key={book.id}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
                    >
                        {/* AI Pill */}
                        {book.aiMatchScore && (
                            <div className="absolute right-sm top-sm z-10 flex items-center gap-xs rounded-full border border-secondary-fixed/50 bg-surface-container-lowest/90 px-sm py-xs shadow-sm backdrop-blur-sm">
                                <MaterialIcon name="auto_awesome" className="text-[14px] text-tertiary-container" />
                                <span className="font-label-caps text-label-caps font-bold text-tertiary-container">
                                    {book.aiMatchScore}
                                    {UI_TEXT.FAVORITE.MATCH_SUFFIX}
                                </span>
                            </div>
                        )}

                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="h-full w-full rounded-t-[2px] object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Overlay Actions (Hover) */}
                            <div className="absolute inset-0 flex items-center justify-center bg-surface-tint/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                                <button
                                    onClick={() => router.push(`/sach/${book.id}`)}
                                    className="rounded-lg bg-primary px-lg py-sm font-title-md text-title-md text-on-primary shadow-md transition-colors hover:bg-primary-container hover:text-on-primary-container"
                                >
                                    {UI_TEXT.BOOK_DETAIL.BORROW_NOW}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-grow flex-col bg-surface-container-lowest p-md">
                            <div className="mb-sm flex items-start justify-between gap-sm">
                                <div>
                                    <h3 className="line-clamp-2 font-title-md text-title-md text-on-surface">
                                        <Link href={`/sach/${book.id}`} className="transition-colors hover:text-primary">
                                            {book.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">{book.authors?.map((a) => a.name).join(", ")}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFavorite(book.id);
                                    }}
                                    className="group/btn flex-shrink-0 rounded-full p-xs text-primary transition-colors hover:bg-primary/10"
                                    title={UI_TEXT.FAVORITE.REMOVE_TITLE}
                                >
                                    <MaterialIcon name="bookmark_added" className="transition-transform group-active/btn:scale-110" />
                                </button>
                            </div>

                            <div className="mt-auto flex items-center justify-between border-t border-outline-variant/20 pt-md">
                                <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline">
                                    {book.categories?.[0]?.name || "Chưa phân loại"}
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {hasMore && displayedBooks.length > 0 && (
                <div className="mt-xl flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="font-label-lg text-label-lg rounded-full border border-outline bg-surface-container-lowest px-xl py-sm text-on-surface shadow-sm transition-all hover:bg-surface-container-low active:scale-95"
                    >
                        {UI_TEXT.FAVORITE.LOAD_MORE}
                    </button>
                </div>
            )}

            {/* Empty State */}
            {displayedBooks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-xl text-center">
                    <div className="mb-md flex h-24 w-24 items-center justify-center rounded-full bg-surface-container text-outline-variant">
                        <MaterialIcon name="heart_broken" className="text-[48px]" />
                    </div>
                    <h2 className="mb-sm font-headline-lg text-headline-lg text-on-surface">{UI_TEXT.FAVORITE.EMPTY_STATE.HEADING}</h2>
                    <p className="max-w-md font-body-md text-body-md text-on-surface-variant">{UI_TEXT.FAVORITE.EMPTY_STATE.DESC}</p>
                    <button
                        onClick={() => router.push(`/sach`)}
                        className="mt-lg rounded-lg bg-primary px-xl py-sm font-title-md text-title-md text-on-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-colors hover:bg-primary-container hover:text-on-primary-container"
                    >
                        {UI_TEXT.FAVORITE.EMPTY_STATE.EXPLORE_BTN}
                    </button>
                </div>
            )}
        </main>
    );
}

export default function MyBooksPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-grow items-center justify-center py-xl">
                    <MaterialIcon name="progress_activity" className="animate-spin text-[48px] text-primary" />
                </div>
            }
        >
            <MyBooksContent />
        </Suspense>
    );
}
