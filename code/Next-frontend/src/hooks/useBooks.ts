"use client";

import { useCallback, useEffect, useState } from "react";
import type { Book, BookPageResponse, BookSearchParams } from "@/types/book";
import { bookService } from "@/services/book";

interface UseBooksState {
    books: Book[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    totalElements: number;
    isLast: boolean;
}

/**
 * Hook để lấy danh sách sách (phân trang, tìm kiếm, lọc)
 */
export function useBooks(initialParams?: BookSearchParams) {
    const [state, setState] = useState<UseBooksState>({
        books: [],
        loading: true,
        error: null,
        page: 0,
        totalPages: 0,
        totalElements: 0,
        isLast: true,
    });

    const [params, setParams] = useState<BookSearchParams>(initialParams || {});

    const fetchBooks = useCallback(async (searchParams: BookSearchParams) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data: BookPageResponse = await bookService.getBooks(searchParams);
            setState({
                books: data.content,
                loading: false,
                error: null,
                page: data.page,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                isLast: data.last,
            });
        } catch (err: any) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err.message || "Đã xảy ra lỗi khi tải sách",
            }));
        }
    }, []);

    useEffect(() => {
        fetchBooks(params);
    }, [params, fetchBooks]);

    const setPage = (page: number) => {
        setParams((prev) => ({ ...prev, page }));
    };

    const setKeyword = (keyword: string) => {
        setParams((prev) => ({ ...prev, keyword, page: 0 }));
    };

    const setCategory = (category: string) => {
        setParams((prev) => ({ ...prev, category: category || undefined, page: 0 }));
    };

    const setSortBy = (sortBy: BookSearchParams["sortBy"]) => {
        setParams((prev) => ({ ...prev, sortBy, page: 0 }));
    };

    const clearFilters = () => {
        setParams({ page: 0, size: params.size });
    };

    const refresh = () => {
        fetchBooks(params);
    };

    return {
        ...state,
        setPage,
        setKeyword,
        setCategory,
        setSortBy,
        clearFilters,
        refresh,
    };
}

/**
 * Hook để lấy chi tiết một cuốn sách
 */
export function useBookDetail(id: number | null) {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id === null) return;

        let cancelled = false;

        async function fetchBook() {
            setLoading(true);
            setError(null);
            try {
                const data = await bookService.getBookById(id!);
                if (!cancelled) {
                    setBook(data);
                    setLoading(false);
                }
            } catch (err: any) {
                if (!cancelled) {
                    setError(err.message || "Không thể tải chi tiết sách");
                    setLoading(false);
                }
            }
        }

        fetchBook();

        return () => {
            cancelled = true;
        };
    }, [id]);

    return { book, loading, error };
}

/**
 * Hook để lấy sách thịnh hành
 */
export function useTrendingBooks(limit: number = 8) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchTrending() {
            setLoading(true);
            setError(null);
            try {
                const data = await bookService.getTrendingBooks(limit);
                if (!cancelled) {
                    setBooks(data.content);
                    setLoading(false);
                }
            } catch (err: any) {
                if (!cancelled) {
                    setError(err.message || "Không thể tải sách thịnh hành");
                    setLoading(false);
                }
            }
        }

        fetchTrending();

        return () => {
            cancelled = true;
        };
    }, [limit]);

    return { books, loading, error };
}
