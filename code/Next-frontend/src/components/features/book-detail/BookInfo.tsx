import type { Book } from "@/types/book";
import { MaterialIcon } from "@/components/base/material-icon";

interface BookInfoProps {
  book: Book;
}

export default function BookInfo({ book }: BookInfoProps) {
  const isAvailable = book.availableCount > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Status & Rating */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {/* Availability Badge */}
          <span
            className={`px-2 py-1 rounded text-[10px] font-label-caps uppercase tracking-wider font-bold ${
              isAvailable
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-error-container text-on-error-container"
            }`}
          >
            {isAvailable ? "Available Now" : "Out of Stock"}
          </span>

          {/* Rating */}
          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-white flex items-center transition-colors duration-200">
            <MaterialIcon
              name="star"
              className="text-[16px] text-amber-500 mr-1"
              style={{ fontVariationSettings: "'FILL' 1" }}
            />
            {book.rating} ({book.reviewCount} Reviews)
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display-lg text-display-lg text-on-surface dark:text-white mb-1 transition-colors duration-200">
          {book.title}
        </h1>

        {/* Author */}
        <p className="font-title-md text-title-md text-on-surface-variant dark:text-white mb-4 transition-colors duration-200">
          By {book.author}
        </p>

        {/* Description */}
        <p className="font-body-md text-body-md text-on-surface dark:text-white leading-relaxed text-justify transition-colors duration-200">
          {book.description}
        </p>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-outline-variant/30 dark:border-slate-700">
        <MetadataItem label="Publisher" value={book.publisher} />
        <MetadataItem label="Published" value={book.publishedDate} />
        <MetadataItem label="Pages" value={String(book.pages)} />
        <MetadataItem label="ISBN" value={book.isbn} />
      </div>

      {/* Tags & Categories */}
      <div>
        <h3 className="font-title-md text-title-md text-on-surface dark:text-white mb-2 transition-colors duration-200">
          Tags &amp; Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {book.categories.map((category) => (
            <span
              key={category}
              className="px-2 py-1 bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-white rounded-full font-body-sm text-body-sm transition-colors duration-200"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-white mb-1 transition-colors duration-200">
        {label}
      </span>
      <span className="font-body-sm text-body-sm text-on-surface dark:text-white transition-colors duration-200">{value}</span>
    </div>
  );
}
