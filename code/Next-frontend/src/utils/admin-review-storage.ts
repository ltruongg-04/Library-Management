import { UI_TEXT } from "@/constants/ui-text";
import type { Review } from "@/types/admin-review";

export const STORAGE_KEY = "lumina_admin_reviews_state";

export function createInitialReviews() {
    return UI_TEXT.ADMIN_REVIEWS.SAMPLE_REVIEWS.map((review) => ({ ...review })) as Review[];
}

export function readSavedReviews() {
    if (typeof window === "undefined") {
        return createInitialReviews();
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return createInitialReviews();
    }

    try {
        return JSON.parse(saved) as Review[];
    } catch {
        return createInitialReviews();
    }
}
