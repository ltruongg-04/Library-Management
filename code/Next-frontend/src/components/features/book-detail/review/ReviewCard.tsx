import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import { REVIEW } from "@/constants/ui-text/review";
import { useAuth } from "@/providers/auth";

export interface Review {
    id: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewCardProps {
    review: Review;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: number) => void;
    onReport?: (review: Review) => void;
}

export default function ReviewCard({ review, onEdit, onDelete, onReport }: ReviewCardProps) {
    const { user } = useAuth();
    const isMyReview = user?.id ? Number(user.id) === review.userId : false;

    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="font-medium text-on-surface dark:text-white">{review.userName}</p>

                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const active = i < review.rating;

                        return (
                            <MaterialIcon
                                key={i}
                                name={active ? "star" : "star_outline"}
                                filled={active}
                                className={active ? "text-yellow-500" : "text-content-outline"}
                            />
                        );
                    })}
                </div>
            </div>

            <p className="mb-3 text-sm text-on-surface-variant dark:text-white/80">{review.comment}</p>

            <div className="flex items-center justify-between">
                <p className="text-content-outline text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>

                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-variant/50"
                    >
                        <MaterialIcon name="more_vert" className="text-on-surface-variant" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-32 overflow-hidden rounded-md border border-outline-variant/30 bg-surface py-1 shadow-lg dark:bg-zinc-900">
                            {isMyReview ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowMenu(false);
                                            onEdit?.(review);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm font-medium text-primary hover:bg-surface-variant/30 dark:text-primary-300"
                                    >
                                        {REVIEW.EDIT_REVIEW}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowMenu(false);
                                            onDelete?.(review.id);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm font-medium text-error-500 hover:bg-surface-variant/30"
                                    >
                                        {REVIEW.DELETE_REVIEW}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMenu(false);
                                        onReport?.(review);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm font-medium text-warning-600 hover:bg-surface-variant/30"
                                >
                                    {REVIEW.REPORT_REVIEW}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
