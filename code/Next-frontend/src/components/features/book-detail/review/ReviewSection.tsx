"use client";

import { useEffect, useState } from "react";
import { REVIEW } from "@/constants/ui-text/review";
import CommunityReviews from "./CommunityReviews";
import DeleteReviewModal from "./DeleteReviewModal";
import EditReviewModal from "./EditReviewModal";
import ReportReviewModal from "./ReportReviewModal";
import type { Review } from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import SuccessReviewModal from "./SuccessReviewModal";
import { MOCK_REVIEWS } from "./mockData";

interface ReviewSectionProps {
    initialReviews: Review[];
    loading?: boolean;
}

export default function ReviewSection({ initialReviews, loading = false }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [editing, setEditing] = useState<Review | null>(null);
    const [showForm, setShowForm] = useState(true);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [reportingReview, setReportingReview] = useState<Review | null>(null);
    const [openReportDialog, setOpenReportDialog] = useState(false);

    useEffect(() => {
        if (initialReviews.length === 0) {
            setReviews(MOCK_REVIEWS);
        } else {
            setReviews(initialReviews);
        }
    }, [initialReviews]);

    const handleSubmit = (rating: number, comment: string) => {
        if (editing) {
            setReviews((prev) =>
                prev.map((review) =>
                    review.id === editing.id
                        ? {
                              ...review,
                              rating,
                              comment,
                          }
                        : review,
                ),
            );

            setEditing(null);
            setOpenEditDialog(false);
        } else {
            const newReview: Review = {
                id: Date.now(),
                userName: "You",
                rating,
                comment,
                createdAt: new Date().toISOString(),
            };

            setReviews((prev) => [newReview, ...prev]);
        }

        setShowForm(false);
    };

    const handleEdit = (review: Review) => {
        setEditing(review);
        setOpenEditDialog(true);
    };

    const handleDelete = (reviewId: number) => {
        setReviewToDelete(reviewId);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (reviewToDelete === null) return;

        setReviews((prev) => prev.filter((review) => review.id !== reviewToDelete));

        setReviewToDelete(null);
        setOpenDeleteDialog(false);
        setEditing(null);
        setShowForm(true);
    };
    if (loading) {
        return <div>Loading reviews...</div>;
    }

    const handleOpenReport = (review: Review) => {
        setReportingReview(review);
        setOpenReportDialog(true);
    };

    const handleReport = (reviewId: number | undefined, reason: string) => {
        // TODO: Gọi API báo cáo
        console.log({
            reviewId,
            reason,
        });

        setOpenReportDialog(false);
        setReportingReview(null);
        setOpenSuccessDialog(true);
    };

    return (
        <>
            <div className="mt-6 space-y-6">
                <CommunityReviews reviews={reviews} onEdit={handleEdit} onDelete={handleDelete} onReport={handleOpenReport} />

                {showForm ? (
                    <ReviewForm onSubmit={handleSubmit} />
                ) : (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                const myReview = reviews.find((review) => review.userName === "You");

                                if (myReview) {
                                    handleEdit(myReview);
                                } else {
                                    setShowForm(true);
                                }
                            }}
                            className="text-sm font-medium text-primary hover:underline dark:text-primary-300"
                        >
                            {REVIEW.EDIT_MY_REVIEW}
                        </button>
                    </div>
                )}
            </div>

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

            <SuccessReviewModal open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)} />
        </>
    );
}
