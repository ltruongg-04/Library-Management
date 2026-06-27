"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/features/book-detail/Breadcrumb";
import BookCover from "@/components/features/book-detail/BookCover";
import BookInfo from "@/components/features/book-detail/BookInfo";
import AIChatbot from "@/components/features/book-detail/AIChatbot";
import RelatedBooks from "@/components/features/book-detail/RelatedBooks";
import { MaterialIcon } from "@/components/base/material-icon";
import type { Book, RelatedBook } from "@/types/book";
import { bookService } from "@/services/book";

// Skeleton components cho loading state
function BookDetailSkeleton() {
  return (
    <div className="pb-12 px-4 md:px-6 max-w-[1440px] mx-auto w-full animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 py-4 mb-2">
        <div className="h-4 bg-surface-container-low dark:bg-slate-800 rounded w-16" />
        <div className="h-4 bg-surface-container-low dark:bg-slate-800 rounded w-4" />
        <div className="h-4 bg-surface-container-low dark:bg-slate-800 rounded w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12">
        {/* Cover skeleton */}
        <div className="col-span-1 md:col-span-4 lg:col-span-3">
          <div className="bg-surface-container-low dark:bg-slate-800 rounded-lg aspect-[2/3] w-full" />
          <div className="mt-4 space-y-2">
            <div className="h-10 bg-surface-container-low dark:bg-slate-800 rounded-lg" />
            <div className="h-10 bg-surface-container-low dark:bg-slate-800 rounded-lg" />
          </div>
        </div>

        {/* Info skeleton */}
        <div className="col-span-1 md:col-span-8 lg:col-span-6 space-y-4">
          <div className="flex gap-2">
            <div className="h-6 bg-surface-container-low dark:bg-slate-800 rounded w-24" />
            <div className="h-6 bg-surface-container-low dark:bg-slate-800 rounded w-20" />
          </div>
          <div className="h-10 bg-surface-container-low dark:bg-slate-800 rounded w-3/4" />
          <div className="h-6 bg-surface-container-low dark:bg-slate-800 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-surface-container-low dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-surface-container-low dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-surface-container-low dark:bg-slate-800 rounded w-2/3" />
          </div>
        </div>

        {/* Chatbot skeleton */}
        <div className="col-span-1 md:col-span-12 lg:col-span-3">
          <div className="h-64 bg-surface-container-low dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<RelatedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookDetail() {
      try {
        setLoading(true);
        setError(null);

        // Fetch chi tiết sách
        const bookData = await bookService.getBookById(Number(id));
        setBook(bookData);

        // Fetch danh sách sách để lấy related books (trừ sách hiện tại)
        try {
          const allBooks = await bookService.getBooks();
          const related: RelatedBook[] = allBooks
            .filter((b) => b.id !== Number(id))
            .slice(0, 5)
            .map((b) => ({
              id: b.id,
              title: b.title,
              authors: b.authors || [],
              coverImage: b.imageUrl || "",
            }));
          setRelatedBooks(related);
        } catch {
          // Nếu không lấy được related books thì bỏ qua
          setRelatedBooks([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải thông tin sách");
      } finally {
        setLoading(false);
      }
    }

    fetchBookDetail();
  }, [id]);

  if (loading) {
    return <BookDetailSkeleton />;
  }

  if (error || !book) {
    return (
      <div className="pb-12 px-4 md:px-6 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MaterialIcon name="error_outline" className="text-[64px] text-error mb-4" />
          <h2 className="font-sans text-[24px] font-semibold text-on-surface dark:text-white mb-2">
            {error || "Không tìm thấy sách"}
          </h2>
          <p className="font-sans text-[16px] text-on-surface-variant dark:text-white mb-6">
            Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
          </p>
          <a
            href="/"
            className="bg-primary dark:bg-primary-500 text-on-primary rounded-lg py-2 px-6 font-semibold hover:bg-on-primary-fixed-variant transition-colors"
          >
            Quay về trang chủ
          </a>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Catalog", href: "/" },
    { label: book.categories?.[0]?.name || "General", href: "/" },
    { label: book.title },
  ];

  return (
    <div className="pb-12 px-4 md:px-6 max-w-[1440px] mx-auto w-full">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12">
        {/* Left Column: Book Cover & Actions */}
        <div className="col-span-1 md:col-span-4 lg:col-span-3">
          <BookCover book={book} />
        </div>

        {/* Middle Column: Metadata & Details */}
        <div className="col-span-1 md:col-span-8 lg:col-span-6">
          <BookInfo book={book} />
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

