"use client";

import { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";
import { bookService } from "@/services/book";
import type { BookListItem } from "@/types/book";

export default function HeroSection() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState<BookListItem[]>([]);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await bookService.getTrendingBooks(3);
                if (res.content && res.content.length > 0) {
                    setBooks(res.content);
                }
            } catch {
                // Silently fallback if error
            }
        };
        fetchTrending();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/sach?keyword=${encodeURIComponent(query.trim())}`);
        } else {
            router.push("/sach");
        }
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-surface to-surface pb-8 pt-6 transition-colors duration-200 dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950 lg:pb-10 lg:pt-8">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px] dark:bg-primary/20" />
            <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-[110px] dark:bg-indigo-500/15" />

            <div className="relative z-10 mx-auto max-w-[1440px] px-4 lg:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-12">
                    {/* ── Left Column: Headline & Floating Search (7 cols) ── */}
                    <div className="flex flex-col lg:col-span-7">
                        {/* Status Badge */}
                        <div className="dark:text-primary-foreground mb-2.5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm dark:border-primary/30 dark:bg-primary/20">
                            <Sparkles size={13} className="animate-pulse" />
                            <span>{UI_TEXT.HOME.LABEL_AI_POWERED}</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface dark:text-white sm:text-3xl md:text-4xl lg:leading-[1.15]">
                            {UI_TEXT.HOME.HERO_HEADING}
                        </h1>

                        <p className="mt-2 max-w-xl text-sm text-on-surface-variant dark:text-slate-300 sm:text-base">{UI_TEXT.HOME.HERO_SUBHEADING}</p>

                        {/* Modern Floating Search Bar */}
                        <form onSubmit={handleSearch} className="mt-5 max-w-lg">
                            <div className="group relative flex items-center rounded-2xl border border-outline-variant/40 bg-surface p-1 shadow-md shadow-primary/5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/40">
                                <Search
                                    className="ml-3 text-on-surface-variant/60 transition-colors group-focus-within:text-primary dark:text-slate-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    className="flex-1 border-none bg-transparent px-3 py-1.5 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:ring-0 dark:text-white dark:placeholder:text-slate-500 sm:text-base"
                                    placeholder={UI_TEXT.HOME.SEARCH_PLACEHOLDER}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95"
                                >
                                    <span>{UI_TEXT.HOME.SEARCH_BTN}</span>
                                </button>
                            </div>
                        </form>

                        {/* Quick Tags */}
                        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-medium text-on-surface-variant dark:text-slate-400">{UI_TEXT.HOME.TRENDING_LABEL}</span>
                            {UI_TEXT.HOME.HERO_TAGS.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/sach?keyword=${encodeURIComponent(tag)}`}
                                    className="rounded-full border border-outline-variant/30 bg-surface-container-low px-2.5 py-0.5 text-xs font-medium text-on-surface transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary/50"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ── Right Column: 3D Floating Book Stack (5 cols) ── */}
                    <div className="relative flex items-center justify-center lg:col-span-5">
                        <div className="relative flex h-[290px] w-full max-w-[340px] items-center justify-center sm:h-[330px]">
                            {/* Decorative ambient background circular pedestal */}
                            <div className="absolute inset-0 m-auto h-56 w-56 rounded-full bg-gradient-to-tr from-primary/20 via-indigo-500/20 to-sky-400/20 blur-xl dark:from-primary/30 dark:to-indigo-600/30" />

                            {/* 3D Stacked Book Covers */}
                            {/* Book 1 (Background Left - Tilted) */}
                            <div className="absolute left-3 top-5 z-10 h-52 w-36 -rotate-12 transform rounded-xl shadow-xl transition-all duration-300 hover:rotate-0 hover:scale-105 sm:h-56 sm:w-40">
                                <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/20 bg-slate-800 shadow-xl">
                                    {books[1]?.imageUrl ? (
                                        <Image src={books[1].imageUrl} alt={books[1].title || "Book"} fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-indigo-700 to-purple-900 p-3 text-white">
                                            <p className="line-clamp-2 text-xs font-bold">{books[1]?.title || UI_TEXT.HOME.HERO_BOOK_FALLBACK_1}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Book 2 (Background Right - Tilted opposite) */}
                            <div className="absolute right-3 top-7 z-10 h-52 w-36 rotate-12 transform rounded-xl shadow-xl transition-all duration-300 hover:rotate-0 hover:scale-105 sm:h-56 sm:w-40">
                                <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/20 bg-slate-800 shadow-xl">
                                    {books[2]?.imageUrl ? (
                                        <Image src={books[2].imageUrl} alt={books[2].title || "Book"} fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-amber-700 to-rose-900 p-3 text-white">
                                            <p className="line-clamp-2 text-xs font-bold">{books[2]?.title || UI_TEXT.HOME.HERO_BOOK_FALLBACK_2}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Book 3 (Center - Front & Spotlight) */}
                            <div className="sm:h-68 relative z-20 h-60 w-40 transform rounded-xl shadow-2xl shadow-black/40 transition-all duration-300 hover:scale-105 sm:w-44">
                                <div className="relative h-full w-full overflow-hidden rounded-xl border-2 border-white/40 bg-slate-900 shadow-2xl dark:border-slate-700">
                                    {books[0]?.imageUrl ? (
                                        <Image
                                            src={books[0].imageUrl}
                                            alt={books[0].title || "Featured Book"}
                                            fill
                                            className="object-cover"
                                            priority
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="from-primary-800 flex h-full w-full flex-col justify-between bg-gradient-to-br via-primary-700 to-indigo-900 p-4 text-white">
                                            <span className="w-fit rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur">
                                                {UI_TEXT.HOME.HERO_SPOTLIGHT}
                                            </span>
                                            <div>
                                                <h3 className="line-clamp-2 text-xs font-bold sm:text-sm">
                                                    {books[0]?.title || UI_TEXT.HOME.HERO_BOOK_FALLBACK_3}
                                                </h3>
                                                <p className="mt-0.5 text-[11px] text-white/80">
                                                    {books[0]?.authors?.map((a) => a.name).join(", ") || UI_TEXT.HOME.HERO_AUTHOR_FALLBACK}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
