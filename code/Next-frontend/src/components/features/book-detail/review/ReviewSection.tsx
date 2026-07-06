"use client";

import { useEffect, useState } from "react";
import { BaseTextarea } from "@/components/base/base-textarea";
import { MaterialIcon } from "@/components/base/material-icon";
import { REPORT_REASONS } from "@/constants/ui-text/report";
import { REVIEW } from "@/constants/ui-text/review";
import CommunityReviews from "./CommunityReviews";
import type { Review } from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import ReviewModal from "./ReviewModal";

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
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");
    // useEffect(() => {
    //     setReviews(initialReviews);
    // }, [initialReviews]);

    useEffect(() => {
        if (initialReviews.length === 0) {
            setReviews([
                {
                    id: 1,
                    userName: "Nguyễn Văn A",
                    rating: 5,
                    comment: "Sách rất hay.",
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 2,
                    userName: "You",
                    rating: 4,
                    comment: "Đánh giá của mình.",
                    createdAt: new Date().toISOString(),
                },
            ]);
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
        setSelectedReason("");
        setOtherReason("");
        setOpenReportDialog(true);
    };

    const handleReport = () => {
        // TODO: Gọi API báo cáo
        console.log({
            reviewId: reportingReview?.id,
            reason: selectedReason === "Khác" ? otherReason : selectedReason,
        });

        setOpenReportDialog(false);
        setReportingReview(null);
        setSelectedReason("");
        setOtherReason("");
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
            <ReviewModal
                open={openEditDialog}
                title={REVIEW.EDIT_DIALOG.TITLE}
                onClose={() => {
                    setOpenEditDialog(false);
                    setEditing(null);
                }}
            >
                <ReviewForm review={editing ?? undefined} onSubmit={handleSubmit} />
            </ReviewModal>
            <ReviewModal
                open={openDeleteDialog}
                title={REVIEW.DELETE_DIALOG.TITLE}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setReviewToDelete(null);
                }}
            >
                {REVIEW.DELETE_MY_REVIEW}
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => {
                            setOpenDeleteDialog(false);
                            setReviewToDelete(null);
                        }}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                        {REVIEW.HUY_DELETE_REVIEW}
                    </button>
                    <button type="button" onClick={confirmDelete} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                        {REVIEW.DELETE_REVIEW}
                    </button>
                </div>
            </ReviewModal>
            <ReviewModal
                open={openReportDialog}
                title={REVIEW.REPORT_DIALOG.TITLE}
                onClose={() => {
                    setOpenReportDialog(false);
                    setReportingReview(null);
                }}
            >
                <p className="mb-2 text-on-surface-variant">{REVIEW.REPORT_DIALOG.DESCRIPTION}</p>

                {reportingReview && (
                    <>
                        <p className="mb-4 text-sm text-on-surface dark:text-white">
                            <strong>{reportingReview.userName}</strong>
                        </p>

                        <div className="mb-5">
                            <label htmlFor="report-reason" className="mb-2 block text-sm font-medium text-on-surface dark:text-white">
                                {REPORT_REASONS.LABEL}
                            </label>

                            <select
                                id="report-reason"
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="w-full rounded-md border border-outline-variant bg-surface-container-low p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white"
                            >
                                <option value="">{REPORT_REASONS.PLACEHOLDER}</option>

                                {REPORT_REASONS.REASONS.map((reason) => (
                                    <option key={reason} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                            {selectedReason === REPORT_REASONS.OTHER && (
                                <div className="mt-4">
                                    <BaseTextarea
                                        label={REPORT_REASONS.OTHER_LABEL}
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        placeholder={REPORT_REASONS.OTHER_PLACEHOLDER}
                                        rows={4}
                                        className="mb-2 block text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setOpenReportDialog(false);
                            setReportingReview(null);
                            setSelectedReason("");
                            setOtherReason("");
                        }}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                        {REVIEW.REPORT_DIALOG.CANCEL_BUTTON}
                    </button>

                    <button
                        type="button"
                        onClick={handleReport}
                        disabled={!selectedReason || (selectedReason === "REPORT_REASONS.OTHER" && !otherReason.trim())}
                        className={`rounded-md px-4 py-2 text-sm font-medium text-white transition ${
                            !selectedReason || (selectedReason === REPORT_REASONS.OTHER && !otherReason.trim())
                                ? "cursor-not-allowed bg-gray-400"
                                : "bg-primary hover:opacity-90"
                        }`}
                    >
                        {REVIEW.REPORT_DIALOG.SUBMIT_BUTTON}
                    </button>
                </div>
            </ReviewModal>
            <ReviewModal open={openSuccessDialog} title={REVIEW.SUCCESS_DIALOG.TITLE} onClose={() => setOpenSuccessDialog(false)}>
                <div className="flex flex-col items-center py-4">
                    <MaterialIcon name="check_circle" filled className="text-success mb-4 text-[64px]" />

                    <p className="mb-6 whitespace-pre-line text-center text-on-surface-variant">{REVIEW.SUCCESS_DIALOG.DESCRIPTION}</p>

                    <button
                        type="button"
                        onClick={() => setOpenSuccessDialog(false)}
                        className="rounded-lg bg-primary px-8 py-2 text-white transition hover:opacity-90"
                    >
                        {REVIEW.SUCCESS_DIALOG.CLOSE_BUTTON}
                    </button>
                </div>
            </ReviewModal>
        </>
    );
}
