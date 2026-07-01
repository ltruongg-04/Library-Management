import { CheckCircle2, X } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import type { SubmitStatus } from "@/types/book-visit";
import { getToastMessage } from "@/utils/book-visit";

type BookVisitToastProps = {
    status: SubmitStatus;
    onClose: () => void;
};

export function BookVisitToast({ status, onClose }: BookVisitToastProps) {
    if (status === "idle") return null;

    const toastIconColor = status === "error" ? "text-error" : status === "warning" ? "text-warning-600" : "text-secondary";

    return (
        <div className="fixed right-4 top-24 z-50 w-[min(360px,calc(100vw-32px))] rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_12px_32px_rgba(0,0,0,0.14)] dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
                <CheckCircle2 size={22} className={`mt-0.5 shrink-0 ${toastIconColor}`} />
                <p className="flex-1 font-body-sm text-body-sm text-on-surface dark:text-white">{getToastMessage(status)}</p>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-container dark:text-slate-300 dark:hover:bg-slate-800"
                    aria-label={UI_TEXT.BOOK_VISIT.FORM.CLOSE_TOAST}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
