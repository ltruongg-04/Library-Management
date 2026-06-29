"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ADMIN_INVENTORY_MANAGEMENT } from "@/constants/ui-text/admin";
import { categoryService } from "@/services/category";
import type { Category } from "@/types/category";

export default function BookFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Local state for immediate input feedback
    const [searchTerm, setSearchTerm] = useState(searchParams?.get("keyword") || "");

    const keywordFromUrl = searchParams?.get("keyword") || "";

    // Sync searchTerm if URL changes externally (e.g., clicking Back button)
    useEffect(() => {
        setSearchTerm(keywordFromUrl);
    }, [keywordFromUrl]);

    const searchParamsString = searchParams?.toString() || "";

    // Create a new URLSearchParams object with updated values
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParamsString);
            if (value && value !== "All") {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            // Reset page to 0 when filters change
            params.set("page", "0");
            return params.toString();
        },
        [searchParamsString],
    );

    // Debounce search input
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== keywordFromUrl) {
                router.replace(`${pathname}?${createQueryString("keyword", searchTerm)}`, { scroll: false });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, keywordFromUrl, pathname, router, createQueryString]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.replace(`${pathname}?${createQueryString("category", e.target.value)}`, { scroll: false });
    };

    const currentCategory = searchParams?.get("category") || "All";

    return (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-surface-container-high bg-white p-2 shadow-sm">
            {/* Search Input */}
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-surface px-3 py-2 text-on-surface-variant focus-within:ring-2 focus-within:ring-primary-500/20">
                <Sparkles size={18} className="text-secondary-300" />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề, tác giả..."
                    className="w-full bg-transparent text-[14px] outline-none placeholder:text-outline-variant"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap items-center gap-3 pr-2">
                {/* Category Dropdown */}
                <div className="relative">
                    <select
                        className="flex appearance-none items-center gap-2 rounded-lg border border-surface-container-high bg-transparent py-1.5 pl-3 pr-8 text-[14px] font-medium text-on-surface hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50"
                        value={currentCategory}
                        onChange={handleCategoryChange}
                        disabled={loadingCategories}
                    >
                        <option value="All">{ADMIN_INVENTORY_MANAGEMENT.FILTERS.CATEGORY_ALL}</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline" />
                </div>
            </div>
        </div>
    );
}
