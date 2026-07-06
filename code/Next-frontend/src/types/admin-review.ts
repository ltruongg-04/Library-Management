export type ReviewStatus = "reported" | "visible" | "hidden";
export type ReviewAccent = "primary" | "secondary" | "warning" | "muted";
export type ReviewFilter = "all" | "reported" | "recent" | "rating-5" | "rating-4" | "rating-3" | "rating-2" | "rating-1" | "hidden";

export type Review = {
    id: string;
    reviewerName: string;
    reviewerInitials: string;
    reviewerRole: string;
    bookTitle: string;
    rating: number;
    createdAt: string;
    createdDaysAgo: number;
    content: string;
    hideReason: string;
    status: ReviewStatus;
    accent: ReviewAccent;
};

export type ReviewFilterOption = {
    key: ReviewFilter;
    label: string;
    rating?: number;
};

export type ReviewFilterCounts = Partial<Record<ReviewFilter, string>>;
