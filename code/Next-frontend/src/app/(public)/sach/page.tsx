"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import Breadcrumb from "@/components/features/book-detail/Breadcrumb";
import { UI_TEXT } from "@/constants/ui-text";
import { useBooks } from "@/hooks/useBooks";

// Removed static CATEGORIES constant
const CATEGORY_STYLES: Record<string, string> = {
    "Khoa học & Công nghệ": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    "Tiểu thuyết": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
    "Lịch sử": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    "Thiết kế & Nghệ thuật": "text-tertiary-500 bg-tertiary-500/10 dark:text-white dark:bg-tertiary-500/40",
    "Kinh doanh": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
};

const DEFAULT_CATEGORY_STYLE = "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40";

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
        clearFilters,
    } = useBooks({ size: 12 });

    const [selectedCategory, setSelectedCategory] = React.useState<string | number>("all");
    const [searchInput, setSearchInput] = React.useState("");
    const [categories, setCategories] = React.useState<{ id: string | number, name: string }[]>([
        { id: "all", name: UI_TEXT.BOOK_LIST.CATEGORIES.ALL }
    ]);

    React.useEffect(() => {
        import("@/services/category").then(({ categoryService }) => {
            categoryService.getAllCategories().then((data) => {
                const dynamicCategories = data.map(c => ({ id: c.id, name: c.name }));
                setCategories([
                    { id: "all", name: UI_TEXT.BOOK_LIST.CATEGORIES.ALL },
                    ...dynamicCategories
                ]);
            }).catch(err => console.error("Failed to fetch categories:", err));
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
        clearFilters();
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
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-left font-sans text-[16px] transition-colors duration-200 ${selectedCategory === category.id
                                                ? "bg-primary-700/10 font-medium text-primary-700 dark:bg-primary-700/30 dark:text-primary-300"
                                                : "text-on-surface-variant hover:bg-surface-container-low dark:text-white/80 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        {category.name}
                                        {selectedCategory === category.id && <MaterialIcon name="check" className="text-sm" />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-6 dark:bg-slate-900">
                        <h3 className="mb-4 flex items-center font-sans text-[20px] font-semibold text-on-surface dark:text-white">
                            <MaterialIcon name="tune" className="mr-2 text-primary-700 dark:text-primary-300" />
                            {UI_TEXT.BOOK_LIST.SIDEBAR_FILTER}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-[14px] text-on-surface-variant dark:text-white/70">{UI_TEXT.BOOK_LIST.SORT_LABEL}</label>
                                <select className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-on-surface focus:border-primary-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                    <option>{UI_TEXT.BOOK_LIST.SORT_OPTIONS.NEWEST}</option>
                                    <option>{UI_TEXT.BOOK_LIST.SORT_OPTIONS.TOP_RATED}</option>
                                    <option>{UI_TEXT.BOOK_LIST.SORT_OPTIONS.POPULAR}</option>
                                </select>
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

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="level-1-shadow animate-pulse overflow-hidden rounded-xl bg-surface-container-lowest dark:bg-slate-900">
                                <div className="h-56 bg-surface-container-low dark:bg-slate-800"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-5 w-3/4 rounded bg-surface-container-low dark:bg-slate-800"></div>
                                    <div className="h-4 w-1/2 rounded bg-surface-container-low dark:bg-slate-800"></div>
                                    <div className="h-4 w-1/3 rounded bg-surface-container-low dark:bg-slate-800"></div>
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
                        <p className="text-on-surface-variant dark:text-white/70">{error}</p>
                        <button
                            onClick={() => clearFilters()}
                            className="mt-6 rounded-lg bg-primary-700 px-6 py-2 text-white transition-colors hover:bg-primary-800"
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
                                                        className={`font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] ${CATEGORY_STYLES[book.categories?.[0]?.name] || DEFAULT_CATEGORY_STYLE} max-w-[120px] truncate rounded px-2 py-1`}
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
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-colors ${page === pageNum
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
        </div >
    );
}
