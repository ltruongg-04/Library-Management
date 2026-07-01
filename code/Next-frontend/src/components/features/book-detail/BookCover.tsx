"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { useAuth } from "@/providers/auth";
import { favoriteService } from "@/services/favorite";
import type { BookDetail } from "@/types/book";

interface BookCoverProps {
    book: BookDetail;
}

export default function BookCover({ book }: BookCoverProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const isAvailable = book.availableCount > 0;
    const hasCoverImage = book.coverImage && book.coverImage.length > 0;

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (isAuthenticated && book.id) {
                try {
                    const status = await favoriteService.checkFavorite(book.id);
                    setIsFavorite(status);
                } catch (error) {
                    console.error("Failed to check favorite status", error);
                }
            }
        };
        checkFavoriteStatus();
    }, [book.id, isAuthenticated]);

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            router.push("/dang-nhap");
            return;
        }

        setIsLoadingFavorite(true);
        try {
            if (isFavorite) {
                await favoriteService.removeFavorite(book.id);
                setIsFavorite(false);
                toast.success(UI_TEXT.COMMON.SUCCESS_REMOVED_WISHLIST || "Đã xóa khỏi danh sách yêu thích");
            } else {
                await favoriteService.addFavorite(book.id);
                setIsFavorite(true);
                toast.success(UI_TEXT.COMMON.SUCCESS_ADDED_WISHLIST || "Đã thêm vào danh sách yêu thích");
            }
        } catch (error) {
            console.error("Failed to toggle favorite", error);
            toast.error(UI_TEXT.COMMON.ERROR_OCCURRED || "Đã có lỗi xảy ra");
        } finally {
            setIsLoadingFavorite(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Cover Image */}
            <div className="relative overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900">
                {hasCoverImage ? (
                    <Image
                        src={book.coverImage}
                        alt={`Book Cover: ${book.title}`}
                        width={400}
                        height={600}
                        className="aspect-[2/3] h-auto w-full rounded-t-sm object-cover"
                        priority
                        unoptimized
                    />
                ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center bg-primary-container">
                        <MaterialIcon name="menu_book" className="text-[80px] text-on-primary-container" />
                    </div>
                )}

                {/* AI Match Score Badge */}
                {book.aiMatchScore && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest/90 px-2 py-1 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
                        <MaterialIcon name="temp_preferences_custom" className="text-[14px] text-secondary dark:text-white" />
                        <span className="font-label-caps text-label-caps font-bold text-secondary dark:text-white">
                            {book.aiMatchScore}
                            {UI_TEXT.BOOK_DETAIL.MATCH_SCORE_SUFFIX}
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-2 flex flex-col gap-2">
                <button
                    onClick={() => router.push(`/sach/${book.id}/muon`)}
                    disabled={!isAvailable}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-label-caps text-label-caps text-on-primary shadow-sm transition-colors duration-200 hover:bg-on-primary-fixed-variant active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500"
                >
                    <MaterialIcon name="book" />
                    {UI_TEXT.BOOK_DETAIL.BORROW_NOW}
                </button>
                <button
                    onClick={handleToggleFavorite}
                    disabled={isLoadingFavorite}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 font-label-caps text-label-caps transition-colors duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${isFavorite ? "border-primary bg-primary/10 text-primary hover:bg-primary/20" : "border-secondary bg-transparent text-secondary hover:bg-secondary/10 dark:border-white dark:text-white dark:hover:bg-white/10"}`}
                >
                    <MaterialIcon name={isFavorite ? "bookmark_added" : "bookmark_add"} />
                    {isFavorite ? UI_TEXT.BOOK_DETAIL.REMOVE_WISHLIST : UI_TEXT.BOOK_DETAIL.ADD_WISHLIST}
                </button>
            </div>
        </div>
    );
}
