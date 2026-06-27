import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import type { Book } from "@/types/book";

interface BookInfoProps {
    book: Book;
}

export default function BookInfo({ book }: BookInfoProps) {
    const isAvailable = book.availableQuantity > 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Status & Rating */}
            <div>
                <div className="mb-2 flex items-center gap-2">
                    {/* Availability Badge */}
                    <span
                        className={`rounded px-2 py-1 font-label-caps text-[10px] font-bold uppercase tracking-wider ${
                            isAvailable ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"
                        }`}
                    >
                        {isAvailable ? "Available Now" : "Out of Stock"}
                    </span>

                    {/* Rating */}
                    <span className="flex items-center font-body-sm text-body-sm text-on-surface-variant transition-colors duration-200 dark:text-white">
                        <MaterialIcon name="star" className="mr-1 text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }} />
                        {book.rating} ({book.reviewCount} {UI_TEXT.BOOK_DETAIL.REVIEWS})
                    </span>
                </div>

                {/* Title */}
                <h1 className="mb-1 font-display-lg text-display-lg text-on-surface transition-colors duration-200 dark:text-white">{book.title}</h1>

                {/* Author */}
                <p className="mb-4 font-title-md text-title-md text-on-surface-variant transition-colors duration-200 dark:text-white">
                    {UI_TEXT.BOOK_DETAIL.BY} {book.authors?.map(a => a.name).join(", ") || "Unknown"}
                </p>

                {/* Description */}
                <p className="text-justify font-body-md text-body-md leading-relaxed text-on-surface transition-colors duration-200 dark:text-white">
                    {book.description}
                </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 border-y border-outline-variant/30 py-4 dark:border-slate-700 md:grid-cols-4">
                <MetadataItem label="Publisher" value={book.publisher || "N/A"} />
                <MetadataItem label="Published" value={book.publicationDate ? new Date(book.publicationDate).getFullYear().toString() : "N/A"} />
                <MetadataItem label="Pages" value={book.pages ? String(book.pages) : "N/A"} />
                <MetadataItem label="ISBN" value={book.isbn || "N/A"} />
            </div>

            {/* Tags & Categories */}
            <div>
                <h3 className="mb-2 font-title-md text-title-md text-on-surface transition-colors duration-200 dark:text-white">
                    {UI_TEXT.BOOK_DETAIL.TAGS_CATEGORIES}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {book.categories?.map((category) => (
                        <span
                            key={category.id}
                            className="rounded-full bg-surface-container px-2 py-1 font-body-sm text-body-sm text-on-surface-variant transition-colors duration-200 dark:bg-slate-800 dark:text-white"
                        >
                            {category.name}
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
            <span className="mb-1 font-label-caps text-label-caps text-on-surface-variant transition-colors duration-200 dark:text-white">{label}</span>
            <span className="font-body-sm text-body-sm text-on-surface transition-colors duration-200 dark:text-white">{value}</span>
        </div>
    );
}

