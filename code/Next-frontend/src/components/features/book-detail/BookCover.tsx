"use client";

import Image from "next/image";
import type { Book } from "@/types/book";

interface BookCoverProps {
  book: Book;
}

export default function BookCover({ book }: BookCoverProps) {
  const isAvailable = book.availableCount > 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Cover Image */}
      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-lg shadow-sm border border-outline-variant/20 dark:border-slate-700 overflow-hidden relative transition-colors duration-200">
        <Image
          src={book.coverImage}
          alt={`Book Cover: ${book.title}`}
          width={400}
          height={600}
          className="w-full h-auto object-cover aspect-[2/3] rounded-t-sm"
          priority
        />

        {/* AI Match Score Badge */}
        {book.aiMatchScore && (
          <div className="absolute top-2 right-2 bg-surface-container-lowest/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm border border-outline-variant/30 dark:border-slate-700">
            <span className="material-symbols-outlined text-secondary dark:text-white text-[14px]">
              temp_preferences_custom
            </span>
            <span className="font-label-caps text-label-caps text-secondary dark:text-white font-bold">
              {book.aiMatchScore}% Match
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-2">
        <button
          disabled={!isAvailable}
          className="bg-primary dark:bg-primary-500 text-on-primary rounded-lg py-2 px-4 font-label-caps text-label-caps flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined">book</span>
          Borrow Now
        </button>
        <button className="border border-secondary dark:border-white text-secondary dark:text-white rounded-lg py-2 px-4 font-label-caps text-label-caps flex items-center justify-center gap-2 hover:bg-secondary/10 dark:hover:bg-white/10 transition-colors bg-transparent cursor-pointer active:scale-95 duration-200">
          <span className="material-symbols-outlined">bookmark_add</span>
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}
