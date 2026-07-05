"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth";
import { bookService } from "@/services/book";
import { favoriteService } from "@/services/favorite";
import { userBorrowService } from "@/services/userBorrow";
import type { Book } from "@/types/book";

// ----- Types -----
export interface RecommendedCollection {
    id: string; // unique id để dismiss
    categoryId?: string; // dùng cho link navigate
    categoryName: string;
    description: string;
    matchPercent: number; // 0-100
    reason: "history" | "favorite" | "trending" | "default";
    books: Book[];
    totalBooks: number;
}

interface UseRecommendationsState {
    collections: RecommendedCollection[];
    loading: boolean;
    error: string | null;
}

// ----- ICON mapping cho thể loại -----
const CATEGORY_ICONS: Record<string, string> = {
    "Khoa học & Công nghệ": "science",
    "Tiểu thuyết": "menu_book",
    "Lịch sử": "history_edu",
    Manga: "auto_stories",
    Comic: "comic_bubble",
    "Thiết kế & Nghệ thuật": "palette",
    "Kinh doanh": "business_center",
    "Lập trình": "code",
    "Tâm lý": "psychology",
    "Văn học": "library_books",
    default: "local_library",
};

export function getCategoryIcon(categoryName: string): string {
    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
        if (categoryName?.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(categoryName?.toLowerCase())) {
            return icon;
        }
    }
    return CATEGORY_ICONS["default"];
}

// ----- Hook -----
export function useRecommendations() {
    const { isAuthenticated } = useAuth();

    const [state, setState] = useState<UseRecommendationsState>({
        collections: [],
        loading: true,
        error: null,
    });

    const buildPersonalizedCollections = useCallback(async (): Promise<RecommendedCollection[]> => {
        // 1. Fetch favorites + borrow history in parallel
        const [favResult, borrowResult] = await Promise.allSettled([favoriteService.getFavorites(0, 50), userBorrowService.getHistory(0, 50)]);

        // 2. Count categories from borrow history
        if (borrowResult.status === "fulfilled") {
            // borrowHistory items only have bookTitle/bookAuthor, not categories
            // So we use them for count but can't get category directly
            // Instead we count via favorites which DO have category data
        }

        // 3. Count categories from favorites
        const favBooks: Book[] = favResult.status === "fulfilled" ? favResult.value.content : [];
        const favCategoryMap: Record<string, { count: number; categoryId: string; books: Book[] }> = {};

        for (const book of favBooks) {
            for (const cat of book.categories || []) {
                if (!favCategoryMap[cat.name]) {
                    favCategoryMap[cat.name] = { count: 0, categoryId: String(cat.id), books: [] };
                }
                favCategoryMap[cat.name].count++;
                if (favCategoryMap[cat.name].books.length < 4) {
                    favCategoryMap[cat.name].books.push(book);
                }
            }
        }

        const totalFavCount = favBooks.length || 1;

        // 4. Sort categories by frequency
        const sortedCategories = Object.entries(favCategoryMap)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 3);

        // 5. Build collections
        const collections: RecommendedCollection[] = [];

        for (let i = 0; i < sortedCategories.length; i++) {
            const [catName, catData] = sortedCategories[i];
            const matchPercent = Math.min(95, Math.round((catData.count / totalFavCount) * 100) + 60 + Math.floor(Math.random() * 10));

            // Fetch more books for this category if needed
            let books = catData.books;
            if (books.length < 4) {
                try {
                    const more = await bookService.getBooks({ category: catData.categoryId, size: 4 });
                    books = more.content;
                } catch (_) {
                    /* keep existing */
                }
            }

            collections.push({
                id: `cat-${catData.categoryId}`,
                categoryId: catData.categoryId,
                categoryName: catName,
                description: `Dựa trên ${catData.count} cuốn sách yêu thích của bạn thuộc thể loại này.`,
                matchPercent,
                reason: "favorite",
                books,
                totalBooks: books.length,
            });
        }

        // 6. If not enough collections from favorites, fill with trending
        if (collections.length < 3) {
            try {
                const trending = await bookService.getTrendingBooks(8);
                const trendingBooks = trending.content;

                // Group by category
                const trendingCatMap: Record<string, Book[]> = {};
                for (const book of trendingBooks) {
                    const cat = book.categories?.[0];
                    if (cat && !favCategoryMap[cat.name]) {
                        if (!trendingCatMap[cat.name]) trendingCatMap[cat.name] = [];
                        trendingCatMap[cat.name].push(book);
                    }
                }

                const needed = 3 - collections.length;
                const trendingEntries = Object.entries(trendingCatMap).slice(0, needed);
                for (const [catName, books] of trendingEntries) {
                    collections.push({
                        id: `trend-${catName}`,
                        categoryId: books[0]?.categories?.[0]?.id ? String(books[0].categories[0].id) : undefined,
                        categoryName: catName,
                        description: "Đang được nhiều độc giả quan tâm hiện nay.",
                        matchPercent: 70 + Math.floor(Math.random() * 15),
                        reason: "trending",
                        books,
                        totalBooks: books.length,
                    });
                }
            } catch (_) {
                /* ignore */
            }
        }

        return collections;
    }, []);

    const buildGuestCollections = useCallback(async (): Promise<RecommendedCollection[]> => {
        try {
            const trending = await bookService.getTrendingBooks(8);
            const books = trending.content;

            // Group into 2 fake collections
            const half = Math.ceil(books.length / 2);
            return [
                {
                    id: "guest-trending-1",
                    categoryName: "Đang thịnh hành",
                    description: "Những cuốn sách được đọc nhiều nhất tuần này.",
                    matchPercent: 88,
                    reason: "default",
                    books: books.slice(0, half),
                    totalBooks: half,
                },
                {
                    id: "guest-trending-2",
                    categoryName: "Mới nhất",
                    description: "Các tựa sách mới bổ sung vào thư viện.",
                    matchPercent: 75,
                    reason: "default",
                    books: books.slice(half),
                    totalBooks: books.length - half,
                },
            ];
        } catch (_) {
            return [];
        }
    }, []);

    const fetchCollections = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const collections = isAuthenticated ? await buildPersonalizedCollections() : await buildGuestCollections();
            setState({ collections, loading: false, error: null });
        } catch (err: any) {
            setState({ collections: [], loading: false, error: err.message || "Lỗi tải gợi ý" });
        }
    }, [isAuthenticated, buildPersonalizedCollections, buildGuestCollections]);

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    const dismiss = useCallback((collectionId: string) => {
        setState((prev) => ({
            ...prev,
            collections: prev.collections.filter((c) => c.id !== collectionId),
        }));

        // Lưu vào localStorage để nhớ giữa các session
        try {
            const dismissed: string[] = JSON.parse(localStorage.getItem("dismissed_collections") || "[]");
            if (!dismissed.includes(collectionId)) {
                dismissed.push(collectionId);
                localStorage.setItem("dismissed_collections", JSON.stringify(dismissed));
            }
        } catch (_) {
            /* ignore */
        }
    }, []);

    return {
        ...state,
        refresh: fetchCollections,
        dismiss,
    };
}
