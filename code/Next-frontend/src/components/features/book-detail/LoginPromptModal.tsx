import { useRouter } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";

interface LoginPromptModalProps {
    open: boolean;
    onClose: () => void;
}

export default function LoginPromptModal({ open, onClose }: LoginPromptModalProps) {
    const router = useRouter();

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl dark:bg-surface-container-highest">
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-semibold text-on-surface dark:text-white">{UI_TEXT.BOOK_DETAIL.LOGIN_PROMPT.TITLE}</h2>
                    <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-300">{UI_TEXT.BOOK_DETAIL.LOGIN_PROMPT.DESCRIPTION}</p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/login")}
                        className="dark:bg-primary-600 w-full rounded-lg bg-primary py-2.5 font-medium text-white transition-colors hover:bg-primary/90 dark:hover:bg-primary-500"
                    >
                        {UI_TEXT.BOOK_DETAIL.LOGIN_PROMPT.LOGIN_BTN}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg border border-outline-variant py-2.5 font-medium text-on-surface transition-colors hover:bg-surface-container-low dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                    >
                        {UI_TEXT.BOOK_DETAIL.LOGIN_PROMPT.CONTINUE_BTN}
                    </button>
                </div>
            </div>
        </div>
    );
}
