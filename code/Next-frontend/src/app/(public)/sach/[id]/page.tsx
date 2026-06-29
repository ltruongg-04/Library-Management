"use client";

import Breadcrumb from "@/components/features/book-detail/Breadcrumb";
import BookCover from "@/components/features/book-detail/BookCover";
import BookInfo from "@/components/features/book-detail/BookInfo";
import AIChatbot from "@/components/features/book-detail/AIChatbot";
import RelatedBooks from "@/components/features/book-detail/RelatedBooks";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { useBookDetail, useTrendingBooks } from "@/hooks/useBooks";
import { bookToBookDetail } from "@/types/book";
import type { RelatedBook } from "@/types/book";

export default function BookDetailPage({ params }: { params: { id: string } }) {
    const bookId = parseInt(params.id, 10);
    const { book, loading, error } = useBookDetail(isNaN(bookId) ? null : bookId);
    const { books: trendingBooks } = useTrendingBooks(5);

    // Loading state
    if (loading) {
        return (
            <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 md:px-6">
                <div className="py-4">
                    <div className="h-4 w-48 animate-pulse rounded bg-surface-container-low dark:bg-slate-800"></div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-12">
                    <div className="col-span-1 md:col-span-4 lg:col-span-3">
                        <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-surface-container-low dark:bg-slate-800"></div>
                    </div>
                    <div className="col-span-1 space-y-4 md:col-span-8 lg:col-span-6">
                        <div className="h-8 w-3/4 animate-pulse rounded bg-surface-container-low dark:bg-slate-800"></div>
                        <div className="h-5 w-1/2 animate-pulse rounded bg-surface-container-low dark:bg-slate-800"></div>
                        <div className="h-24 w-full animate-pulse rounded bg-surface-container-low dark:bg-slate-800"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !book) {
        return (
            <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 md:px-6">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <MaterialIcon name="error_outline" className="mb-4 text-[64px] text-red-400" />
                    <h2 className="mb-2 text-[24px] font-semibold text-on-surface dark:text-white">
                        {UI_TEXT.COMMON.ERROR_LOAD_BOOK_DETAIL}
                    </h2>
                    <p className="text-on-surface-variant dark:text-white/70">{error || "Sách không tồn tại"}</p>
                </div>
            </div>
        );
    }

    const bookDetail = bookToBookDetail(book);

    // Map trending books thành RelatedBook[] (loại bỏ sách hiện tại)
    const relatedBooks: RelatedBook[] = trendingBooks
        .filter((b) => b.id !== book.id)
        .slice(0, 4)
        .map((b) => ({
            id: b.id,
            title: b.title,
            authors: b.authors || [],
            coverImage: b.imageUrl || "",
        }));

    const breadcrumbItems = [
        { label: "Catalog", href: "/" },
        { label: book.categories?.[0]?.name || "Sách", href: "/sach" },
        { label: book.title },
    ];

    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 md:px-6">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-12">
                {/* Left Column: Book Cover & Actions */}
                <div className="col-span-1 md:col-span-4 lg:col-span-3">
                    <BookCover book={bookDetail} />
                </div>

                {/* Middle Column: Metadata & Details */}
                <div className="col-span-1 md:col-span-8 lg:col-span-6">
                    <BookInfo book={bookDetail} />
                </div>

                {/* Right Column: AI Chatbot */}
                <div className="col-span-1 md:col-span-12 lg:col-span-3">
                    <AIChatbot bookTitle={book.title} />
                </div>
            </div>

            {/* Related Books Section */}
            {relatedBooks.length > 0 && <RelatedBooks books={relatedBooks} />}
        </div>
    );
}
