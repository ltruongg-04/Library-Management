import { MessageSquare, Search } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const TEXT = UI_TEXT.ADMIN_REVIEWS;

type ReviewsHeaderProps = {
    searchQuery: string;
    onSearchChange: (value: string) => void;
};

export default function ReviewsHeader({ searchQuery, onSearchChange }: ReviewsHeaderProps) {
    return (
        <header className="flex flex-col justify-between gap-md border-y border-surface-container-high bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-950 lg:flex-row lg:items-center">
            <div>
                <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950 dark:text-white">
                    <MessageSquare size={24} className="text-primary-600" />
                    {TEXT.PAGE_TITLE}
                </h1>
                <p className="mt-1 text-[14px] text-on-surface-variant dark:text-slate-300">{TEXT.PAGE_DESCRIPTION}</p>
            </div>

            <label className="relative w-full lg:max-w-[520px]">
                <Search size={20} strokeWidth={1.8} className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={TEXT.SEARCH_PLACEHOLDER}
                    className="h-12 w-full rounded-lg border border-transparent bg-surface-container-low px-md pl-12 text-body-md text-on-surface outline-none transition-shadow placeholder:text-outline focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
                />
            </label>
        </header>
    );
}
