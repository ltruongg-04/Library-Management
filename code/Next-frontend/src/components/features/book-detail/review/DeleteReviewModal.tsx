import { REVIEW } from "@/constants/ui-text/review";
import ReviewModal from "./ReviewModal";

interface DeleteReviewModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteReviewModal({ open, onClose, onConfirm }: DeleteReviewModalProps) {
    return (
        <ReviewModal open={open} title={REVIEW.DELETE_DIALOG.TITLE} onClose={onClose}>
            {REVIEW.DELETE_MY_REVIEW}
            <div className="mt-4 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                    {REVIEW.HUY_DELETE_REVIEW}
                </button>
                <button type="button" onClick={onConfirm} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                    {REVIEW.DELETE_REVIEW}
                </button>
            </div>
        </ReviewModal>
    );
}
