"use client";

import React from "react";
import Breadcrumb from "@/components/features/book-detail/Breadcrumb";
import ActiveFilters from "@/components/features/book-list/ActiveFilters";
import BookListGrid from "@/components/features/book-list/BookListGrid";
import BookListHero from "@/components/features/book-list/BookListHero";
import BookListPagination from "@/components/features/book-list/BookListPagination";
import BookListSidebar from "@/components/features/book-list/BookListSidebar";
import { UI_TEXT } from "@/constants/ui-text";
import { useBooks } from "@/hooks/useBooks";

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

            const keywordQuery = params.get("keyword");
            if (keywordQuery) {
                setSearchInput(keywordQuery);
                setKeyword(keywordQuery);
            }

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

            <BookListHero searchInput={searchInput} onSearch={handleSearch} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <BookListSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    sortBy={currentParams.sortBy || "newest"}
                    onSortChange={(v) => setSortBy(v as any)}
                    minRating={currentParams.minRating}
                    onMinRatingChange={setMinRating}
                    isAvailable={currentParams.isAvailable}
                    onAvailableChange={setIsAvailable}
                />

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

                    <ActiveFilters
                        activeAuthorName={activeAuthorName}
                        activePublisher={activePublisher}
                        onClearAuthor={clearAuthorFilter}
                        onClearPublisher={clearPublisherFilter}
                    />

                    <BookListGrid books={books} loading={loading} error={error} onClearFilters={handleClearFilters} />

                    {!loading && !error && <BookListPagination page={page} totalPages={totalPages} onPageChange={setPage} />}
                </div>
            </div>
        </div>
    );
}
