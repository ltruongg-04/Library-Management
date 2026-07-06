"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { API_ERRORS, API_SUCCESS } from "@/constants/ui-text/shared/api";
import { useAuth } from "@/providers/auth";
import { favoriteService } from "@/services/favorite";
import { reservationService } from "@/services/reservation";
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
    const [isReserving, setIsReserving] = useState(false);
    const [userReservationId, setUserReservationId] = useState<number | null>(null);

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
        const checkReservationStatus = async () => {
            if (isAuthenticated && book.id && !isAvailable) {
                try {
                    const res = await reservationService.getMyReservations(0, 100);
                    const pendingReservation = res.content.find((r) => r.bookId === book.id && r.status === "PENDING");
                    if (pendingReservation) {
                        setUserReservationId(pendingReservation.id);
                    } else {
                        setUserReservationId(null);
                    }
                } catch (error) {
                    console.error("Failed to check reservation status", error);
                }
            }
        };
        checkFavoriteStatus();
        checkReservationStatus();
    }, [book.id, isAuthenticated, isAvailable]);

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        setIsLoadingFavorite(true);
        try {
            if (isFavorite) {
                await favoriteService.removeFavorite(book.id);
                setIsFavorite(false);
                toast.success(API_SUCCESS.FAVORITE_REMOVE_SUCCESS);
            } else {
                await favoriteService.addFavorite(book.id);
                setIsFavorite(true);
                toast.success(API_SUCCESS.FAVORITE_ADD_SUCCESS);
            }
        } catch (error) {
            console.error("Failed to toggle favorite", error);
            toast.error(API_ERRORS.GENERIC_ERROR);
        } finally {
            setIsLoadingFavorite(false);
        }
    };

    const handleReserve = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        setIsReserving(true);
        try {
            const res = await reservationService.createReservation(book.id);
            setUserReservationId(res.id);
            toast.success(UI_TEXT.BOOK_DETAIL.RESERVE_SUCCESS.replace("{position}", res.queuePosition.toString()));
        } catch (error: any) {
            console.error("Failed to reserve book", error);
            const msg = error.response?.data?.message || UI_TEXT.BOOK_DETAIL.RESERVE_ERROR;
            toast.error(msg);
        } finally {
            setIsReserving(false);
        }
    };

    const handleCancelReservation = async () => {
        if (!userReservationId) return;
        setIsReserving(true);
        try {
            await reservationService.cancelReservation(userReservationId);
            setUserReservationId(null);
            toast.success(API_SUCCESS.HOLD_CANCEL_SUCCESS);
        } catch (error: any) {
            console.error("Failed to cancel reservation", error);
            const msg = error.response?.data?.message || API_ERRORS.HOLD_CANCEL_FAILED;
            toast.error(msg);
        } finally {
            setIsReserving(false);
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
                {isAvailable ? (
                    <button
                        onClick={() => router.push(`/sach/${book.id}/muon`)}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-label-caps text-label-caps text-on-primary shadow-sm transition-colors duration-200 hover:bg-on-primary-fixed-variant active:scale-95 dark:bg-primary-500"
                    >
                        <MaterialIcon name="book" />
                        {UI_TEXT.BOOK_DETAIL.BORROW_NOW}
                    </button>
                ) : userReservationId ? (
                    <button
                        onClick={handleCancelReservation}
                        disabled={isReserving}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-error px-4 py-2 font-label-caps text-label-caps text-on-error shadow-sm transition-colors duration-200 hover:bg-error-container hover:text-on-error-container active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-error-500"
                    >
                        <MaterialIcon name="cancel" />
                        {UI_TEXT.MY_BOOKS_PAGE.CARD.CANCEL_RESERVATION}
                    </button>
                ) : (
                    <button
                        onClick={handleReserve}
                        disabled={isReserving}
                        className="hover:bg-secondary-fixed-variant flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 font-label-caps text-label-caps text-on-secondary shadow-sm transition-colors duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-secondary-500"
                    >
                        <MaterialIcon name="event_available" />
                        {UI_TEXT.BOOK_DETAIL.RESERVE_NOW}
                    </button>
                )}
                <button
                    onClick={handleToggleFavorite}
                    disabled={isLoadingFavorite}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 font-label-caps text-label-caps transition-colors duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${isFavorite ? "border-primary bg-primary/10 text-primary hover:bg-primary/20" : "border-secondary bg-transparent text-secondary hover:bg-secondary/10 dark:border-white dark:text-white dark:hover:bg-white/10"}`}
                >
                    <MaterialIcon name={isFavorite ? "bookmark_added" : "bookmark_add"} />
                    {isFavorite ? UI_TEXT.BOOK_DETAIL.REMOVE_WISHLIST : UI_TEXT.BOOK_DETAIL.ADD_WISHLIST}
                </button>
                <button
                    type="button"
                    onClick={() => router.push(`/sach/${book.id}/doc-tai-thu-vien`)}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-secondary bg-transparent px-4 py-2 font-label-caps text-label-caps text-secondary transition-colors duration-200 hover:bg-secondary/10 active:scale-95 dark:border-white dark:text-white dark:hover:bg-white/10"
                >
                    <MaterialIcon name="local_library" />
                    {UI_TEXT.BOOK_DETAIL.READ_AT_LIBRARY}
                </button>
            </div>
        </div>
    );
}
