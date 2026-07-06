import { MaterialIcon } from "@/components/base/material-icon";

interface ReviewModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ReviewModal({ open, title, onClose, children }: ReviewModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:*:bg-black/70">
            <div className="w-full max-w-lg rounded-xl border border-outline-variant/30 bg-surface-container-low p-6 shadow-2xl dark:bg-zinc-900">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-on-surface dark:text-white">{title}</h2>

                    <MaterialIcon
                        name="close"
                        onClick={onClose}
                        className="text-2xl text-on-surface-variant transition hover:text-on-surface dark:text-zinc-400 dark:hover:text-white"
                    />
                </div>

                {children}
            </div>
        </div>
    );
}
