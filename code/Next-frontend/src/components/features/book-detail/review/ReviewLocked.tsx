import { MaterialIcon } from "@/components/base/material-icon";
import { REVIEW } from "@/constants/ui-text/review";
import type { ReviewLockedProps } from "./types";

export default function ReviewLocked({ title = REVIEW.LOCKED_TITLE, description = REVIEW.LOCKED_DESCRIPTION }: ReviewLockedProps) {
    return (
        <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-6">
            <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-surface-container p-4">
                    <MaterialIcon name="lock" className="text-[40px] text-on-surface-variant" />
                </div>

                <h3 className="mb-2 font-title-md text-title-md text-on-surface">{title}</h3>

                <p className="max-w-xl font-body-md text-body-md text-on-surface-variant">{description}</p>
            </div>
        </div>
    );
}
