import { MaterialIcon } from "@/components/base/material-icon";
import { REVIEW } from "@/constants/ui-text/review";
import ReviewModal from "./ReviewModal";

interface SuccessReviewModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export default function SuccessReviewModal({
    open,
    onClose,
    title = REVIEW.REPORT_SUCCESS_DIALOG.TITLE,
    description = REVIEW.REPORT_SUCCESS_DIALOG.DESCRIPTION,
}: SuccessReviewModalProps) {
    return (
        <ReviewModal open={open} title={title} onClose={onClose}>
            <div className="flex flex-col items-center py-4">
                <MaterialIcon name="check_circle" filled className="text-success mb-4 text-[64px]" />

                <p className="mb-6 whitespace-pre-line text-center text-on-surface-variant">{description}</p>

                <button type="button" onClick={onClose} className="rounded-lg bg-primary px-8 py-2 text-white transition hover:opacity-90">
                    {REVIEW.REPORT_SUCCESS_DIALOG.CLOSE_BUTTON}
                </button>
            </div>
        </ReviewModal>
    );
}
