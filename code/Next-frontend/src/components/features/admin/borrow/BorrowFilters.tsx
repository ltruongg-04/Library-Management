"use client";

import { useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN_BORROW_MANAGEMENT.FILTERS;

const STATUS_OPTIONS = [
    { value: "", label: T.STATUS_ALL },
    { value: "pending", label: T.STATUS_PENDING },
    { value: "ready", label: T.STATUS_READY },
    { value: "borrowed", label: T.STATUS_BORROWED },
    { value: "overdue", label: T.STATUS_OVERDUE },
    { value: "returned", label: T.STATUS_RETURNED },
];

interface BorrowFiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    status: string;
    onStatusChange: (val: string) => void;
    onApplyDates: (from: string, to: string) => void;
}

export default function BorrowFilters({ search, onSearchChange, status, onStatusChange, onApplyDates }: BorrowFiltersProps) {
    const [localDateFrom, setLocalDateFrom] = useState("");
    const [localDateTo, setLocalDateTo] = useState("");

    return (
        <div className="level-1-shadow flex flex-col items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md lg:flex-row">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={T.SEARCH_PLACEHOLDER}
                    className="w-full rounded-lg border-none bg-surface py-2.5 pl-10 pr-4 text-body-md text-on-surface transition-all focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Right side filters */}
            <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
                {/* Status dropdown */}
                <select
                    aria-label="Lọc trạng thái"
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="cursor-pointer rounded-lg border-none bg-surface py-2 pl-3 pr-8 text-body-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>

                {/* Date range - From */}
                <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
                    <CalendarDays size={18} className="text-on-surface-variant" />
                    <span className="text-body-sm text-on-surface-variant">{T.LABEL_FROM}</span>
                    <div className="relative flex items-center">
                        <input
                            type="date"
                            aria-label="Từ ngày"
                            value={localDateFrom}
                            onChange={(e) => setLocalDateFrom(e.target.value)}
                            className="relative w-[95px] cursor-pointer border-none bg-transparent p-0 text-body-sm text-on-surface focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                    </div>
                </div>

                {/* Date range - To */}
                <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
                    <CalendarDays size={18} className="text-on-surface-variant" />
                    <span className="text-body-sm text-on-surface-variant">{T.LABEL_TO}</span>
                    <div className="relative flex items-center">
                        <input
                            type="date"
                            aria-label="Đến ngày"
                            value={localDateTo}
                            onChange={(e) => setLocalDateTo(e.target.value)}
                            className="relative w-[95px] cursor-pointer border-none bg-transparent p-0 text-body-sm text-on-surface focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2 lg:ml-2">
                    {/* Clear button */}
                    {(search || status || localDateFrom || localDateTo) && (
                        <button
                            onClick={() => {
                                onSearchChange("");
                                onStatusChange("");
                                setLocalDateFrom("");
                                setLocalDateTo("");
                                onApplyDates("", "");
                            }}
                            className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-body-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
                        >
                            {T.BTN_CLEAR_FILTER}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
