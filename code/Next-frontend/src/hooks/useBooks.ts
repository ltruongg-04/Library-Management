"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bookService } from "@/services/book";
import type { Book, BookPageResponse, BookSearchParams } from "@/types/book";

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
    // AbortController để hủy thực sự request HTTP cũ khi có request mới
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchBooks = useCallback(async (searchParams: BookSearchParams, signal?: AbortSignal) => {
        const startTime = Date.now();
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data: BookPageResponse = await bookService.getBooks(searchParams, signal);
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
            // Bỏ qua lỗi do abort (request bị hủy có chủ đích)
            if (err.name === "AbortError") return;
            const elapsed = Date.now() - startTime;
            if (elapsed < 5000) {
                await new Promise((resolve) => setTimeout(resolve, 5000 - elapsed));
            }
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err.message || "Đã xảy ra lỗi khi tải sách",
            }));
        }
    }, []);

    useEffect(() => {
        // Hủy request cũ nếu còn đang chạy
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        fetchBooks(params, controller.signal);

        return () => {
            controller.abort();
        };
    }, [params, fetchBooks]);

    // ✅ Debounce keyword riêng — không để page/category bị delay
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setPage = (page: number) => setParams((prev) => ({ ...prev, page }));

    const setKeyword = (keyword: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        // Khi xóa hết → fetch ngay lập tức, không chờ debounce
        if (!keyword) {
            setParams((prev) => ({ ...prev, keyword: undefined, page: 0 }));
            return;
        }
        debounceRef.current = setTimeout(() => {
            setParams((prev) => ({ ...prev, keyword, page: 0 }));
        }, 400);
    };

    const setCategory = (category: string) => setParams((prev) => ({ ...prev, category: category || undefined, page: 0 }));

    const setSortBy = (sortBy: BookSearchParams["sortBy"]) => setParams((prev) => ({ ...prev, sortBy, page: 0 }));

    const clearFilters = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setParams({ page: 0, size: params.size });
    };

    const refresh = () => fetchBooks(params);

    return { ...state, setPage, setKeyword, setCategory, setSortBy, clearFilters, refresh };
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
            const startTime = Date.now();
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
                    const elapsed = Date.now() - startTime;
                    if (elapsed < 5000) {
                        await new Promise((resolve) => setTimeout(resolve, 5000 - elapsed));
                    }
                    if (!cancelled) {
                        setError(err.message || "Không thể tải chi tiết sách");
                        setLoading(false);
                    }
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
            const startTime = Date.now();
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
                    const elapsed = Date.now() - startTime;
                    if (elapsed < 5000) {
                        await new Promise((resolve) => setTimeout(resolve, 5000 - elapsed));
                    }
                    if (!cancelled) {
                        setError(err.message || "Không thể tải sách thịnh hành");
                        setLoading(false);
                    }
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
