"use client";

import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

interface BookListSidebarProps {
    categories: { id: string | number; name: string }[];
    selectedCategory: string | number;
    onCategoryChange: (categoryId: string | number) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    minRating?: number;
    onMinRatingChange: (value: number | undefined) => void;
    isAvailable?: boolean;
    onAvailableChange: (value: boolean | undefined) => void;
}

export default function BookListSidebar({
    categories,
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortChange,
    minRating,
    onMinRatingChange,
    isAvailable,
    onAvailableChange,
}: BookListSidebarProps) {
    return (
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
                        onCategoryChange(id === "all" ? "all" : Number(id));
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
                            onChange={(e) => onSortChange(e.target.value)}
                            value={sortBy}
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
                            value={minRating?.toString() || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                onMinRatingChange(val ? Number(val) : undefined);
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
                            checked={isAvailable || false}
                            onChange={(e) => onAvailableChange(e.target.checked ? true : undefined)}
                        />
                        <label htmlFor="isAvailableCheckbox" className="ml-2 block text-[14px] text-on-surface dark:text-white">
                            {UI_TEXT.BOOK_LIST.AVAILABLE_ONLY}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
