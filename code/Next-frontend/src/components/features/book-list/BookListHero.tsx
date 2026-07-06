"use client";

import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

interface BookListHeroProps {
    searchInput: string;
    onSearch: (value: string) => void;
}

export default function BookListHero({ searchInput, onSearch }: BookListHeroProps) {
    return (
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
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute bottom-0 right-32 h-48 w-48 translate-y-1/2 rounded-full bg-secondary-300/20 blur-2xl"></div>
        </div>
    );
}
