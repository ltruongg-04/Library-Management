import { MaterialIcon } from "@/components/base/material-icon";
import { REVIEW } from "@/constants/ui-text/review";
import ReviewModal from "./ReviewModal";

interface SuccessReviewModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SuccessReviewModal({ open, onClose }: SuccessReviewModalProps) {
    return (
        <ReviewModal open={open} title={REVIEW.SUCCESS_DIALOG.TITLE} onClose={onClose}>
            <div className="flex flex-col items-center py-4">
                <MaterialIcon name="check_circle" filled className="text-success mb-4 text-[64px]" />

                <p className="mb-6 whitespace-pre-line text-center text-on-surface-variant">{REVIEW.SUCCESS_DIALOG.DESCRIPTION}</p>

                <button type="button" onClick={onClose} className="rounded-lg bg-primary px-8 py-2 text-white transition hover:opacity-90">
                    {REVIEW.SUCCESS_DIALOG.CLOSE_BUTTON}
                </button>
            </div>
        </ReviewModal>
    );
}
