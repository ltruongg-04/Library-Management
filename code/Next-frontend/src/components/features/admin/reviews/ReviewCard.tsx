import { BookOpen, Eye, EyeOff, Flag, RotateCcw, Star, Trash2 } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import type { Review, ReviewAccent, ReviewStatus } from "@/types/admin-review";

const TEXT = UI_TEXT.ADMIN_REVIEWS;
const STAR_COUNT = 5;

const accentClasses: Record<ReviewAccent, string> = {
    primary: "bg-primary-fixed text-on-primary-fixed",
    secondary: "bg-secondary-fixed text-on-secondary-fixed",
    warning: "bg-error-container text-on-error-container",
    muted: "bg-surface-container-high text-on-surface-variant",
};

const cardStateClasses: Record<ReviewStatus, string> = {
    reported: "border-error/55 bg-error-container/10 shadow-[0_12px_36px_rgba(186,26,26,0.08)]",
    visible: "border-outline-variant/20 bg-surface-container-lowest shadow-[0_4px_16px_rgba(17,22,36,0.06)]",
    hidden: "border-outline-variant/60 bg-surface-container-lowest shadow-[0_4px_16px_rgba(17,22,36,0.05)]",
};

type ReviewCardProps = {
    review: Review;
    onRequestHide: () => void;
    onRestore: () => void;
    onDelete: () => void;
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex shrink-0 items-center gap-0.5" aria-label={`${rating}/${STAR_COUNT}`}>
            {Array.from({ length: STAR_COUNT }, (_, index) => {
                const isFilled = index < rating;

                return (
                    <Star
                        key={index}
                        size={18}
                        strokeWidth={1.7}
                        className={isFilled ? "fill-warning-500 text-warning-500" : "fill-transparent text-warning-500"}
                    />
                );
            })}
        </div>
    );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
    if (status === "reported") {
        return (
            <span className="inline-flex shrink-0 items-center gap-xs whitespace-nowrap rounded-full bg-error px-3 py-1 text-body-sm font-semibold text-on-error shadow-sm">
                <Flag size={15} strokeWidth={1.8} />
                {TEXT.STATUS.REPORTED}
            </span>
        );
    }

    if (status === "hidden") {
        return (
            <span className="inline-flex shrink-0 items-center gap-xs whitespace-nowrap rounded-full bg-surface-container-high px-3 py-1 text-body-sm font-medium text-on-surface-variant">
                <EyeOff size={15} strokeWidth={1.8} />
                {TEXT.STATUS.HIDDEN}
            </span>
        );
    }

    return (
        <span className="inline-flex shrink-0 items-center gap-xs whitespace-nowrap rounded-full bg-secondary-fixed px-3 py-1 text-body-sm font-medium text-on-secondary-fixed">
            <Eye size={15} strokeWidth={1.8} />
            {TEXT.STATUS.VISIBLE}
        </span>
    );
}

export default function ReviewCard({ review, onRequestHide, onRestore, onDelete }: ReviewCardProps) {
    const isHidden = review.status === "hidden";

    return (
        <article className={`relative rounded-lg border transition-colors dark:bg-slate-950 ${cardStateClasses[review.status]}`}>
            <div className="p-md sm:p-lg">
                <div className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-md">
                        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full font-semibold ${accentClasses[review.accent]}`}>
                            {review.reviewerInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:gap-sm">
                                <h2 className="min-w-0 text-title-md font-semibold leading-6 text-on-surface dark:text-white">{review.reviewerName}</h2>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="mt-0.5 text-body-sm text-on-surface-variant dark:text-slate-300">{review.createdAt}</p>
                            <p className="mt-xs inline-flex items-center gap-xs text-[13px] text-on-surface-variant dark:text-slate-300">
                                <BookOpen size={14} strokeWidth={1.8} />
                                {review.bookTitle}
                            </p>
                        </div>
                    </div>

                    <StatusBadge status={review.status} />
                </div>

                <p className={`mt-md text-body-md text-on-surface dark:text-slate-100 ${isHidden ? "opacity-60" : ""}`}>{review.content}</p>

                {isHidden ? (
                    <div className="mt-md inline-flex max-w-full items-center gap-xs rounded-full bg-surface-container px-md py-sm text-body-sm text-on-surface-variant dark:bg-slate-900 dark:text-slate-300">
                        <EyeOff size={15} strokeWidth={1.8} />
                        <span className="truncate">
                            {TEXT.HIDDEN_BY_ADMIN} - {TEXT.REASON}: {review.hideReason}
                        </span>
                    </div>
                ) : null}

                <div className="mt-lg grid grid-cols-2 gap-sm">
                    {isHidden ? (
                        <button
                            type="button"
                            onClick={onRestore}
                            className="focus-ring inline-flex h-10 items-center justify-center gap-sm rounded-lg bg-primary px-md text-body-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
                        >
                            <RotateCcw size={17} strokeWidth={1.8} />
                            {TEXT.RESTORE}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onRequestHide}
                            className="focus-ring inline-flex h-10 items-center justify-center gap-sm rounded-lg bg-primary px-md text-body-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
                        >
                            <EyeOff size={17} strokeWidth={1.8} />
                            {TEXT.HIDE}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onDelete}
                        className="focus-ring inline-flex h-10 items-center justify-center gap-sm rounded-lg border border-error/20 px-md text-body-md font-semibold text-error transition-colors hover:bg-error-50"
                    >
                        <Trash2 size={17} strokeWidth={1.8} />
                        {TEXT.DELETE}
                    </button>
                </div>
            </div>
        </article>
    );
}
