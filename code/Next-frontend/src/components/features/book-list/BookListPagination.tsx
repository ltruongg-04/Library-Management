"use client";

import { MaterialIcon } from "@/components/base/material-icon";

interface BookListPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function BookListPagination({ page, totalPages, onPageChange }: BookListPaginationProps) {
    if (totalPages <= 1) return null;

    const visibleCount = Math.min(totalPages, 5);

    const getPageNum = (index: number): number => {
        if (totalPages <= 5) return index;
        if (page < 3) return index;
        if (page > totalPages - 4) return totalPages - 5 + index;
        return page - 2 + index;
    };

    return (
        <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                >
                    <MaterialIcon name="chevron_left" />
                </button>
                {Array.from({ length: visibleCount }).map((_, i) => {
                    const pageNum = getPageNum(i);
                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-colors ${
                                page === pageNum
                                    ? "bg-primary-700 text-white shadow-md"
                                    : "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                            }`}
                        >
                            {pageNum + 1}
                        </button>
                    );
                })}
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                    disabled={page === totalPages - 1}
                    onClick={() => onPageChange(page + 1)}
                >
                    <MaterialIcon name="chevron_right" />
                </button>
            </div>
        </div>
    );
}
