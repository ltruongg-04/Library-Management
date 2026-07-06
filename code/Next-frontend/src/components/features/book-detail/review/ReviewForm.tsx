"use client";

import { useEffect, useState } from "react";
import { BaseButton } from "@/components/base/base-button";
import { BaseTextarea } from "@/components/base/base-textarea";
import { REVIEW } from "@/constants/ui-text/review";
import ReviewStars from "./ReviewStars";
import type { ReviewFormProps } from "./types";

export default function ReviewForm({ review, onSubmit }: ReviewFormProps) {
    const [rating, setRating] = useState(review?.rating ?? 0);
    const [comment, setComment] = useState(review?.comment ?? "");
    const [submitted, setSubmitted] = useState(false);

    // Đồng bộ dữ liệu khi chuyển sang chế độ chỉnh sửa
    useEffect(() => {
        setRating(review?.rating ?? 0);
        setComment(review?.comment ?? "");
        setSubmitted(false);
    }, [review]);

    const handleSubmit = () => {
        setSubmitted(true);
        if (!rating || !comment.trim()) {
            return;
        }

        onSubmit?.(rating, comment.trim());
    };

    const isEditMode = Boolean(review);

    return (
        <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-6 dark:border-white/10 dark:bg-zinc-900">
            <div className="mb-6">
                <h3 className="mb-2 font-title-md text-title-md text-on-surface dark:text-white">{REVIEW.WRITE_REVIEW}</h3>

                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-white/70">{REVIEW.COMMUNITY_DESCRIPTION}</p>
            </div>

            <div className="mb-6">
                <ReviewStars rating={rating} onChange={setRating} />
            </div>

            <div className="mb-6">
                <BaseTextarea
                    label={REVIEW.WRITE_REVIEW}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    helperText={REVIEW.REVIEW_PLACEHOLDER}
                    error={submitted && !comment.trim() ? REVIEW.COMMENT_REQUIRED : undefined}
                    rows={5}
                    className="resize-none dark:bg-zinc-900 dark:text-white"
                />
            </div>

            <div className="flex justify-end">
                <BaseButton className="w-auto" onClick={handleSubmit} disabled={!rating || !comment.trim()}>
                    {isEditMode ? REVIEW.UPDATE_REVIEW : REVIEW.SUBMIT_REVIEW}
                </BaseButton>
            </div>
        </div>
    );
}
