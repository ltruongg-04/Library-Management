"use client";

import { useState } from "react";
import { ADMIN_USER_MANAGEMENT } from "@/constants/ui-text/admin";

export default function UserFilters() {
    const [search, setSearch] = useState("");

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* SEARCH */}
            <input
                className="w-80 rounded border px-3 py-2"
                placeholder={ADMIN_USER_MANAGEMENT.FILTERS.SEARCH_PLACEHOLDER}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* ROLE FILTER */}
            <select aria-label="Status filter" className="rounded border px-3 py-2">
                <option>{ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ALL}</option>
                <option>{ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ADMIN}</option>
                <option>{ADMIN_USER_MANAGEMENT.FILTERS.ROLES.LIBRARIAN}</option>
                <option>{ADMIN_USER_MANAGEMENT.FILTERS.ROLES.CUSTOMER}</option>
            </select>

            {/* STATUS FILTER */}
            <select aria-label="Status filter" className="rounded border px-3 py-2">
                <option>{ADMIN_USER_MANAGEMENT.FILTERS.STATUS.ALL}</option>
                <option>{ADMIN_USER_MANAGEMENT.FILTERS.STATUS.ACTIVE}</option>
                <option>{ADMIN_USER_MANAGEMENT.FILTERS.STATUS.LOCKED}</option>
                <option>{ADMIN_USER_MANAGEMENT.FILTERS.STATUS.INACTIVE}</option>
            </select>

            {/* RELOAD */}
            <button onClick={handleReload} className="rounded-md border px-3 py-2 hover:bg-gray-100">
                {ADMIN_USER_MANAGEMENT.FILTERS.RELOAD}
            </button>
        </div>
    );
}
