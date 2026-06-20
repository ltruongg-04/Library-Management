import Image from "next/image";
import Link from "next/link";
import type { RelatedBook } from "@/types/book";

interface RelatedBooksProps {
  books: RelatedBook[];
}

export default function RelatedBooks({ books }: RelatedBooksProps) {
  return (
    <section className="mt-12 pt-6 border-t border-outline-variant/30 dark:border-slate-700 transition-colors duration-200">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-white transition-colors duration-200">
          Related Titles
        </h2>
        <Link
          href="/sach"
          className="font-body-sm text-body-sm text-primary dark:text-primary-300 hover:underline flex items-center transition-colors duration-200"
        >
          View all
          <span className="material-symbols-outlined text-[18px] ml-1">
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book, index) => (
          <Link
            key={book.id}
            href={`/sach/${book.id}`}
            className={`bg-surface-container-lowest dark:bg-slate-900 rounded-lg shadow-sm border border-outline-variant/20 dark:border-slate-700 p-2 hover:shadow-md dark:hover:shadow-slate-800 transition-all group cursor-pointer ${
              index === 3 ? "hidden md:block" : ""
            } ${index === 4 ? "hidden lg:block" : ""}`}
          >
            <div className="relative overflow-hidden rounded-sm mb-2 aspect-[2/3]">
              <Image
                src={book.coverImage}
                alt={`Book Cover: ${book.title}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h4 className="font-title-md text-body-sm font-semibold text-on-surface dark:text-white line-clamp-1 transition-colors duration-200">
              {book.title}
            </h4>
            <p className="font-body-sm text-[12px] text-on-surface-variant dark:text-slate-400 line-clamp-1 mb-1 transition-colors duration-200">
              {book.author}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
