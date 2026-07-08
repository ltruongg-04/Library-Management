"use client";

import { useState } from "react";
import { REVIEW } from "@/constants/ui-text/review";
import { useBookReviews } from "@/hooks/useBookReviews";
import CommunityReviews from "./CommunityReviews";
import DeleteReviewModal from "./DeleteReviewModal";
import EditReviewModal from "./EditReviewModal";
import ReportReviewModal from "./ReportReviewModal";
import type { Review } from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import ReviewModal from "./ReviewModal";
import SuccessReviewModal from "./SuccessReviewModal";

interface ReviewSectionProps {
    bookId: number;
    isReviewModalOpen: boolean;
    onCloseReviewModal: () => void;
}

export default function ReviewSection({ bookId, isReviewModalOpen, onCloseReviewModal }: ReviewSectionProps) {
    const { reviews, loading, hasMore, loadMore, submitReview, updateReview, deleteReview, reportReview } = useBookReviews(bookId);

    // UI state
    const [editing, setEditing] = useState<Review | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [reportingReview, setReportingReview] = useState<Review | null>(null);
    const [openReportDialog, setOpenReportDialog] = useState(false);

    const handleSubmit = async (rating: number, comment: string) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            if (editing) {
                await updateReview(editing.id, rating, comment);
                setEditing(null);
                setOpenEditDialog(false);
            } else {
                await submitReview(rating, comment);
                onCloseReviewModal();
                setOpenSuccessDialog(true);
            }
        } catch (err: any) {
            setSubmitError(err.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (review: Review) => {
        setEditing(review);
        setOpenEditDialog(true);
    };

    const handleDelete = (reviewId: number) => {
        setReviewToDelete(reviewId);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (reviewToDelete === null) return;

        try {
            await deleteReview(reviewToDelete);
        } catch (e) {
            console.error("Failed to delete review", e);
        }

        setReviewToDelete(null);
        setOpenDeleteDialog(false);
        setEditing(null);
    };

    if (loading && reviews.length === 0) {
        return <div className="py-12 text-center text-on-surface-variant dark:text-slate-300">{REVIEW.LOADING}</div>;
    }

    const handleOpenReport = (review: Review) => {
        setReportingReview(review);
        setOpenReportDialog(true);
    };

    const handleReport = async (reviewId: number | undefined, reason: string) => {
        if (!reviewId) return;
        try {
            await reportReview(reviewId, reason);
        } catch (e) {
            console.error("Failed to report review", e);
        }
        setReportingReview(null);
        setOpenReportDialog(false);
    };

    return (
        <>
            <div className="mt-8">
                <h2 className="font-title-lg text-title-lg mb-6 text-on-surface dark:text-white">
                    {REVIEW.TITLE} ({reviews.length})
                </h2>

                <CommunityReviews reviews={reviews} onEdit={handleEdit} onDelete={handleDelete} onReport={handleOpenReport} />

                {hasMore && (
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="dark:text-primary-400 mt-4 w-full rounded-lg border border-outline-variant/30 py-2 font-medium text-primary hover:bg-primary/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-primary-900/20"
                    >
                        {loading ? REVIEW.LOADING_MORE : REVIEW.LOAD_MORE}
                    </button>
                )}
            </div>

            <ReviewModal
                open={isReviewModalOpen}
                title={REVIEW.WRITE_REVIEW}
                onClose={() => {
                    setSubmitError(null);
                    onCloseReviewModal();
                }}
            >
                {submitError && <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{submitError}</div>}
                <ReviewForm onSubmit={handleSubmit} />
                {isSubmitting && <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-300">{REVIEW.SUBMITTING_REVIEW}</p>}
            </ReviewModal>

            <EditReviewModal
                open={openEditDialog}
                editingReview={editing}
                onClose={() => {
                    setOpenEditDialog(false);
                    setEditing(null);
                }}
                onSubmit={handleSubmit}
            />

            <DeleteReviewModal
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setReviewToDelete(null);
                }}
                onConfirm={confirmDelete}
            />

            <ReportReviewModal
                open={openReportDialog}
                reportingReview={reportingReview}
                onClose={() => {
                    setOpenReportDialog(false);
                    setReportingReview(null);
                }}
                onSubmit={handleReport}
            />

            <SuccessReviewModal
                open={openSuccessDialog}
                onClose={() => setOpenSuccessDialog(false)}
                title={REVIEW.SUBMIT_SUCCESS_DIALOG.TITLE}
                description={REVIEW.SUBMIT_SUCCESS_DIALOG.DESCRIPTION}
            />
        </>
    );
}
