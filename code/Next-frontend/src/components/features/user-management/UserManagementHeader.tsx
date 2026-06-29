"use client";

import { ADMIN_USER_MANAGEMENT } from "@/constants/ui-text/admin";

export default function UserManagementHeader({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">{ADMIN_USER_MANAGEMENT.HEADER.TITLE}</h1>
                <p className="text-gray-500">{ADMIN_USER_MANAGEMENT.HEADER.DESCRIPTION}</p>
            </div>

            <button onClick={onCreate} className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700">
                {ADMIN_USER_MANAGEMENT.HEADER.CREATE_BTN}
            </button>
        </div>
    );
}
