import { CheckCircle } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = UI_TEXT.COMMON.SUCCESS_MODAL.SUCCESS,
  message,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-900 border border-ink-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        <div className="px-6 py-6 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success-50 dark:bg-success-900/30 flex items-center justify-center text-success-500 dark:text-success-400">
            <CheckCircle size={28} />
          </div>
          <div>
            <h3 className="font-title-md text-title-md font-semibold text-ink-950 dark:text-white mb-2">
              {title}
            </h3>
            <p className="font-body-sm text-body-sm text-ink-600 dark:text-slate-400">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 rounded bg-primary-700 dark:bg-primary-600 text-white font-label-caps text-label-caps hover:bg-primary-800 dark:hover:bg-primary-500 transition-colors"
          >
            {UI_TEXT.COMMON.SUCCESS_MODAL.CLOSE}
          </button>
        </div>
      </div>
    </div>
  );
}
