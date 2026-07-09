"use client";

import { UI_TEXT } from "@/constants/ui-text";
import { Permission } from "@/types/role";

interface PermissionItemProps {
    permission: Permission;
    onToggle: () => void;
}

export default function PermissionItem({ permission, onToggle }: PermissionItemProps) {
    return (
        <div className="flex items-center justify-between border-b border-outline-variant/10 p-4 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-900">
            <div className="pr-6">
                <p className="font-medium text-on-surface dark:text-white">{permission.name}</p>

                <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-300">{permission.description}</p>
            </div>

            <button
                type="button"
                onClick={onToggle}
                aria-label={permission.enabled ? UI_TEXT.ROLES.DISABLE_PERMISSION : UI_TEXT.ROLES.ENABLE_PERMISSION}
                className={`relative h-6 w-11 rounded-full transition-colors ${permission.enabled ? "bg-primary dark:bg-primary-100" : "bg-surface-variant dark:bg-slate-700"}`}
            >
                <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all dark:bg-slate-950 ${permission.enabled ? "left-[22px]" : "left-0.5"}`}
                />
            </button>
        </div>
    );
}
