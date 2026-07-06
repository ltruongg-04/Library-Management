export interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;

    userName?: string;
    userAvatar?: string;

    helpfulCount?: number;
}

export interface ReviewSectionProps {
    canReview: boolean;
    userReview?: Review | null;
    communityReviews?: Review[];
}

export interface ReviewLockedProps {
    title?: string;
    description?: string;
}

export interface ReviewFormProps {
    review?: Review | null;
    onSubmit?: (rating: number, comment: string) => void;
}

export interface ReviewStarsProps {
    rating: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
}

export interface CommunityReviewsProps {
    reviews: Review[];
}

export interface ReviewCardProps {
    review: Review;
}
