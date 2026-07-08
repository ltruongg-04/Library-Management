import { useState } from "react";
import { Check, ChevronDown, Filter, Search, Star, X } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import type { ReviewFilter, ReviewFilterCounts } from "@/types/admin-review";
import { filterOptions } from "@/utils/admin-review-filters";

const TEXT = UI_TEXT.ADMIN_REVIEWS;

type ReviewFilterBarProps = {
    activeFilter: ReviewFilter;
    onFilterChange: (filter: ReviewFilter) => void;
    filterCounts: ReviewFilterCounts;
    searchQuery: string;
    onSearchChange: (value: string) => void;
};

export default function ReviewFilterBar({ activeFilter, onFilterChange, filterCounts, searchQuery, onSearchChange }: ReviewFilterBarProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const activeOption = filterOptions.find((option) => option.key === activeFilter) ?? filterOptions[0];
    const renderOptionLabel = (option: (typeof filterOptions)[number]) => {
        const count = filterCounts[option.key];
        return (
            <>
                <span>{option.label}</span>
                {option.rating ? <Star size={14} strokeWidth={1.8} className="fill-warning-500 text-warning-500" /> : null}
                {count ? <span>({count})</span> : null}
            </>
        );
    };

    return (
        <div className="mb-lg flex w-full flex-col gap-md rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative w-full sm:max-w-[520px]">
                <span className="sr-only">{TEXT.CONTROLS.SEARCH_LABEL}</span>
                <Search size={20} strokeWidth={1.8} className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-primary" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={TEXT.SEARCH_PLACEHOLDER}
                    className="h-12 w-full rounded-lg border border-primary/45 bg-surface-container-low px-md pl-12 pr-11 text-body-md text-on-surface outline-none transition-shadow placeholder:text-outline focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 dark:border-primary/60 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
                />
                {searchQuery ? (
                    <button
                        type="button"
                        aria-label={TEXT.CONTROLS.CLEAR_SEARCH}
                        onClick={() => onSearchChange("")}
                        className="focus-ring absolute right-sm top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-primary transition-colors hover:bg-primary/10"
                    >
                        <X size={18} strokeWidth={2} />
                    </button>
                ) : null}
            </label>

            <div className="relative w-full sm:w-[260px]">
                <button
                    type="button"
                    onClick={() => setIsFilterOpen((current) => !current)}
                    aria-expanded={isFilterOpen}
                    className={`focus-ring flex h-12 w-full items-center justify-between rounded-lg border bg-surface-container-low px-md text-body-md font-semibold text-on-surface transition-colors dark:bg-slate-900 dark:text-white ${
                        isFilterOpen ? "border-primary ring-2 ring-primary/15" : "border-primary/45 hover:border-primary dark:border-primary/60"
                    }`}
                >
                    <span className="inline-flex min-w-0 items-center gap-sm">
                        <Filter size={20} strokeWidth={1.9} className="shrink-0 text-primary" />
                        <span className="inline-flex min-w-0 items-center gap-1 truncate">{renderOptionLabel(activeOption)}</span>
                    </span>
                    <ChevronDown
                        size={18}
                        strokeWidth={1.9}
                        className={`shrink-0 text-on-surface-variant transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isFilterOpen ? (
                    <div className="absolute right-0 z-20 mt-xs w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-xs shadow-xl dark:border-slate-800 dark:bg-slate-950">
                        {filterOptions.map((option) => {
                            const isActive = option.key === activeFilter;

                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    onClick={() => {
                                        onFilterChange(option.key);
                                        setIsFilterOpen(false);
                                    }}
                                    className={`flex h-10 w-full items-center justify-between rounded-md px-sm text-left text-body-md transition-colors ${
                                        isActive
                                            ? "bg-primary font-semibold text-on-primary"
                                            : "text-on-surface hover:bg-surface-container dark:text-slate-200 dark:hover:bg-slate-900"
                                    }`}
                                >
                                    <span className="inline-flex min-w-0 items-center gap-1 truncate">{renderOptionLabel(option)}</span>
                                    {isActive ? <Check size={17} strokeWidth={1.9} className="shrink-0 text-on-primary" /> : null}
                                </button>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
