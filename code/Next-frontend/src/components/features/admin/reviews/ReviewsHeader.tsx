import { MessageSquare } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const TEXT = UI_TEXT.ADMIN_REVIEWS;

export default function ReviewsHeader() {
    return (
        <header className="border-y border-surface-container-high bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-950">
            <div>
                <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950 dark:text-white">
                    <MessageSquare size={24} className="text-primary-600" />
                    {TEXT.PAGE_TITLE}
                </h1>
                <p className="mt-1 text-[14px] text-on-surface-variant dark:text-slate-300">{TEXT.PAGE_DESCRIPTION}</p>
            </div>
        </header>
    );
}
