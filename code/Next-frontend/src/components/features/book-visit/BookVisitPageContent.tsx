"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";
import { useBookVisitForm } from "@/hooks/useBookVisitForm";
import { useBookDetail } from "@/hooks/useBooks";
import { useAuth } from "@/providers/auth";
import type { BookVisitPageContentProps } from "@/types/book-visit";
import { getSelectedBookTitle } from "@/utils/book-visit";
import { BookVisitForm } from "./BookVisitForm";
import { BookVisitInfoPanel } from "./BookVisitInfoPanel";
import { BookVisitSidebar } from "./BookVisitSidebar";
import { BookVisitToast } from "./BookVisitToast";
import { MobileVisitNav } from "./MobileVisitNav";

export default function BookVisitPageContent({ bookId }: BookVisitPageContentProps) {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();
    const { book, loading, error } = useBookDetail(Number.isNaN(bookId) ? null : bookId);
    const selectedBookTitle = getSelectedBookTitle({ book, loading });
    const { formState, submitStatus, today, isSubmitted, updateField, closeToast, handleSubmit } = useBookVisitForm({ bookId, selectedBookTitle });

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-surface-container-low transition-colors duration-200 dark:bg-black">
            <BookVisitSidebar currentPath={pathname || ""} isAuthenticated={isAuthenticated} />
            <BookVisitToast status={submitStatus} onClose={closeToast} />

            <section className="flex w-full flex-1 justify-center px-4 py-5 md:justify-start md:px-6 lg:px-12 lg:py-8">
                <div className="w-full max-w-[1160px] md:ml-4 lg:ml-8 xl:ml-12">
                    <div className="mb-6 flex flex-col gap-3">
                        <Link
                            href={`/sach/${bookId}`}
                            className="inline-flex w-fit items-center gap-2 text-body-sm font-medium text-on-surface transition-colors hover:text-primary-700 dark:text-white dark:hover:text-primary-100"
                        >
                            <ArrowLeft size={18} />
                            {UI_TEXT.BOOK_VISIT.ACTIONS.BACK_TO_BOOK}
                        </Link>

                        <div className="max-w-3xl">
                            <h1 className="mb-2 text-3xl font-bold text-ink-950 transition-colors duration-200 dark:text-white">
                                {UI_TEXT.BOOK_VISIT.HERO.TITLE}
                            </h1>
                            <p className="max-w-2xl font-body-md text-body-md font-normal text-on-surface-variant transition-colors duration-200 dark:text-slate-300">
                                {UI_TEXT.BOOK_VISIT.HERO.DESCRIPTION}
                            </p>
                        </div>
                    </div>

                    <MobileVisitNav currentPath={pathname || ""} />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                        <BookVisitForm
                            formState={formState}
                            submitStatus={submitStatus}
                            today={today}
                            isSubmitted={isSubmitted}
                            onFieldChange={updateField}
                            onSubmit={handleSubmit}
                        />
                        <BookVisitInfoPanel selectedBookTitle={selectedBookTitle} hasBookError={Boolean(error)} />
                    </div>
                </div>
            </section>
        </div>
    );
}
