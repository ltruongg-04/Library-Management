import { Star } from "lucide-react";
import type { ReviewFilter } from "@/types/admin-review";
import { filterOptions } from "@/utils/admin-review-filters";

type ReviewFilterBarProps = {
    activeFilter: ReviewFilter;
    onFilterChange: (filter: ReviewFilter) => void;
};

export default function ReviewFilterBar({ activeFilter, onFilterChange }: ReviewFilterBarProps) {
    return (
        <div className="mb-lg flex max-w-[1180px] flex-col gap-md">
            <div className="flex flex-wrap gap-sm">
                {filterOptions.map((option) => (
                    <button
                        key={option.key}
                        type="button"
                        onClick={() => onFilterChange(option.key)}
                        className={`focus-ring inline-flex h-9 items-center gap-1 rounded-full border px-md text-body-sm font-semibold transition-colors ${
                            activeFilter === option.key
                                ? "border-primary bg-primary text-on-primary shadow-sm"
                                : "border-outline-variant bg-surface-container-low text-on-surface hover:border-primary/40 hover:bg-surface-container-lowest dark:bg-slate-900 dark:text-slate-200"
                        }`}
                    >
                        {option.label}
                        {option.rating ? <Star size={14} strokeWidth={1.8} className="fill-warning-500 text-warning-500" /> : null}
                    </button>
                ))}
            </div>
        </div>
    );
}
