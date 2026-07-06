import { MaterialIcon } from "@/components/base/material-icon";
import { REVIEW } from "@/constants/ui-text/review";

export interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewCardProps {
    review: Review;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: number) => void;
    onReport?: (review: Review) => void;
}

export default function ReviewCard({ review, onEdit, onDelete, onReport }: ReviewCardProps) {
    const isMyReview = review.userName === "You";

    return (
        <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="font-medium text-on-surface dark:text-white">{review.userName}</p>

                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const active = i < review.rating;

                        return (
                            <MaterialIcon
                                key={i}
                                name={active ? "star" : "star_outline"}
                                filled={active}
                                className={active ? "text-yellow-500" : "text-content-outline"}
                            />
                        );
                    })}
                </div>
            </div>

            <p className="mb-3 text-sm text-on-surface-variant dark:text-white/80">{review.comment}</p>

            <div className="flex items-center justify-between">
                <p className="text-content-outline text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>

                <div className="flex gap-2">
                    {isMyReview ? (
                        <>
                            <button
                                type="button"
                                onClick={() => onEdit?.(review)}
                                className="text-sm font-medium text-primary hover:underline dark:text-primary-300"
                            >
                                {REVIEW.EDIT_REVIEW}
                            </button>

                            <button type="button" onClick={() => onDelete?.(review.id)} className="text-sm font-medium text-error-500 hover:underline">
                                {REVIEW.DELETE_REVIEW}
                            </button>
                        </>
                    ) : (
                        <button type="button" onClick={() => onReport?.(review)} className="text-sm font-medium text-warning-600 hover:underline">
                            {REVIEW.REPORT_REVIEW}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
