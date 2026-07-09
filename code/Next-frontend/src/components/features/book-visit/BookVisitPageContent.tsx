"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import { useBookVisitForm } from "@/hooks/useBookVisitForm";
import { useBookDetail } from "@/hooks/useBooks";
import { useAuth } from "@/providers/auth";
import { reservationService } from "@/services/reservation";
import type { BookVisitPageContentProps } from "@/types/book-visit";
import { getSelectedBookTitle } from "@/utils/book-visit";
import LoginPromptModal from "../book-detail/LoginPromptModal";
import { BookVisitForm } from "./BookVisitForm";
import { BookVisitInfoPanel } from "./BookVisitInfoPanel";
import { BookVisitSidebar } from "./BookVisitSidebar";
import { MobileVisitNav } from "./MobileVisitNav";

export default function BookVisitPageContent({ bookId }: BookVisitPageContentProps) {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();
    const { book, loading, error } = useBookDetail(Number.isNaN(bookId) ? null : bookId);
    const selectedBookTitle = getSelectedBookTitle({ book, loading });
    const { formState, submitStatus, today, updateField, handleSubmit } = useBookVisitForm({ bookId, selectedBookTitle });
    const isBookOutOfStock = Boolean(book && book.availableQuantity <= 0);
    const [isReserving, setIsReserving] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const handleReserve = async () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }

        setIsReserving(true);
        try {
            const reservation = await reservationService.createReservation(bookId);
            toast.success(UI_TEXT.BOOK_DETAIL.RESERVE_SUCCESS.replace("{position}", reservation.queuePosition.toString()));
        } catch (reserveError: any) {
            const message = reserveError.response?.data?.message || UI_TEXT.BOOK_DETAIL.RESERVE_ERROR;
            toast.error(message);
        } finally {
            setIsReserving(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-surface-container-low transition-colors duration-200 dark:bg-black">
            <BookVisitSidebar currentPath={pathname || ""} isAuthenticated={isAuthenticated} />

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

                    {isBookOutOfStock ? (
                        <div className="rounded-xl border border-error-container bg-surface-container-lowest p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-colors duration-200 dark:border-error-500/40 dark:bg-slate-900 md:p-8">
                            <div className="flex max-w-3xl flex-col gap-5">
                                <div className="flex items-start gap-4">
                                    <span className="rounded-full bg-error-container p-3 text-on-error-container dark:bg-error-500/20 dark:text-error-50">
                                        <AlertTriangle size={28} />
                                    </span>
                                    <div>
                                        <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white">
                                            {UI_TEXT.BOOK_VISIT.UNAVAILABLE.TITLE}
                                        </h2>
                                        <p className="mt-2 font-body-md text-body-md text-on-surface-variant dark:text-slate-300">
                                            {UI_TEXT.BOOK_VISIT.UNAVAILABLE.DESCRIPTION}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleReserve}
                                        disabled={isReserving}
                                        className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-500 dark:hover:bg-primary-700"
                                    >
                                        {isReserving ? UI_TEXT.BOOK_VISIT.UNAVAILABLE.RESERVING_ACTION : UI_TEXT.BOOK_VISIT.UNAVAILABLE.RESERVE_ACTION}
                                    </button>
                                    <Link
                                        href={`/sach/${bookId}`}
                                        className="inline-flex items-center justify-center rounded-lg border border-outline-variant px-5 py-3 font-label-caps text-label-caps text-on-surface transition-colors hover:bg-surface-container dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                                    >
                                        {UI_TEXT.BOOK_VISIT.UNAVAILABLE.BACK_TO_DETAIL}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                            <BookVisitForm
                                formState={formState}
                                submitStatus={submitStatus}
                                today={today}
                                onFieldChange={updateField}
                                onSubmit={handleSubmit}
                            />
                            <BookVisitInfoPanel selectedBookTitle={selectedBookTitle} hasBookError={Boolean(error)} />
                        </div>
                    )}
                </div>
            </section>
            <LoginPromptModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
        </div>
    );
}
