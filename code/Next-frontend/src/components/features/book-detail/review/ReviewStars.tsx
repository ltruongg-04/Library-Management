"use client";

import { MaterialIcon } from "@/components/base/material-icon";
import type { ReviewStarsProps } from "./types";

export default function ReviewStars({ rating, onChange, readonly = false }: ReviewStarsProps) {
    const handleClick = (value: number) => {
        if (readonly || !onChange) return;
        onChange(value);
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= rating;

                return (
                    <button key={star} type="button" onClick={() => handleClick(star)} disabled={readonly} aria-label={`Rate ${star} star`} className="p-1">
                        <MaterialIcon name="star" filled={active} className={active ? "text-yellow-500" : "text-content-outline"} />
                    </button>
                );
            })}
        </div>
    );
}
