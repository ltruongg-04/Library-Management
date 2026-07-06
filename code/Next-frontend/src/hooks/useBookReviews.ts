import { useEffect, useState } from "react";

export interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export function useBookReviews(bookId: number | null) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookId) {
            setReviews([]);
            return;
        }

        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null); // reset error

                const res = await fetch(`http://localhost:8080/books/${bookId}/reviews`);

                if (!res.ok) {
                    throw new Error("Failed to fetch reviews");
                }

                const data = await res.json();

                setReviews(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [bookId]);

    return { reviews, loading, error };
}
