"use client";

import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

interface ActiveFiltersProps {
    activeAuthorName: string | null;
    activePublisher: string | null;
    onClearAuthor: () => void;
    onClearPublisher: () => void;
}

export default function ActiveFilters({ activeAuthorName, activePublisher, onClearAuthor, onClearPublisher }: ActiveFiltersProps) {
    if (!activeAuthorName && !activePublisher) return null;

    return (
        <div className="mb-6 flex flex-wrap gap-3">
            {activeAuthorName && (
                <div className="text-primary-800 flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm dark:bg-primary-900/40 dark:text-primary-300">
                    <span className="font-medium">{UI_TEXT.BOOK_LIST.AUTHOR_LABEL}</span> {activeAuthorName}
                    <button onClick={onClearAuthor} className="hover:bg-primary-200 dark:hover:bg-primary-800 ml-1 rounded-full p-0.5">
                        <MaterialIcon name="close" className="text-[16px]" />
                    </button>
                </div>
            )}
            {activePublisher && (
                <div className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900/40 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm dark:text-secondary-300">
                    <span className="font-medium">{UI_TEXT.BOOK_LIST.PUBLISHER_LABEL}</span> {activePublisher}
                    <button onClick={onClearPublisher} className="hover:bg-secondary-200 dark:hover:bg-secondary-800 ml-1 rounded-full p-0.5">
                        <MaterialIcon name="close" className="text-[16px]" />
                    </button>
                </div>
            )}
        </div>
    );
}
