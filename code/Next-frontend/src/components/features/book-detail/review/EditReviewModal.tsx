import { REVIEW } from "@/constants/ui-text/review";
import type { Review } from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import ReviewModal from "./ReviewModal";

interface EditReviewModalProps {
    open: boolean;
    editingReview: Review | null;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

export default function EditReviewModal({ open, editingReview, onClose, onSubmit }: EditReviewModalProps) {
    return (
        <ReviewModal open={open} title={REVIEW.EDIT_DIALOG.TITLE} onClose={onClose}>
            <ReviewForm review={editingReview ?? undefined} onSubmit={onSubmit} />
        </ReviewModal>
    );
}
