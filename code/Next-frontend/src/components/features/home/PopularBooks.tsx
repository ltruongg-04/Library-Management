"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { bookService } from "@/services/book";
import type { BookListItem } from "@/types/book";

const CATEGORY_STYLES: Record<string, string> = {
  "artificial intelligence": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
  "fiction": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
  "novel": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
  "history": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
  "design": "text-tertiary-500 bg-tertiary-500/10 dark:text-white dark:bg-tertiary-500/40",
  "science": "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
  "default": "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
};

function getCategoryStyle(category: string): string {
  const lowerCategory = category.toLowerCase().trim();
  for (const [key, style] of Object.entries(CATEGORY_STYLES)) {
    if (lowerCategory.includes(key)) return style;
  }
  return CATEGORY_STYLES.default;
}

function BookCard({ book }: { book: BookListItem }) {
  const wrapperClass =
    "w-[260px] md:w-[280px] shrink-0 bg-surface-container-lowest dark:bg-slate-900 rounded-lg level-1-shadow level-2-shadow-hover transition-all duration-300 overflow-hidden flex flex-col h-full group snap-start";

  // Lấy category đầu tiên để hiển thị tag
  const displayCategory = book.categories && book.categories.length > 0
    ? book.categories[0].name
    : "General";

  return (
    <Link href={`/sach/${book.id}`} className={wrapperClass}>
      {/* Cover Image Area */}
      <div className="relative h-48 w-full overflow-hidden bg-surface-container-low dark:bg-slate-800 p-4 flex items-center justify-center transition-colors duration-200">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={`Book cover: ${book.title}`}
            width={128}
            height={192}
            className="h-full w-auto object-cover rounded shadow-sm group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="w-24 h-36 bg-primary-container rounded shadow-md flex items-center justify-center text-on-primary-container group-hover:scale-105 transition-transform duration-500">
            <MaterialIcon name="menu_book" className="text-[48px]" />
          </div>
        )}

        {/* Rating Badge */}
        {book.rating > 0 && (
          <div className="absolute top-2 right-2 bg-surface-container-lowest/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-full border border-outline-variant/30 dark:border-slate-700 flex items-center shadow-sm">
            <MaterialIcon
              name="star"
              className="text-amber-500 dark:text-white text-sm mr-1"
              style={{ fontVariationSettings: "'FILL' 1" }}
            />
            <span className="font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] text-on-surface dark:text-white">
              {book.rating}/5
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-sans text-[20px] font-semibold leading-[28px] text-on-surface dark:text-white mb-1 line-clamp-1 transition-colors duration-200">
          {book.title}
        </h3>
        <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant dark:text-white mb-4 transition-colors duration-200 line-clamp-1">
          {book.authors && book.authors.length > 0 ? book.authors.map(a => a.name).join(", ") : "Unknown Author"}
        </p>
        <div className="mt-auto flex justify-between items-center">
          <span
            className={`font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] ${getCategoryStyle(displayCategory)} px-2 py-1 rounded line-clamp-1 max-w-[150px]`}
          >
            {displayCategory}
          </span>
          <button
            className="text-primary-700 dark:text-white hover:text-secondary-300 dark:hover:text-secondary-300 transition-colors shrink-0"
            aria-label={`Bookmark ${book.title}`}
            onClick={(e) => e.preventDefault()}
          >
            <MaterialIcon name="bookmark_add" />
          </button>
        </div>
      </div>
    </Link>
  );
}

function BookCardSkeleton() {
  return (
    <div className="w-[260px] md:w-[280px] shrink-0 bg-surface-container-lowest dark:bg-slate-900 rounded-lg level-1-shadow overflow-hidden flex flex-col h-[380px] animate-pulse snap-start">
      <div className="h-48 w-full bg-surface-container-low dark:bg-slate-800" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="h-6 bg-surface-container-low dark:bg-slate-800 rounded w-3/4 mb-2" />
        <div className="h-4 bg-surface-container-low dark:bg-slate-800 rounded w-1/2 mb-4" />
        <div className="mt-auto flex justify-between items-center">
          <div className="h-5 bg-surface-container-low dark:bg-slate-800 rounded w-20" />
          <div className="h-5 w-5 bg-surface-container-low dark:bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function PopularBooks() {
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTopRatedBooks() {
      try {
        setLoading(true);
        const data = await bookService.getTopRatedBooks();
        setBooks(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    }
    fetchTopRatedBooks();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 px-4 lg:px-6 max-w-[1440px] mx-auto overflow-hidden">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-sans text-[32px] font-semibold leading-[40px] tracking-[-0.01em] text-primary-700 dark:text-white transition-colors duration-200">
            Đang thịnh hành
          </h2>
          <p className="font-sans text-[16px] leading-[24px] text-on-surface-variant dark:text-white transition-colors duration-200 mt-1">
            Xu hướng hiện tại.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container-high dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-on-surface dark:text-white"
            aria-label="Cuộn trái"
          >
            <MaterialIcon name="chevron_left" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container-high dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-on-surface dark:text-white"
            aria-label="Cuộn phải"
          >
            <MaterialIcon name="chevron_right" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <MaterialIcon name="error_outline" className="text-[48px] text-error mb-2" />
          <p className="text-on-surface-variant dark:text-white">{error}</p>
        </div>
      )}

      {/* Book Cards Carousel */}
      <div className="relative -mx-4 px-4 lg:-mx-6 lg:px-6">
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pt-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />)
            : books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </section>
  );
}

