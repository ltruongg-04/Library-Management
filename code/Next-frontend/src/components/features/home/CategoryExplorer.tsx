"use client";

import { useEffect, useState } from "react";
import { BookMarked, Code2, Globe2, HeartHandshake, History, Lightbulb, Palette, TrendingUp } from "lucide-react";
import Link from "next/link";
import { UI_TEXT } from "@/constants/ui-text";
import { categoryService } from "@/services/category";
import type { Category } from "@/types/category";

const CATEGORY_ICON_LIST = [
    <Code2 key="code" className="text-blue-500" size={24} />,
    <TrendingUp key="trending" className="text-emerald-500" size={24} />,
    <History key="history" className="text-amber-500" size={24} />,
    <BookMarked key="book" className="text-rose-500" size={24} />,
    <Palette key="palette" className="text-purple-500" size={24} />,
    <Lightbulb key="lightbulb" className="text-yellow-500" size={24} />,
    <Globe2 key="globe" className="text-cyan-500" size={24} />,
    <HeartHandshake key="heart" className="text-indigo-500" size={24} />,
];

function getCategoryIconByIndex(index: number) {
    return CATEGORY_ICON_LIST[index % CATEGORY_ICON_LIST.length];
}

export default function CategoryExplorer() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data.slice(0, 8)); // Top 8 categories
            } catch {
                // Silently fallback if category fetch fails
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (isLoading && categories.length === 0) return null;

    return (
        <section className="mx-auto my-12 max-w-[1440px] px-4 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-on-surface dark:text-white md:text-3xl">
                        {UI_TEXT.HOME.CATEGORY_EXPLORER.TITLE}
                    </h2>
                    <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">{UI_TEXT.HOME.CATEGORY_EXPLORER.SUBTITLE}</p>
                </div>
                <Link href="/sach" className="hidden text-sm font-semibold text-primary transition-colors hover:underline sm:inline-block">
                    {UI_TEXT.HOME.CATEGORY_EXPLORER.VIEW_ALL} →
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {categories.map((category, index) => (
                    <Link
                        key={category.id}
                        href={`/sach?category=${encodeURIComponent(category.name)}`}
                        className="group flex items-center gap-3.5 rounded-xl border border-outline-variant/30 bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-surface-variant/50 transition-colors group-hover:bg-primary/10 dark:bg-slate-800">
                            {getCategoryIconByIndex(index)}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="line-clamp-1 font-semibold text-on-surface transition-colors group-hover:text-primary dark:text-white">
                                {category.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-on-surface-variant dark:text-slate-400">{UI_TEXT.HOME.CATEGORY_EXPLORER.EXPLORE_NOW}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
