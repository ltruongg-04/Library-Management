"use client";

import { Permission } from "@/types/role";

interface PermissionItemProps {
    permission: Permission;
    onToggle: () => void;
}

export default function PermissionItem({ permission, onToggle }: PermissionItemProps) {
    return (
        <div className="flex items-center justify-between border-b border-outline-variant/10 p-4 transition-colors last:border-b-0 hover:bg-gray-50">
            <div className="pr-6">
                <p className="font-medium text-on-surface">{permission.name}</p>

                <p className="mt-1 text-sm text-on-surface-variant">{permission.description}</p>
            </div>

            <button
                type="button"
                onClick={onToggle}
                aria-label={permission.enabled ? "Disable permission" : "Enable permission"}
                className={`relative h-6 w-11 rounded-full transition-colors ${permission.enabled ? "bg-primary" : "bg-surface-variant"}`}
            >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${permission.enabled ? "left-[22px]" : "left-0.5"}`} />
            </button>
        </div>
    );
}
