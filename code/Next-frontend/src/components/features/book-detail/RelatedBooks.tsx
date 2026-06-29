import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import type { RelatedBook } from "@/types/book";

interface RelatedBooksProps {
    books: RelatedBook[];
}

export default function RelatedBooks({ books }: RelatedBooksProps) {
    return (
        <section className="mt-12 border-t border-outline-variant/30 pt-6 transition-colors duration-200 dark:border-slate-700">
            {/* Section Header */}
            <div className="mb-6 flex items-end justify-between">
                <h2 className="font-headline-lg text-headline-lg text-on-surface transition-colors duration-200 dark:text-white">
                    {UI_TEXT.BOOK_DETAIL.RELATED_BOOKS_HEADING}
                </h2>
                <Link
                    href="/sach"
                    className="flex items-center font-body-sm text-body-sm text-primary transition-colors duration-200 hover:underline dark:text-primary-300"
                >
                    {UI_TEXT.BOOK_DETAIL.VIEW_ALL}
                    <MaterialIcon name="arrow_forward" className="ml-1 text-[18px]" />
                </Link>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                {books.map((book, index) => (
                    <Link
                        key={book.id}
                        href={`/sach/${book.id}`}
                        className={`group cursor-pointer rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-2 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-slate-800 ${
                            index === 3 ? "hidden md:block" : ""
                        } ${index === 4 ? "hidden lg:block" : ""}`}
                    >
                        <div className="relative mb-2 aspect-[2/3] overflow-hidden rounded-sm">
                            {book.coverImage ? (
                                <Image
                                    src={book.coverImage}
                                    alt={`Book Cover: ${book.title}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary-container transition-transform duration-300 group-hover:scale-105">
                                    <MaterialIcon name="menu_book" className="text-[40px] text-on-primary-container" />
                                </div>
                            )}
                        </div>
                        <h4 className="line-clamp-1 font-title-md text-body-sm font-semibold text-on-surface transition-colors duration-200 dark:text-white">
                            {book.title}
                        </h4>
                        <p className="mb-1 line-clamp-1 font-body-sm text-[12px] text-on-surface-variant transition-colors duration-200 dark:text-slate-400">
                            {book.authors?.map(a => a.name).join(", ") || "Đang cập nhật"}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
