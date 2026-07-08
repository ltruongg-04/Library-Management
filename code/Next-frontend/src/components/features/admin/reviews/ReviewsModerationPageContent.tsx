"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { UI_TEXT } from "@/constants/ui-text";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import type { ReviewFilter } from "@/types/admin-review";
import HideReasonDialog from "./HideReasonDialog";
import ReviewCard from "./ReviewCard";
import ReviewFilterBar from "./ReviewFilterBar";
import ReviewsHeader from "./ReviewsHeader";

const TEXT = UI_TEXT.ADMIN_REVIEWS;
const DEFAULT_HIDE_REASON = TEXT.HIDE_REASON_OPTIONS[0];

function getPaginationItems(currentPage: number, totalPages: number) {
    const pages = new Set([1, 2, totalPages - 1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

    if (currentPage <= 3) {
        pages.add(3);
    }

    if (currentPage >= totalPages - 2) {
        pages.add(totalPages - 2);
    }

    const sortedPages = Array.from(pages)
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((first, second) => first - second);

    return sortedPages.reduce<Array<number | "ellipsis">>((items, page) => {
        const previous = items[items.length - 1];
        if (typeof previous === "number" && page - previous > 1) {
            items.push("ellipsis");
        }
        items.push(page);
        return items;
    }, []);
}

export default function ReviewsModerationPageContent() {
    const { reviews, loading, totalPages, filterCounts, fetchReviews, updateStatus, deleteReview: deleteReviewApi } = useAdminReviews();

    const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [reasonReviewId, setReasonReviewId] = useState<string | null>(null);
    const [selectedHideReason, setSelectedHideReason] = useState<string>(DEFAULT_HIDE_REASON);
    const [reasonDrafts, setReasonDrafts] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchReviews(activeFilter, searchQuery, currentPage - 1);
    }, [activeFilter, searchQuery, currentPage, fetchReviews]);

    const visiblePage = Math.min(currentPage, Math.max(1, totalPages));
    const paginationItems = getPaginationItems(visiblePage, Math.max(1, totalPages));
    const paginatedReviews = reviews;

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchQuery]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    const updateReasonDraft = (reviewId: string, value: string) => {
        setReasonDrafts((current) => ({
            ...current,
            [reviewId]: value,
        }));
    };

    const confirmHideReview = async (reviewId: string) => {
        const reason = selectedHideReason === TEXT.CUSTOM_HIDE_REASON ? reasonDrafts[reviewId]?.trim() : selectedHideReason;

        if (!reason) return;

        try {
            await updateStatus(reviewId, "hidden", reason);
            setReasonReviewId(null);
            setSelectedHideReason(DEFAULT_HIDE_REASON);
        } catch (err) {
            console.error("Failed to hide review:", err);
        }
    };

    const restoreReview = async (reviewId: string) => {
        try {
            await updateStatus(reviewId, "visible");
            updateReasonDraft(reviewId, "");
        } catch (err) {
            console.error("Failed to restore review:", err);
        }
    };

    const deleteReview = async (reviewId: string) => {
        try {
            await deleteReviewApi(reviewId);
            setReasonReviewId((current) => (current === reviewId ? null : current));
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    };

    const openHideReasonDialog = (reviewId: string) => {
        setSelectedHideReason(DEFAULT_HIDE_REASON);
        setReasonReviewId(reviewId);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface text-on-surface dark:bg-slate-950 dark:text-white">
            <div className="px-4 pb-2 pt-6 sm:px-8 sm:pt-8">
                <AdminBreadcrumb pageName={TEXT.BREADCRUMB_LABEL} />
            </div>

            <ReviewsHeader />

            <main className="flex-1 overflow-auto p-4 sm:p-8">
                <div className="mx-auto flex w-full max-w-[920px] flex-col items-center">
                    <ReviewFilterBar
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        filterCounts={filterCounts}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />

                    <section className="grid w-full grid-cols-1 items-start gap-md">
                        {loading ? (
                            <div className="py-12 text-center text-on-surface-variant dark:text-slate-300">{TEXT.LOADING_REVIEWS}</div>
                        ) : paginatedReviews.length > 0 ? (
                            paginatedReviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    onRequestHide={() => openHideReasonDialog(review.id)}
                                    onRestore={() => restoreReview(review.id)}
                                    onDelete={() => deleteReview(review.id)}
                                />
                            ))
                        ) : (
                            <div className="level-1-shadow w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-xl text-center text-body-md font-medium text-on-surface-variant dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                {TEXT.EMPTY_STATE}
                            </div>
                        )}
                    </section>

                    <nav className="mt-lg flex flex-wrap items-center justify-center gap-xs" aria-label={TEXT.PAGINATION.PAGE_LABEL}>
                        <button
                            type="button"
                            disabled={visiblePage === 1}
                            aria-label={TEXT.PAGINATION.PREVIOUS_PAGE}
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            className="grid h-9 w-9 place-items-center rounded text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-50"
                        >
                            <ChevronLeft size={18} strokeWidth={1.9} />
                        </button>
                        {paginationItems.map((item, index) =>
                            item === "ellipsis" ? (
                                <span key={`ellipsis-${index}`} className="px-xs text-body-sm text-outline-variant">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={item}
                                    type="button"
                                    aria-label={`${TEXT.PAGINATION.PAGE_LABEL} ${item}`}
                                    aria-current={item === visiblePage ? "page" : undefined}
                                    onClick={() => setCurrentPage(item)}
                                    className={`h-9 min-w-9 rounded px-sm text-body-sm font-medium transition-colors ${
                                        item === visiblePage ? "bg-primary-container text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
                                    }`}
                                >
                                    {item}
                                </button>
                            ),
                        )}
                        <button
                            type="button"
                            aria-label={TEXT.PAGINATION.NEXT_PAGE}
                            disabled={visiblePage === totalPages}
                            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                            className="grid h-9 w-9 place-items-center rounded text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-50"
                        >
                            <ChevronRight size={18} strokeWidth={1.9} />
                        </button>
                    </nav>
                </div>
            </main>

            <HideReasonDialog
                isOpen={reasonReviewId !== null}
                selectedReason={selectedHideReason}
                reason={reasonReviewId ? (reasonDrafts[reasonReviewId] ?? "") : ""}
                onSelectedReasonChange={setSelectedHideReason}
                onReasonChange={(value) => {
                    if (reasonReviewId) {
                        updateReasonDraft(reasonReviewId, value);
                    }
                }}
                onConfirm={() => {
                    if (reasonReviewId) {
                        confirmHideReview(reasonReviewId);
                    }
                }}
                onClose={() => {
                    setReasonReviewId(null);
                    setSelectedHideReason(DEFAULT_HIDE_REASON);
                }}
            />
        </div>
    );
}
