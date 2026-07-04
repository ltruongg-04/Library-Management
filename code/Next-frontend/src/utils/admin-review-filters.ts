import { UI_TEXT } from "@/constants/ui-text";
import type { Review, ReviewFilter, ReviewFilterOption } from "@/types/admin-review";

const TEXT = UI_TEXT.ADMIN_REVIEWS;

export const filterOptions: ReviewFilterOption[] = [
    { key: "all", label: TEXT.FILTERS.ALL },
    { key: "recent", label: TEXT.FILTERS.RECENT },
    { key: "reported", label: TEXT.FILTERS.REPORTED },
    { key: "rating-5", label: TEXT.FILTERS.RATING_5, rating: 5 },
    { key: "rating-4", label: TEXT.FILTERS.RATING_4, rating: 4 },
    { key: "rating-3", label: TEXT.FILTERS.RATING_3, rating: 3 },
    { key: "rating-2", label: TEXT.FILTERS.RATING_2, rating: 2 },
    { key: "rating-1", label: TEXT.FILTERS.RATING_1, rating: 1 },
    { key: "hidden", label: TEXT.FILTERS.HIDDEN },
];

export function getFilteredReviews(reviews: Review[], activeFilter: ReviewFilter, searchQuery: string) {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return reviews.filter((review) => {
        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "reported" && review.status === "reported") ||
            (activeFilter === "hidden" && review.status === "hidden") ||
            (activeFilter === "recent" && review.createdDaysAgo <= 3) ||
            (activeFilter.startsWith("rating-") && review.rating === Number(activeFilter.replace("rating-", "")));
        const matchesSearch =
            !normalizedSearch ||
            review.reviewerName.toLowerCase().includes(normalizedSearch) ||
            review.bookTitle.toLowerCase().includes(normalizedSearch) ||
            review.content.toLowerCase().includes(normalizedSearch);

        return matchesFilter && matchesSearch;
    });
}
