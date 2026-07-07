import { useEffect, useState } from "react";
import { BaseTextarea } from "@/components/base/base-textarea";
import { REPORT_REASONS } from "@/constants/ui-text/report";
import { REVIEW } from "@/constants/ui-text/review";
import type { Review } from "./ReviewCard";
import ReviewModal from "./ReviewModal";

interface ReportReviewModalProps {
    open: boolean;
    reportingReview: Review | null;
    onClose: () => void;
    onSubmit: (reviewId: number | undefined, reason: string) => void;
}

export default function ReportReviewModal({ open, reportingReview, onClose, onSubmit }: ReportReviewModalProps) {
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setSelectedReason("");
            setOtherReason("");
        }
    }, [open]);

    const handleClose = () => {
        setSelectedReason("");
        setOtherReason("");
        onClose();
    };

    const handleSubmit = () => {
        const reason = selectedReason === REPORT_REASONS.OTHER ? otherReason : selectedReason;
        onSubmit(reportingReview?.id, reason);
        handleClose();
    };

    return (
        <ReviewModal open={open} title={REVIEW.REPORT_DIALOG.TITLE} onClose={handleClose}>
            <p className="mb-2 text-on-surface-variant">{REVIEW.REPORT_DIALOG.DESCRIPTION}</p>

            {reportingReview && (
                <>
                    <p className="mb-4 text-sm text-on-surface dark:text-white">
                        <strong>{reportingReview.userName}</strong>
                    </p>

                    <div className="mb-5">
                        <label htmlFor="report-reason" className="mb-2 block text-sm font-medium text-on-surface dark:text-white">
                            {REPORT_REASONS.LABEL}
                        </label>

                        <select
                            id="report-reason"
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-low p-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white"
                        >
                            <option value="">{REPORT_REASONS.PLACEHOLDER}</option>

                            {REPORT_REASONS.REASONS.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                        {selectedReason === REPORT_REASONS.OTHER && (
                            <div className="mt-4">
                                <BaseTextarea
                                    label={REPORT_REASONS.OTHER_LABEL}
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                    placeholder={REPORT_REASONS.OTHER_PLACEHOLDER}
                                    rows={4}
                                    className="mb-2 block text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white"
                                />
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="flex justify-end gap-2">
                <button type="button" onClick={handleClose} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                    {REVIEW.REPORT_DIALOG.CANCEL_BUTTON}
                </button>

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!selectedReason || (selectedReason === REPORT_REASONS.OTHER && !otherReason.trim())}
                    className={`rounded-md px-4 py-2 text-sm font-medium text-white transition ${
                        !selectedReason || (selectedReason === REPORT_REASONS.OTHER && !otherReason.trim())
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-primary hover:opacity-90"
                    }`}
                >
                    {REVIEW.REPORT_DIALOG.SUBMIT_BUTTON}
                </button>
            </div>
        </ReviewModal>
    );
}
