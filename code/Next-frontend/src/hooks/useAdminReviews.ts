import { useCallback, useState } from "react";
import axiosInstance from "@/lib/axios";
import type { Review, ReviewFilter, ReviewStatus } from "@/types/admin-review";

export function useAdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filterCounts, setFilterCounts] = useState<Record<string, number>>({});

    // For pagination/filtering state
    const [currentFilter, setCurrentFilter] = useState<ReviewFilter>("all");
    const [currentSearch, setCurrentSearch] = useState("");

    const fetchReviews = useCallback(async (filter: ReviewFilter = "all", search: string = "", pageToFetch: number = 0) => {
        setLoading(true);
        setError(null);
        try {
            // Convert filter to status query if applicable
            let statusParam = "";
            if (filter === "reported") statusParam = "REPORTED";
            else if (filter === "hidden") statusParam = "HIDDEN";

            // Build query params
            const params = new URLSearchParams();
            params.append("page", pageToFetch.toString());
            params.append("size", "10");
            params.append("sort", "createdAt,desc");
            if (statusParam) params.append("status", statusParam);
            if (search) params.append("search", search);

            const [res, summaryRes] = await Promise.all([
                axiosInstance.get(`/api/admin/reviews?${params.toString()}`),
                axiosInstance.get(`/api/admin/reviews/summary`),
            ]);

            let fetchedReviews: Review[] = res.data.content;

            // Apply frontend rating filters since backend only filters by status/search
            if (filter.startsWith("rating-")) {
                const rating = parseInt(filter.replace("rating-", ""), 10);
                fetchedReviews = fetchedReviews.filter((r) => r.rating === rating);
            }

            const counts = summaryRes.data;
            setFilterCounts({
                all: counts.all,
                recent: counts.recent,
                reported: counts.reported,
                hidden: counts.hidden,
                "rating-5": counts.star5,
                "rating-4": counts.star4,
                "rating-3": counts.star3,
                "rating-2": counts.star2,
                "rating-1": counts.star1,
            });

            setReviews(fetchedReviews);
            setTotalPages(res.data.totalPages);
            setPage(pageToFetch);
            setCurrentFilter(filter);
            setCurrentSearch(search);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to fetch admin reviews");
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStatus = async (id: number | string, newStatus: ReviewStatus, hideReason?: string) => {
        try {
            const params = new URLSearchParams();
            params.append("status", newStatus.toUpperCase());
            if (hideReason) params.append("hideReason", hideReason);

            await axiosInstance.patch(`/api/admin/reviews/${id}/status?${params.toString()}`);

            // Re-fetch current page
            await fetchReviews(currentFilter, currentSearch, page);
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || "Failed to update status");
        }
    };

    const deleteReview = async (id: number | string) => {
        try {
            await axiosInstance.delete(`/api/admin/reviews/${id}`);
            await fetchReviews(currentFilter, currentSearch, page);
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || "Failed to delete review");
        }
    };

    return {
        reviews,
        loading,
        error,
        page,
        totalPages,
        filterCounts,
        fetchReviews,
        updateStatus,
        deleteReview,
    };
}
