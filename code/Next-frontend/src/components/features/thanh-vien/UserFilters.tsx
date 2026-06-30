"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, Search, ChevronDown, Check, ShieldAlert, X } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

type UserFiltersProps = {
    search: string;
    onSearchChange: (val: string) => void;
    role: string;
    onRoleChange: (val: string) => void;
    status: string;
    onStatusChange: (val: string) => void;
    onClearFilters: () => void;
};

function CustomDropdown({
    value,
    onChange,
    options,
    icon: Icon,
    placeholder
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

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-11 items-center gap-2 rounded-lg border bg-surface-container-low px-4 text-[14px] text-on-surface transition-all hover:bg-surface-variant ${
                    isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/50'
                }`}
            >
                {Icon && <Icon size={18} className="text-primary" />}
                <span className="min-w-[120px] text-left font-medium">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} className={`text-outline transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-full min-w-[200px] origin-top-right animate-in fade-in zoom-in-95 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-2 shadow-xl backdrop-blur-xl">
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
                                        ? 'bg-primary-container/30 text-primary font-bold'
                                        : 'text-on-surface hover:bg-surface-variant hover:text-on-surface-variant'
                                }`}
                            >
                                <span>{option.label}</span>
                                {value === option.value && <Check size={16} className="text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function UserFilters({
    search, onSearchChange,
    role, onRoleChange,
    status, onStatusChange,
    onClearFilters
}: UserFiltersProps) {

    const roleOptions = [
        { value: "", label: UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ALL },
        { value: "admin", label: UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ADMIN },
        { value: "librarian", label: UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.LIBRARIAN },
        { value: "customer", label: UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.CUSTOMER }
    ];

    const statusOptions = [
        { value: "", label: UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.ALL },
        { value: "active", label: UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.ACTIVE },
        { value: "locked", label: UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.LOCKED }
    ];

    return (
        <div className="level-1-shadow flex flex-col items-center justify-between gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md md:flex-row">
            {/* Semantic Search */}
            <div className="ai-border group relative w-full rounded-lg md:w-96">
                <Search className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-primary" size={18} />
                <input
                    className="h-11 w-full rounded-lg border-none bg-surface-bright/50 py-2.5 pl-10 pr-4 text-[14px] text-on-surface transition-all placeholder:text-outline/70 focus:outline-none focus:ring-0"
                    placeholder={UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.SEARCH_PLACEHOLDER}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    type="text"
                />
                <div className="absolute inset-0 -z-10 rounded-lg bg-secondary opacity-0 blur-xl transition-opacity group-focus-within:opacity-10"></div>
            </div>

            {/* Filters */}
            <div className="flex w-full flex-wrap items-center gap-md pb-2 md:w-auto md:pb-0">
                <CustomDropdown 
                    value={role} 
                    onChange={onRoleChange} 
                    options={roleOptions} 
                    icon={Filter} 
                    placeholder="Chọn chức vụ" 
                />

                <CustomDropdown 
                    value={status} 
                    onChange={onStatusChange} 
                    options={statusOptions} 
                    icon={ShieldAlert} 
                    placeholder="Chọn trạng thái" 
                />

                {/* Clear Filters Button (only shows when active) */}
                {(search !== "" || role !== "" || status !== "") && (
                    <button
                        onClick={onClearFilters}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-outline-variant/50 bg-surface-container-low text-on-surface-variant transition-all hover:bg-error-container/20 hover:text-error hover:border-error/30 animate-in fade-in zoom-in duration-200"
                        title="Hủy bộ lọc"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
