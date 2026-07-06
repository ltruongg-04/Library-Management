"use client";

import { useCallback, useEffect, useState } from "react";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import { useAuth } from "@/providers/auth";
import { favoriteService } from "@/services/favorite";
import type { Book } from "@/types/book";

interface UseFavoritesState {
    books: Book[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    hasMore: boolean;
}

export function useFavorites(initialLimit: number = 12) {
    const { isAuthenticated } = useAuth();
    const [state, setState] = useState<UseFavoritesState>({
        books: [],
        loading: true,
        error: null,
        page: 0,
        totalPages: 0,
        hasMore: false,
    });

    // We fetch a larger size equal to current 'limit'
    const fetchFavorites = useCallback(
        async (size: number) => {
            if (!isAuthenticated) {
                setState((prev) => ({ ...prev, loading: false, error: API_ERRORS.LOGIN_FAILED }));
                return;
            }

            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                const data = await favoriteService.getFavorites(0, size);
                setState({
                    books: data.content,
                    loading: false,
                    error: null,
                    page: 0,
                    totalPages: data.totalPages,
                    hasMore: data.content.length < data.totalElements,
                });
            } catch (err: any) {
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: err.message || API_ERRORS.FAVORITE_LOAD_FAILED,
                }));
            }
        },
        [isAuthenticated],
    );

    useEffect(() => {
        if (isAuthenticated !== undefined) {
            fetchFavorites(initialLimit);
        }
    }, [initialLimit, fetchFavorites, isAuthenticated]);

    const removeFavorite = async (bookId: number) => {
        try {
            await favoriteService.removeFavorite(bookId);
            setState((prev) => ({
                ...prev,
                books: prev.books.filter((b) => b.id !== bookId),
            }));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    return { ...state, removeFavorite, refetch: fetchFavorites };
}
