"use client";

import { Plus, Users } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

export default function UserManagementHeader({ onCreate }: { onCreate: () => void }) {
    // For now we use the text from ADMIN_PAGES since this is the "Thành viên" page
    const title = UI_TEXT.ADMIN_PAGES.MEMBERS.TITLE;
    const desc = UI_TEXT.ADMIN_PAGES.MEMBERS.DESC;

    return (
        <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6">
            <div>
                <h1 className="flex items-center gap-2 font-serif text-2xl font-bold text-ink-950">
                    <Users size={24} className="text-primary-600" />
                    {title}
                </h1>
                <p className="mt-1 text-[14px] text-on-surface-variant">{desc}</p>
            </div>
            <button
                onClick={onCreate}
                className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-title-md text-sm text-title-md text-on-primary shadow-md transition-all hover:bg-primary-container hover:text-on-primary-container hover:shadow-lg active:scale-95"
            >
                <Plus size={20} className="transition-transform group-hover:rotate-90" />
                {UI_TEXT.ADMIN_USER_MANAGEMENT.HEADER.CREATE_BTN.replace("+ ", "")}
            </button>
        </div>
    );
}
