"use client";

import { useState } from "react";
import { Filter, RefreshCw, Search } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

export default function UserFilters() {
    const [search, setSearch] = useState("");

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="level-1-shadow flex flex-col items-center justify-between gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md md:flex-row">
            {/* Semantic Search */}
            <div className="ai-border group relative w-full rounded-lg md:w-96">
                <Search className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-primary" size={18} />
                <input
                    className="h-11 w-full rounded-lg border-none bg-surface-bright/50 py-2.5 pl-10 pr-4 text-[14px] text-on-surface transition-all placeholder:text-outline/70 focus:outline-none focus:ring-0"
                    placeholder={UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.SEARCH_PLACEHOLDER}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                />
                {/* Subtle AI Glow hint underneath */}
                <div className="absolute inset-0 -z-10 rounded-lg bg-secondary opacity-0 blur-xl transition-opacity group-focus-within:opacity-10"></div>
            </div>

            {/* Filters */}
            <div className="hide-scrollbar flex w-full items-center gap-sm overflow-x-auto pb-2 md:w-auto md:pb-0">
                <div className="flex items-center gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-low p-1">
                    <Filter className="px-2 text-outline" size={32} />
                    <select
                        aria-label="Role filter"
                        className="cursor-pointer appearance-none border-none bg-transparent py-1 pl-2 pr-8 text-[14px] text-on-surface outline-none focus:ring-0"
                    >
                        <option value="">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ALL}</option>
                        <option value="admin">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ADMIN}</option>
                        <option value="librarian">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.LIBRARIAN}</option>
                        <option value="customer">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.CUSTOMER}</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-low p-1">
                    <select
                        aria-label="Status filter"
                        className="cursor-pointer appearance-none border-none bg-transparent py-1 pl-3 pr-8 text-[14px] text-on-surface outline-none focus:ring-0"
                    >
                        <option value="">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.ALL}</option>
                        <option value="active">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.ACTIVE}</option>
                        <option value="locked">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.LOCKED}</option>
                        <option value="inactive">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.INACTIVE}</option>
                    </select>
                </div>

                <button
                    onClick={handleReload}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/50 bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
                    title={UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.RELOAD}
                >
                    <RefreshCw size={18} />
                </button>
            </div>
        </div>
    );
}
