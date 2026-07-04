"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import Breadcrumb from "@/components/features/book-detail/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { UI_TEXT } from "@/constants/ui-text";
import { useBooks } from "@/hooks/useBooks";

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

export default function BookListPage() {
    const {
        books,
        loading,
        error,
        page,
        totalPages,
        totalElements,
        setPage,
        setKeyword,
        setCategory,
        setAuthorId,
        setPublisher,
        setMinRating,
        setIsAvailable,
        clearFilters,
        setSortBy,
        currentParams,
    } = useBooks({ size: 12 });

    const [selectedCategory, setSelectedCategory] = React.useState<string | number>("all");
    const [searchInput, setSearchInput] = React.useState("");
    const [categories, setCategories] = React.useState<{ id: string | number; name: string }[]>([{ id: "all", name: UI_TEXT.BOOK_LIST.CATEGORIES.ALL }]);

    // UI state for showing active text-based filters
    const [activeAuthorName, setActiveAuthorName] = React.useState<string | null>(null);
    const [activePublisher, setActivePublisher] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Init filters from URL
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const categoryQuery = params.get("category");
            if (categoryQuery) {
                const catId = parseInt(categoryQuery, 10) || categoryQuery;
                setSelectedCategory(catId);
                setCategory(categoryQuery);
            }

            const authorIdQuery = params.get("authorId");
            const authorNameQuery = params.get("authorName");
            if (authorIdQuery) {
                setAuthorId(parseInt(authorIdQuery, 10));
                if (authorNameQuery) setActiveAuthorName(authorNameQuery);
            }

            const publisherQuery = params.get("publisher");
            if (publisherQuery) {
                setPublisher(publisherQuery);
                setActivePublisher(publisherQuery);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        import("@/services/category").then(({ categoryService }) => {
            categoryService
                .getAllCategories()
                .then((data) => {
                    const dynamicCategories = data.map((c) => ({ id: c.id, name: c.name })).sort((a, b) => a.name.localeCompare(b.name));
                    setCategories([{ id: "all", name: UI_TEXT.BOOK_LIST.CATEGORIES.ALL }, ...dynamicCategories]);
                })
                .catch((err) => console.error("Failed to fetch categories:", err));
        });
    }, []);

    const handleCategoryChange = (categoryId: string | number) => {
        setSelectedCategory(categoryId);
        if (categoryId === "all") {
            setCategory("");
        } else {
            setCategory(categoryId.toString());
        }
    };

    const handleSearch = (value: string) => {
        setSearchInput(value);
        setKeyword(value);
    };

    const handleClearFilters = () => {
        setSelectedCategory("all");
        setSearchInput("");
        setActiveAuthorName(null);
        setActivePublisher(null);
        clearFilters();
    };

    const clearAuthorFilter = () => {
        setActiveAuthorName(null);
        setAuthorId(undefined);
    };

    const clearPublisherFilter = () => {
        setActivePublisher(null);
        setPublisher(undefined);
    };

    const breadcrumbItems = [{ label: UI_TEXT.BOOK_LIST.BREADCRUMB_HOME, href: "/" }, { label: UI_TEXT.BOOK_LIST.BREADCRUMB_LIST }];

    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 md:px-6">
            {/* Breadcrumb */}
            <div className="py-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Hero Section */}
            <div className="level-2-shadow relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 to-secondary-500 p-8 text-white dark:from-slate-800 dark:to-slate-900 md:p-12">
                <div className="relative z-10">
                    <h1 className="mb-4 font-sans text-[36px] font-bold leading-tight md:text-[48px]">{UI_TEXT.BOOK_LIST.HERO_HEADING}</h1>
                    <p className="mb-8 max-w-2xl font-sans text-[16px] opacity-90 md:text-[20px]">{UI_TEXT.BOOK_LIST.HERO_SUBHEADING}</p>
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder={UI_TEXT.BOOK_LIST.SEARCH_PLACEHOLDER}
                            className="w-full rounded-full border border-white/20 bg-white/10 py-3 pl-12 pr-4 text-white placeholder-white/60 backdrop-blur-sm transition-colors focus:bg-white/20 focus:outline-none"
                            value={searchInput}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute bottom-0 right-32 h-48 w-48 translate-y-1/2 rounded-full bg-secondary-300/20 blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Sidebar Filters */}
                <div className="space-y-8 lg:col-span-1">
                    <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-6 dark:bg-slate-900">
                        <h3 className="mb-4 flex items-center font-sans text-[20px] font-semibold text-on-surface dark:text-white">
                            <MaterialIcon name="category" className="mr-2 text-primary-700 dark:text-primary-300" />
                            {UI_TEXT.BOOK_LIST.SIDEBAR_CATEGORY}
                        </h3>
                        <select
                            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-on-surface focus:border-primary-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            value={selectedCategory}
                            onChange={(e) => {
                                const id = e.target.value;
                                handleCategoryChange(id === "all" ? "all" : Number(id));
                            }}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-6 dark:bg-slate-900">
                        <h3 className="mb-4 flex items-center font-sans text-[20px] font-semibold text-on-surface dark:text-white">
                            <MaterialIcon name="tune" className="mr-2 text-primary-700 dark:text-primary-300" />
                            {UI_TEXT.BOOK_LIST.SIDEBAR_FILTER}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-[14px] text-on-surface-variant dark:text-white/70">{UI_TEXT.BOOK_LIST.SORT_LABEL}</label>
                                <select
                                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-on-surface focus:border-primary-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    value={currentParams.sortBy || "newest"}
                                >
                                    <option value="newest">{UI_TEXT.BOOK_LIST.SORT_OPTIONS.NEWEST}</option>
                                    <option value="oldest">{UI_TEXT.BOOK_LIST.SORT_OPTIONS.OLDEST}</option>
                                    <option value="title">{UI_TEXT.BOOK_LIST.SORT_OPTIONS.TITLE}</option>
                                    <option value="titleDesc">{UI_TEXT.BOOK_LIST.SORT_OPTIONS.TITLE_DESC}</option>
                                    <option value="author">{UI_TEXT.BOOK_LIST.SORT_OPTIONS.AUTHOR}</option>
                                    <option value="authorDesc">{UI_TEXT.BOOK_LIST.SORT_OPTIONS.AUTHOR_DESC}</option>
                                    <option value="mostRead">{UI_TEXT.BOOK_LIST.SORT_OPTIONS.MOST_READ}</option>
                                    <option value="leastRead">{UI_TEXT.BOOK_LIST.SORT_OPTIONS.LEAST_READ}</option>
                                </select>
                            </div>

                            {/* Đánh giá */}
                            <div>
                                <label className="mb-2 block text-[14px] text-on-surface-variant dark:text-white/70">{UI_TEXT.BOOK_LIST.SIDEBAR_RATING}</label>
                                <select
                                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-on-surface focus:border-primary-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    value={currentParams.minRating?.toString() || ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setMinRating(val ? Number(val) : undefined);
                                    }}
                                >
                                    <option value="">{UI_TEXT.BOOK_LIST.RATING_OPTIONS.ALL}</option>
                                    <option value="4">{UI_TEXT.BOOK_LIST.RATING_OPTIONS.UP_TO_4}</option>
                                    <option value="3">{UI_TEXT.BOOK_LIST.RATING_OPTIONS.UP_TO_3}</option>
                                    <option value="2">{UI_TEXT.BOOK_LIST.RATING_OPTIONS.UP_TO_2}</option>
                                    <option value="1">{UI_TEXT.BOOK_LIST.RATING_OPTIONS.UP_TO_1}</option>
                                </select>
                            </div>

                            {/* Tình trạng sách */}
                            <div className="flex items-center pt-2">
                                <input
                                    type="checkbox"
                                    id="isAvailableCheckbox"
                                    className="text-primary-600 h-4 w-4 rounded border-outline-variant/30 focus:ring-primary-500"
                                    checked={currentParams.isAvailable || false}
                                    onChange={(e) => setIsAvailable(e.target.checked ? true : undefined)}
                                />
                                <label htmlFor="isAvailableCheckbox" className="ml-2 block text-[14px] text-on-surface dark:text-white">
                                    {UI_TEXT.BOOK_LIST.AVAILABLE_ONLY}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Book Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="font-sans text-on-surface-variant dark:text-white/80">
                            {UI_TEXT.BOOK_LIST.RESULTS_COUNT_PRE} <strong>{totalElements}</strong> {UI_TEXT.BOOK_LIST.RESULTS_COUNT_POST}{" "}
                            {searchInput && (
                                <span>
                                    {UI_TEXT.BOOK_LIST.RESULTS_FOR} &quot;{searchInput}&quot;
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Active Filters Indicators */}
                    {(activeAuthorName || activePublisher) && (
                        <div className="mb-6 flex flex-wrap gap-3">
                            {activeAuthorName && (
                                <div className="text-primary-800 flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm dark:bg-primary-900/40 dark:text-primary-300">
                                    <span className="font-medium">{UI_TEXT.BOOK_LIST.AUTHOR_LABEL}</span> {activeAuthorName}
                                    <button onClick={clearAuthorFilter} className="hover:bg-primary-200 dark:hover:bg-primary-800 ml-1 rounded-full p-0.5">
                                        <MaterialIcon name="close" className="text-[16px]" />
                                    </button>
                                </div>
                            )}
                            {activePublisher && (
                                <div className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900/40 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm dark:text-secondary-300">
                                    <span className="font-medium">{UI_TEXT.BOOK_LIST.PUBLISHER_LABEL}</span> {activePublisher}
                                    <button
                                        onClick={clearPublisherFilter}
                                        className="hover:bg-secondary-200 dark:hover:bg-secondary-800 ml-1 rounded-full p-0.5"
                                    >
                                        <MaterialIcon name="close" className="text-[16px]" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
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
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-12 text-center dark:bg-slate-900">
                            <MaterialIcon name="error_outline" className="mb-4 text-[64px] text-red-400" />
                            <h3 className="mb-2 text-[20px] font-semibold text-on-surface dark:text-white">{UI_TEXT.COMMON.ERROR_LOAD_BOOKS}</h3>
                            <button
                                onClick={() => clearFilters()}
                                className="hover:bg-primary-800 mt-6 rounded-lg bg-primary-700 px-6 py-2 text-white transition-colors"
                            >
                                {UI_TEXT.COMMON.RETRY_BTN}
                            </button>
                        </div>
                    )}

                    {/* Books Grid */}
                    {!loading && !error && books.length > 0 && (
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
                                            {book.authors?.map((a: any) => a.name).join(", ")}
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
                    )}

                    {/* Empty State */}
                    {!loading && !error && books.length === 0 && (
                        <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-12 text-center dark:bg-slate-900">
                            <MaterialIcon name="search_off" className="mb-4 text-[64px] text-on-surface-variant/50 dark:text-white/30" />
                            <h3 className="mb-2 text-[20px] font-semibold text-on-surface dark:text-white">{UI_TEXT.BOOK_LIST.NO_RESULTS_HEADING}</h3>
                            <p className="text-on-surface-variant dark:text-white/70">{UI_TEXT.BOOK_LIST.NO_RESULTS_DESC}</p>
                            <button
                                onClick={handleClearFilters}
                                className="hover:bg-primary-800 mt-6 rounded-lg bg-primary-700 px-6 py-2 text-white transition-colors"
                            >
                                {UI_TEXT.BOOK_LIST.CLEAR_FILTER_BTN}
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center space-x-2">
                                <button
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                >
                                    <MaterialIcon name="chevron_left" />
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                    let pageNum: number;
                                    if (totalPages <= 5) {
                                        pageNum = i;
                                    } else if (page < 3) {
                                        pageNum = i;
                                    } else if (page > totalPages - 4) {
                                        pageNum = totalPages - 5 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-colors ${
                                                page === pageNum
                                                    ? "bg-primary-700 text-white shadow-md"
                                                    : "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                                            }`}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    );
                                })}
                                <button
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                                    disabled={page === totalPages - 1}
                                    onClick={() => setPage(page + 1)}
                                >
                                    <MaterialIcon name="chevron_right" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
