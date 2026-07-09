"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import AIChatbot from "@/components/features/book-detail/AIChatbot";
import BookCover from "@/components/features/book-detail/BookCover";
import BookInfo from "@/components/features/book-detail/BookInfo";
import Breadcrumb from "@/components/features/book-detail/Breadcrumb";
import RelatedBooks from "@/components/features/book-detail/RelatedBooks";
import ReviewSection from "@/components/features/book-detail/review/ReviewSection";
import { Skeleton } from "@/components/ui/skeleton";
import { UI_TEXT } from "@/constants/ui-text";
import { useBookDetail, useRelatedBooks } from "@/hooks/useBooks";
import { bookToBookDetail } from "@/types/book";
import type { RelatedBook } from "@/types/book";

export default function BookDetailPage({ params }: { params: { id: string } }) {
    const bookId = parseInt(params.id, 10);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const { book, loading, error } = useBookDetail(isNaN(bookId) ? null : bookId);
    const { books: relatedBooksData } = useRelatedBooks(bookId, book?.categories?.[0]?.id?.toString(), 4);
    // Loading state
    if (loading) {
        return (
            <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-6 md:px-6 md:pt-8">
                <div className="py-4">
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-12">
                    <div className="col-span-1 md:col-span-4 lg:col-span-3">
                        <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                    </div>
                    <div className="col-span-1 space-y-4 md:col-span-8 lg:col-span-6">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !book) {
        return (
            <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-6 md:px-6 md:pt-8">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <MaterialIcon name="error_outline" className="mb-4 text-[64px] text-red-400" />
                    <h2 className="mb-2 text-[24px] font-semibold text-on-surface dark:text-white">{UI_TEXT.COMMON.ERROR_LOAD_BOOK_DETAIL}</h2>
                    <p className="text-on-surface-variant dark:text-white/70">{error || UI_TEXT.COMMON.BOOK_NOT_FOUND}</p>
                </div>
            </div>
        );
    }

    const bookDetail = bookToBookDetail(book);

    // Map related books thành RelatedBook[]
    const relatedBooks: RelatedBook[] = relatedBooksData.map((b) => ({
        id: b.id,
        title: b.title,
        authors: b.authors || [],
        coverImage: b.imageUrl || "",
    }));

    const breadcrumbItems = [
        { label: UI_TEXT.BOOK_LIST.BREADCRUMB_HOME, href: "/" },
        { label: UI_TEXT.BOOK_LIST.BREADCRUMB_LIST, href: "/sach" },
        { label: book.title },
    ];

    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-6 md:px-6 md:pt-8">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-12">
                {/* Left Column: Book Cover & Actions */}
                <div className="col-span-1 md:col-span-4 lg:col-span-3">
                    <BookCover book={bookDetail} onOpenReview={() => setIsReviewModalOpen(true)} />
                </div>

                {/* Middle Column: Metadata & Details */}
                <div className="col-span-1 md:col-span-8 lg:col-span-9">
                    <BookInfo book={bookDetail} />
                </div>
            </div>
            <ReviewSection bookId={bookId} isReviewModalOpen={isReviewModalOpen} onCloseReviewModal={() => setIsReviewModalOpen(false)} />

            {/* Related Books Section */}
            {relatedBooks.length > 0 && <RelatedBooks books={relatedBooks} categoryId={book?.categories?.[0]?.id?.toString()} />}

            {/* AI Chatbot Floating Widget */}
            <AIChatbot bookTitle={book.title} />
        </div>
    );
}
