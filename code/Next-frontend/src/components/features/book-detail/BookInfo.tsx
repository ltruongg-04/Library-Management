import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import type { BookDetail } from "@/types/book";

interface BookInfoProps {
    book: BookDetail;
}

export default function BookInfo({ book }: BookInfoProps) {
    const isAvailable = book.availableCount > 0;

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
                        {isAvailable ? UI_TEXT.BOOK_DETAIL.STATUS_AVAILABLE : UI_TEXT.BOOK_DETAIL.STATUS_OUT_OF_STOCK}
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
                    {UI_TEXT.BOOK_DETAIL.BY}{" "}
                    {book.authorsList && book.authorsList.length > 0
                        ? book.authorsList.map((a, i) => (
                              <span key={a.id}>
                                  <Link
                                      href={`/sach?authorId=${a.id}&authorName=${encodeURIComponent(a.name)}`}
                                      className="hover:text-primary-700 hover:underline dark:hover:text-primary-300"
                                  >
                                      {a.name}
                                  </Link>
                                  {i < book.authorsList!.length - 1 ? ", " : ""}
                              </span>
                          ))
                        : book.author || UI_TEXT.COMMON.UNKNOWN_AUTHOR}
                </p>

                {/* Description */}
                <p className="text-justify font-body-md text-body-md leading-relaxed text-on-surface transition-colors duration-200 dark:text-white">
                    {book.description}
                </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 border-y border-outline-variant/30 py-4 dark:border-slate-700 md:grid-cols-3 lg:grid-cols-6">
                <MetadataItem
                    label={UI_TEXT.BOOK_DETAIL.METADATA.PUBLISHER}
                    value={book.publisher || UI_TEXT.COMMON.UPDATING}
                    href={book.publisher ? `/sach?publisher=${encodeURIComponent(book.publisher)}` : undefined}
                />
                <MetadataItem
                    label={UI_TEXT.BOOK_DETAIL.METADATA.PUBLISHED}
                    value={book.publishedDate ? new Date(book.publishedDate).getFullYear().toString() : UI_TEXT.COMMON.UPDATING}
                />
                <MetadataItem label={UI_TEXT.BOOK_DETAIL.METADATA.PAGES} value={book.pages ? String(book.pages) : UI_TEXT.COMMON.UPDATING} />
                <MetadataItem label={UI_TEXT.BOOK_DETAIL.METADATA.ISBN} value={book.isbn || UI_TEXT.COMMON.UPDATING} />
                <MetadataItem
                    label={UI_TEXT.BOOK_DETAIL.METADATA.DEPOSIT}
                    value={book.depositPrice ? `${book.depositPrice.toLocaleString("vi-VN")} đ` : UI_TEXT.COMMON.UPDATING}
                />
                <MetadataItem label={UI_TEXT.BOOK_DETAIL.METADATA.RENTAL_FEE} value={UI_TEXT.BOOK_DETAIL.METADATA.RENTAL_FEE_VALUE} />
            </div>

            {/* Tags & Categories */}
            <div>
                <h3 className="mb-2 font-title-md text-title-md text-on-surface transition-colors duration-200 dark:text-white">
                    {UI_TEXT.BOOK_DETAIL.TAGS_CATEGORIES}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {book.categories?.map((category, index) => (
                        <span
                            key={index}
                            className="rounded-full bg-surface-container px-2 py-1 font-body-sm text-body-sm text-on-surface-variant transition-colors duration-200 dark:bg-slate-800 dark:text-white"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MetadataItem({ label, value, href }: { label: string; value: string; href?: string }) {
    return (
        <div className="flex flex-col">
            <span className="mb-1 font-label-caps text-label-caps text-on-surface-variant transition-colors duration-200 dark:text-white">{label}</span>
            {href ? (
                <Link href={href} className="font-body-sm text-body-sm text-primary-700 transition-colors duration-200 hover:underline dark:text-primary-300">
                    {value}
                </Link>
            ) : (
                <span className="font-body-sm text-body-sm text-on-surface transition-colors duration-200 dark:text-white">{value}</span>
            )}
        </div>
    );
}
