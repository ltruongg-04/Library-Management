import { UI_TEXT } from "@/constants/ui-text";
import type { Book } from "@/types/book";
import type { SubmitStatus } from "@/types/book-visit";

export function getSelectedBookTitle({ book, loading }: { book?: Book | null; loading: boolean }) {
    if (loading) return UI_TEXT.BOOK_VISIT.INFO.BOOK_LOADING;

    return book?.title || UI_TEXT.BOOK_VISIT.INFO.BOOK_FALLBACK;
}

export function getToastMessage(status: SubmitStatus) {
    if (status === "sending") return UI_TEXT.BOOK_VISIT.FORM.TOAST_SENDING;
    if (status === "success") return UI_TEXT.BOOK_VISIT.FORM.TOAST_SUCCESS;
    if (status === "warning") return UI_TEXT.BOOK_VISIT.FORM.TOAST_EMAIL_NOT_CONFIGURED;
    if (status === "error") return UI_TEXT.BOOK_VISIT.FORM.TOAST_ERROR;

    return "";
}
