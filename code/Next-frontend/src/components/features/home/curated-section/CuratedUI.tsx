"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { useAuth } from "@/providers/auth";
import { favoriteService } from "@/services/favorite";
import type { Book } from "@/types/book";

export function useFadeInOnScroll() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.08 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, visible };
}

export function BookThumbnails({ books }: { books: Book[] }) {
    const shown = books.slice(0, 4);
    const rest = books.length - shown.length;

    return (
        <div className="mt-4 flex items-center -space-x-2">
            {shown.map((book) =>
                book.imageUrl ? (
                    <div
                        key={book.id}
                        className="relative h-9 w-7 flex-shrink-0 overflow-hidden rounded border-2 border-surface-container-lowest shadow-sm dark:border-slate-900"
                    >
                        <Image src={book.imageUrl} alt={book.title} fill className="object-cover" unoptimized />
                    </div>
                ) : (
                    <div
                        key={book.id}
                        className="flex h-9 w-7 flex-shrink-0 items-center justify-center rounded border-2 border-surface-container-lowest bg-primary-container shadow-sm dark:border-slate-900 dark:bg-slate-700"
                    >
                        <MaterialIcon name="menu_book" className="text-[12px] text-on-primary-container dark:text-white" />
                    </div>
                ),
            )}
            {rest > 0 && (
                <div className="flex h-9 w-7 flex-shrink-0 items-center justify-center rounded border-2 border-surface-container-lowest bg-outline-variant font-mono text-[10px] font-bold text-on-surface shadow-sm dark:border-slate-900 dark:bg-slate-700 dark:text-white">
                    +{rest}
                </div>
            )}
        </div>
    );
}

export function WishlistButton({ book }: { book: Book }) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [wishlisted, setWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            favoriteService
                .checkFavorite(book.id)
                .then((isFav) => setWishlisted(isFav))
                .catch(() => {});
        } else {
            setWishlisted(false);
        }
    }, [isAuthenticated, book.id]);

    const toggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push("/dang-nhap");
            return;
        }

        setLoading(true);
        try {
            if (wishlisted) {
                await favoriteService.removeFavorite(book.id);
                setWishlisted(false);
                toast.success(UI_TEXT.HOME.CURATED_SECTION.WISHLIST_REMOVED);
            } else {
                await favoriteService.addFavorite(book.id);
                setWishlisted(true);
                toast.success(UI_TEXT.HOME.CURATED_SECTION.WISHLIST_ADDED, {
                    action: {
                        label: "Xem danh sách",
                        onClick: () => router.push("/sach-cua-toi"),
                    },
                });
            }
        } catch (err: any) {
            toast.error(err.message || "Không thể cập nhật danh sách yêu thích");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                wishlisted
                    ? "hover:bg-primary-800 dark:border-primary-600 dark:bg-primary-600 border-primary-700 bg-primary-700 text-white dark:hover:bg-primary-700"
                    : "border-primary-700 bg-transparent text-primary-700 hover:bg-primary-50 dark:border-white/70 dark:text-white dark:hover:bg-white/10"
            } active:scale-[0.98] disabled:opacity-50`}
            aria-label={wishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
            <MaterialIcon name={wishlisted ? "bookmark_added" : "bookmark_add"} className="text-[20px]" />
            <span>{wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}</span>
        </button>
    );
}

export function GuestCtaBanner() {
    const router = useRouter();
    const { ref, visible } = useFadeInOnScroll();

    return (
        <div
            ref={ref}
            className={`col-span-full flex flex-col items-center gap-4 rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50/60 to-secondary-50/40 p-6 text-center transition-all duration-700 dark:border-primary-900/30 dark:from-primary-900/20 dark:to-slate-900/50 sm:flex-row sm:text-left ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
        >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-700/10 dark:bg-white/10">
                <MaterialIcon name="auto_awesome" className="text-[24px] text-primary-700 dark:text-white" />
            </div>
            <div className="flex-grow">
                <h4 className="font-sans text-[15px] font-bold text-primary-700 dark:text-white">{UI_TEXT.HOME.CURATED_SECTION.LOGIN_CTA_TITLE}</h4>
                <p className="mt-0.5 font-sans text-[13px] text-on-surface-variant dark:text-white/60">{UI_TEXT.HOME.CURATED_SECTION.LOGIN_CTA_SUBTITLE}</p>
            </div>
            <button
                onClick={() => router.push("/dang-nhap")}
                className="ai-gradient-bg flex-shrink-0 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
            >
                {UI_TEXT.HOME.CURATED_SECTION.LOGIN_BTN}
            </button>
        </div>
    );
}
