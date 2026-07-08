"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Filter, Search, X } from "lucide-react";
import { ADMIN_BOOK_VISITS } from "@/constants/ui-text/admin";

type BookVisitFiltersProps = {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusFilterChange: (val: string) => void;
    onClearFilters: () => void;
};

function CustomDropdown({
    value,
    onChange,
    options,
    icon: Icon,
    placeholder,
}: {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    icon?: any;
    placeholder?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-11 items-center gap-2 rounded-lg border bg-surface-container-low px-4 text-[14px] text-on-surface transition-all hover:bg-surface-variant dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 ${
                    isOpen ? "border-primary ring-2 ring-primary/20" : "border-outline-variant/50 dark:border-white/10"
                }`}
            >
                {Icon && <Icon size={18} className="dark:text-primary-400 text-primary" />}
                <span className="min-w-[120px] text-left font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown
                    size={16}
                    className={`text-outline transition-transform duration-300 dark:text-white/60 ${isOpen ? "dark:text-primary-400 rotate-180 text-primary" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="animate-in fade-in zoom-in-95 absolute right-0 top-full z-50 mt-2 w-full min-w-[200px] origin-top-right rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex flex-col gap-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[14px] transition-all ${
                                    value === option.value
                                        ? "dark:text-primary-400 bg-primary-container/30 font-bold text-primary dark:bg-primary-900/30"
                                        : "text-on-surface hover:bg-surface-variant hover:text-on-surface-variant dark:text-white/80 dark:hover:bg-zinc-800"
                                }`}
                            >
                                <span>{option.label}</span>
                                {value === option.value && <Check size={16} className="dark:text-primary-400 text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BookVisitFilters({ searchQuery, onSearchChange, statusFilter, onStatusFilterChange, onClearFilters }: BookVisitFiltersProps) {
    const statusOptions = [
        { value: "", label: ADMIN_BOOK_VISITS.FILTERS.STATUS.ALL },
        { value: "PENDING", label: ADMIN_BOOK_VISITS.FILTERS.STATUS.PENDING },
        { value: "COMPLETED", label: ADMIN_BOOK_VISITS.FILTERS.STATUS.COMPLETED },
        { value: "CANCELLED", label: ADMIN_BOOK_VISITS.FILTERS.STATUS.CANCELLED },
    ];

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 dark:border-white/10 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 md:max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-white/40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={ADMIN_BOOK_VISITS.FILTERS.SEARCH_PLACEHOLDER}
                    className="h-11 w-full rounded-lg border border-outline-variant/50 bg-surface-container-low pl-11 pr-4 text-[14px] text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <CustomDropdown value={statusFilter} onChange={onStatusFilterChange} options={statusOptions} icon={Filter} placeholder="Trạng thái" />

                {/* Clear Filters Button */}
                {(searchQuery || statusFilter) && (
                    <button
                        onClick={onClearFilters}
                        className="hover:text-error-hover flex h-11 items-center gap-2 rounded-lg border border-error/20 bg-error-container/30 px-4 text-[14px] font-medium text-error transition-all hover:bg-error-container dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                    >
                        <X size={16} />
                        <span className="hidden sm:inline">{ADMIN_BOOK_VISITS.FILTERS.CLEAR}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
