import { useState } from "react";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const TEXT = UI_TEXT.ADMIN_REVIEWS;

type HideReasonDialogProps = {
    isOpen: boolean;
    selectedReason: string;
    reason: string;
    onSelectedReasonChange: (value: string) => void;
    onReasonChange: (value: string) => void;
    onConfirm: () => void;
    onClose: () => void;
};

export default function HideReasonDialog({
    isOpen,
    selectedReason,
    reason,
    onSelectedReasonChange,
    onReasonChange,
    onConfirm,
    onClose,
}: HideReasonDialogProps) {
    const [isReasonMenuOpen, setIsReasonMenuOpen] = useState(false);

    if (!isOpen) {
        return null;
    }

    const isCustomReason = selectedReason === TEXT.CUSTOM_HIDE_REASON;
    const reasonOptions = [...TEXT.HIDE_REASON_OPTIONS, TEXT.CUSTOM_HIDE_REASON];
    const handleClose = () => {
        setIsReasonMenuOpen(false);
        onClose();
    };
    const handleConfirm = () => {
        setIsReasonMenuOpen(false);
        onConfirm();
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-md backdrop-blur-sm" role="presentation">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="hide-review-dialog-title"
                className="w-full max-w-[520px] rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-lg shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            >
                <div className="mb-md flex items-start justify-between gap-md">
                    <div>
                        <h2 id="hide-review-dialog-title" className="text-title-md font-semibold text-on-surface dark:text-white">
                            {TEXT.HIDE_REASON_LABEL}
                        </h2>
                        <p className="mt-xs text-body-sm text-on-surface-variant dark:text-slate-300">{TEXT.HIDE_REASON_DIALOG_DESCRIPTION}</p>
                    </div>
                    <button
                        type="button"
                        aria-label={TEXT.CANCEL}
                        onClick={handleClose}
                        className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container"
                    >
                        <X size={18} strokeWidth={1.9} />
                    </button>
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsReasonMenuOpen((current) => !current)}
                        aria-expanded={isReasonMenuOpen}
                        className={`focus-ring flex h-12 w-full items-center justify-between rounded-lg border bg-surface-container-low px-md text-body-md font-semibold text-on-surface transition-colors dark:bg-slate-900 dark:text-white ${
                            isReasonMenuOpen ? "border-primary ring-2 ring-primary/15" : "border-primary/45 hover:border-primary dark:border-primary/60"
                        }`}
                    >
                        <span className="inline-flex min-w-0 items-center gap-sm">
                            <Filter size={20} strokeWidth={1.9} className="shrink-0 text-primary" />
                            <span className="truncate">{selectedReason}</span>
                        </span>
                        <ChevronDown
                            size={18}
                            strokeWidth={1.9}
                            className={`shrink-0 text-on-surface-variant transition-transform ${isReasonMenuOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {isReasonMenuOpen ? (
                        <div className="absolute left-0 right-0 z-20 mt-xs rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-xs shadow-xl dark:border-slate-800 dark:bg-slate-950">
                            {reasonOptions.map((option) => {
                                const isSelected = selectedReason === option;

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            onSelectedReasonChange(option);
                                            setIsReasonMenuOpen(false);
                                        }}
                                        className={`flex h-10 w-full items-center justify-between rounded-md px-sm text-left text-body-md transition-colors ${
                                            isSelected
                                                ? "bg-primary font-semibold text-on-primary"
                                                : "text-on-surface hover:bg-surface-container dark:text-slate-200 dark:hover:bg-slate-900"
                                        }`}
                                    >
                                        <span className="truncate">{option}</span>
                                        {isSelected ? <Check size={17} strokeWidth={1.9} className="shrink-0 text-on-primary" /> : null}
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}
                </div>

                {isCustomReason ? (
                    <label className="mt-md flex flex-col gap-xs">
                        <span className="text-body-sm font-semibold text-on-surface dark:text-white">{TEXT.HIDE_REASON_LABEL}</span>
                        <input
                            type="text"
                            value={reason}
                            onChange={(event) => onReasonChange(event.target.value)}
                            placeholder={TEXT.HIDE_REASON_PLACEHOLDER}
                            className="h-11 w-full rounded-lg border border-outline-variant/50 bg-surface-container-low px-md text-body-md text-on-surface outline-none transition-shadow placeholder:text-outline focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
                        />
                    </label>
                ) : null}

                <div className="mt-lg flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="focus-ring inline-flex h-11 items-center justify-center rounded-lg border border-outline-variant/40 px-md text-body-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
                    >
                        {TEXT.CANCEL}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="focus-ring inline-flex h-11 items-center justify-center gap-xs rounded-lg bg-primary px-md text-body-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
                    >
                        <Check size={17} strokeWidth={2} />
                        {TEXT.CONFIRM}
                    </button>
                </div>
            </section>
        </div>
    );
}
