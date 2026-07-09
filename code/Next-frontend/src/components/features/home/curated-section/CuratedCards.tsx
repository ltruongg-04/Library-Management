"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { type RecommendedCollection, getCategoryIcon } from "@/hooks/useRecommendations";
import { BookThumbnails, WishlistButton, useFadeInOnScroll } from "./CuratedUI";

export function FeaturedCollectionCard({ collection, onDismiss }: { collection: RecommendedCollection; onDismiss: () => void }) {
    const router = useRouter();
    const { ref, visible } = useFadeInOnScroll();
    const featuredBook = collection.books[0];

    const handleNavigate = (e: React.MouseEvent) => {
        e.preventDefault();
        const query = collection.categoryId ? `/sach?category=${collection.categoryId}` : `/sach?keyword=${encodeURIComponent(collection.categoryName)}`;
        router.push(query);
    };

    return (
        <div
            ref={ref}
            className={`level-1-shadow group relative flex h-full min-h-[320px] w-full flex-col overflow-hidden rounded-2xl border border-transparent bg-gradient-to-br from-primary-50 to-surface-container-lowest p-8 transition-all duration-700 hover:border-secondary-300/30 hover:shadow-lg dark:from-primary-900/20 dark:to-slate-900 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
        >
            <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
                <button
                    onClick={onDismiss}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-lowest/80 text-on-surface-variant/60 shadow-sm transition-colors duration-200 hover:bg-red-50 hover:text-red-500 dark:bg-slate-800/80 dark:text-white/40 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    aria-label={UI_TEXT.HOME.CURATED_SECTION.DISMISS}
                    title={UI_TEXT.HOME.CURATED_SECTION.DISMISS}
                >
                    <MaterialIcon name="close" className="text-[16px]" />
                </button>
            </div>

            <div className="relative z-10 flex h-full w-full flex-col items-center justify-between gap-8 md:flex-row">
                {/* Left side: text */}
                <div className="flex h-full flex-1 flex-col justify-center">
                    <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-lg bg-primary-700/10 px-3 py-1.5 dark:bg-white/10">
                        <MaterialIcon name={getCategoryIcon(collection.categoryName)} className="text-[16px] text-primary-700 dark:text-white" />
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary-700 dark:text-white">
                            {collection.reason === "favorite"
                                ? UI_TEXT.HOME.CURATED_SECTION.BASED_ON_FAVORITES
                                : collection.reason === "history"
                                  ? UI_TEXT.HOME.CURATED_SECTION.BASED_ON_HISTORY
                                  : UI_TEXT.HOME.CURATED_SECTION.PERSONALIZED_LABEL}
                        </span>
                    </div>

                    <h3 className="mb-3 font-sans text-[32px] font-bold leading-[1.2] tracking-tight text-primary-700 transition-colors duration-200 dark:text-white">
                        {collection.categoryName}
                    </h3>
                    <p className="mb-6 max-w-md font-sans text-[15px] leading-[24px] text-on-surface-variant transition-colors duration-200 dark:text-white/70">
                        {collection.description}
                    </p>

                    <div className="mt-auto flex items-center gap-4 pt-2">
                        <button
                            onClick={handleNavigate}
                            className="ai-gradient-bg rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                        >
                            {UI_TEXT.HOME.CURATED_SECTION.VIEW_CATEGORY}
                        </button>
                        {featuredBook && <WishlistButton book={featuredBook} />}
                    </div>
                </div>

                {/* Right side: Book Cover */}
                {featuredBook && (
                    <div className="relative mt-6 flex w-32 shrink-0 justify-center md:mt-0 md:w-44">
                        {featuredBook.imageUrl ? (
                            <Image
                                src={featuredBook.imageUrl}
                                alt={featuredBook.title}
                                width={176}
                                height={264}
                                className="h-auto w-full rounded-lg object-cover shadow-2xl transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105"
                                unoptimized
                            />
                        ) : (
                            <div className="flex h-56 w-36 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-2xl">
                                <MaterialIcon name="menu_book" className="text-[48px]" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export function SmallCollectionCard({ collection, onDismiss, delay }: { collection: RecommendedCollection; onDismiss: () => void; delay?: number }) {
    const router = useRouter();
    const { ref, visible } = useFadeInOnScroll();
    const [dismissed, setDismissed] = useState(false);

    const handleNavigate = () => {
        const query = collection.categoryId ? `/sach?category=${collection.categoryId}` : `/sach?keyword=${encodeURIComponent(collection.categoryName)}`;
        router.push(query);
    };

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDismissed(true);
        setTimeout(onDismiss, 300);
    };

    return (
        <div
            ref={ref}
            style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
            className={`level-1-shadow group relative flex flex-1 flex-col rounded-xl border border-transparent bg-surface-container-lowest p-5 transition-all duration-500 hover:border-secondary-300/30 hover:shadow-md dark:bg-slate-900 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } ${dismissed ? "pointer-events-none scale-95 opacity-0" : ""}`}
        >
            <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
                <button
                    onClick={handleDismiss}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-on-surface-variant/40 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-white/30 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    aria-label={UI_TEXT.HOME.CURATED_SECTION.DISMISS}
                    title={UI_TEXT.HOME.CURATED_SECTION.DISMISS}
                >
                    <MaterialIcon name="close" className="text-[14px]" />
                </button>
            </div>

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/20 text-primary-700 transition-colors duration-200 dark:bg-white/10 dark:text-white">
                <MaterialIcon name={getCategoryIcon(collection.categoryName)} className="text-[20px]" />
            </div>

            <div className="flex-grow">
                <h3 className="mb-1 line-clamp-1 font-sans text-[16px] font-bold leading-[1.3] text-primary-700 transition-colors duration-200 dark:text-white">
                    {collection.categoryName}
                </h3>
                <p className="line-clamp-2 font-sans text-[13px] leading-[20px] text-on-surface-variant transition-colors duration-200 dark:text-white/60">
                    {collection.description}
                </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[12px] text-on-surface-variant transition-colors duration-200 dark:text-white/50">
                        {UI_TEXT.HOME.CURATED_SECTION.BOOKS_COUNT(collection.totalBooks)}
                    </span>
                </div>
                <button
                    onClick={handleNavigate}
                    className="flex items-center gap-1 text-[13px] font-semibold text-secondary-500 transition-colors duration-200 hover:text-primary-700 dark:text-white/60 dark:hover:text-white"
                    aria-label={`Xem ${collection.categoryName}`}
                >
                    <MaterialIcon name="arrow_forward" className="text-[16px]" />
                </button>
            </div>

            <BookThumbnails books={collection.books} />
        </div>
    );
}
