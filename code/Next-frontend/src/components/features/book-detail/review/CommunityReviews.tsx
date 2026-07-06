import { REVIEW } from "@/constants/ui-text/review";
import ReviewCard, { Review } from "./ReviewCard";

interface CommunityReviewsProps {
    reviews: Review[];
    onEdit: (review: Review) => void;
    onDelete: (reviewId: number) => void;
    onReport: (review: Review) => void;
}

export default function CommunityReviews({ reviews, onEdit, onDelete, onReport }: CommunityReviewsProps) {
    if (!reviews.length) {
        return <div className="text-content-outline rounded-lg border border-dashed p-6 text-center">{REVIEW.NO_REVIEWS}</div>;
    }

    return (
        <div className="space-y-4 dark:*:bg-zinc-900">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} onEdit={onEdit} onDelete={onDelete} onReport={onReport} />
            ))}
        </div>
    );
}
