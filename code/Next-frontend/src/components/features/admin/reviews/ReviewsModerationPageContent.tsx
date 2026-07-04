"use client";

import { useEffect, useMemo, useState } from "react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { UI_TEXT } from "@/constants/ui-text";
import type { Review, ReviewFilter, ReviewsStats } from "@/types/admin-review";
import { getFilteredReviews } from "@/utils/admin-review-filters";
import { STORAGE_KEY, createInitialReviews, readSavedReviews } from "@/utils/admin-review-storage";
import ReviewCard from "./ReviewCard";
import ReviewFilterBar from "./ReviewFilterBar";
import ReviewsHeader from "./ReviewsHeader";
import ReviewsStatsPanel from "./ReviewsStatsPanel";

const TEXT = UI_TEXT.ADMIN_REVIEWS;

export default function ReviewsModerationPageContent() {
    const [reviews, setReviews] = useState<Review[]>(createInitialReviews);
    const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [reasonReviewId, setReasonReviewId] = useState<string | null>(null);
    const [reasonDrafts, setReasonDrafts] = useState<Record<string, string>>(Object.fromEntries(reviews.map((review) => [review.id, review.hideReason])));
    const [hasLoadedSavedReviews, setHasLoadedSavedReviews] = useState(false);

    useEffect(() => {
        const savedReviews = readSavedReviews();

        setReviews(savedReviews);
        setReasonDrafts(Object.fromEntries(savedReviews.map((review) => [review.id, review.hideReason])));
        setHasLoadedSavedReviews(true);
    }, []);

    useEffect(() => {
        if (!hasLoadedSavedReviews) {
            return;
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    }, [hasLoadedSavedReviews, reviews]);

    const filteredReviews = getFilteredReviews(reviews, activeFilter, searchQuery);
    const stats = useMemo<ReviewsStats>(() => {
        const totalRating = reviews.reduce((total, review) => total + review.rating, 0);
        const averageRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : "0.0";

        return {
            total: String(reviews.length),
            reported: String(reviews.filter((review) => review.status === "reported").length),
            hidden: String(reviews.filter((review) => review.status === "hidden").length),
            average: averageRating,
        };
    }, [reviews]);

    const updateReasonDraft = (reviewId: string, value: string) => {
        setReasonDrafts((current) => ({
            ...current,
            [reviewId]: value,
        }));
    };

    const confirmHideReview = (reviewId: string) => {
        const reason = reasonDrafts[reviewId]?.trim();

        if (!reason) {
            return;
        }

        setReviews((current) =>
            current.map((review) => (review.id === reviewId ? { ...review, status: "hidden", hideReason: reason, accent: "muted" } : review)),
        );
        setReasonReviewId(null);
    };

    const restoreReview = (reviewId: string) => {
        setReviews((current) =>
            current.map((review) => (review.id === reviewId ? { ...review, status: "visible", hideReason: "", accent: "secondary" } : review)),
        );
        updateReasonDraft(reviewId, "");
    };

    const deleteReview = (reviewId: string) => {
        setReviews((current) => current.filter((review) => review.id !== reviewId));
        setReasonReviewId((current) => (current === reviewId ? null : current));
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface text-on-surface dark:bg-slate-950 dark:text-white">
            <div className="px-4 pb-2 pt-6 sm:px-8 sm:pt-8">
                <AdminBreadcrumb pageName={TEXT.BREADCRUMB_LABEL} />
            </div>

            <ReviewsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <main className="flex-1 overflow-auto p-4 sm:p-8">
                <ReviewFilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

                <div className="grid max-w-[1280px] grid-cols-1 gap-lg xl:grid-cols-[minmax(0,1fr)_max-content]">
                    <section className="grid grid-cols-1 items-start gap-md lg:grid-cols-2">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    reasonDraft={reasonDrafts[review.id] ?? ""}
                                    isReasonOpen={reasonReviewId === review.id}
                                    onReasonChange={(value) => updateReasonDraft(review.id, value)}
                                    onToggleReason={() => setReasonReviewId((current) => (current === review.id ? null : review.id))}
                                    onConfirmHide={() => confirmHideReview(review.id)}
                                    onRestore={() => restoreReview(review.id)}
                                    onDelete={() => deleteReview(review.id)}
                                />
                            ))
                        ) : (
                            <div className="level-1-shadow rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-xl text-center text-body-md font-medium text-on-surface-variant dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                {TEXT.EMPTY_STATE}
                            </div>
                        )}
                    </section>

                    <ReviewsStatsPanel stats={stats} />
                </div>
            </main>
        </div>
    );
}
