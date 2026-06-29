"use client";

import { Plus } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

export default function UserManagementHeader({ onCreate }: { onCreate: () => void }) {
    // For now we use the text from ADMIN_PAGES since this is the "Thành viên" page
    const title = UI_TEXT.ADMIN_PAGES.MEMBERS.TITLE;
    const desc = UI_TEXT.ADMIN_PAGES.MEMBERS.DESC;

    return (
        <div className="flex flex-col items-start justify-between gap-md sm:flex-row sm:items-center">
            <div>
                <h2 className="mb-1 font-headline-lg text-headline-lg-mobile text-on-background md:text-headline-lg">{title}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">{desc}</p>
            </div>
            <button
                onClick={onCreate}
                className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-title-md text-sm text-title-md text-on-primary shadow-md transition-all hover:bg-primary-container hover:text-on-primary-container hover:shadow-lg active:scale-95"
            >
                <Plus size={20} className="transition-transform group-hover:rotate-90" />
                {UI_TEXT.ADMIN_USER_MANAGEMENT.HEADER.CREATE_BTN.replace("+ ", "")}
            </button>
        </div>
    );
}
