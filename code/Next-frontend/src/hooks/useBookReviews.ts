import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface Review {
    id: number;
    userId: number;
    userName: string;
    avatarUrl?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export function useBookReviews(bookId: number | null) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = useCallback(
        async (pageToFetch = 0) => {
            if (!bookId) return;

            try {
                setLoading(true);
                setError(null);
                const res = await axiosInstance.get(`/api/public/books/${bookId}/reviews?page=${pageToFetch}&size=5&sort=createdAt,desc`);
                if (pageToFetch === 0) {
                    setReviews(res.data.content);
                } else {
                    setReviews((prev) => [...prev, ...res.data.content]);
                }
                setTotalPages(res.data.totalPages);
                setPage(pageToFetch);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        },
        [bookId],
    );

    useEffect(() => {
        fetchReviews(0);
    }, [fetchReviews]);

    const loadMore = () => {
        if (page < totalPages - 1 && !loading) {
            fetchReviews(page + 1);
        }
    };

    const submitReview = async (rating: number, comment: string) => {
        if (!bookId) return false;
        try {
            await axiosInstance.post(`/api/books/${bookId}/reviews`, { rating, comment });
            // Refresh first page after posting
            await fetchReviews(0);
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || "Failed to submit review");
        }
    };

    const updateReview = async (reviewId: number, rating: number, comment: string) => {
        if (!bookId) return false;
        try {
            await axiosInstance.put(`/api/books/${bookId}/reviews/${reviewId}`, { rating, comment });
            await fetchReviews(0);
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || "Failed to update review");
        }
    };

    const deleteReview = async (reviewId: number) => {
        if (!bookId) return false;
        try {
            await axiosInstance.delete(`/api/books/${bookId}/reviews/${reviewId}`);
            await fetchReviews(0);
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || "Failed to delete review");
        }
    };

    const reportReview = async (reviewId: number, reason: string) => {
        if (!bookId) return false;
        try {
            await axiosInstance.post(`/api/books/${bookId}/reviews/${reviewId}/report?reason=${encodeURIComponent(reason)}`);
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || "Failed to report review");
        }
    };

    return {
        reviews,
        loading,
        error,
        hasMore: page < totalPages - 1,
        loadMore,
        submitReview,
        updateReview,
        deleteReview,
        reportReview,
    };
}
