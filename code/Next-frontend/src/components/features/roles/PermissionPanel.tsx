"use client";

import { UI_TEXT } from "@/constants/ui-text";
import { Role } from "@/types/role";
import PermissionModule from "./PermissionModule";

interface PermissionPanelProps {
    role: Role;
    onTogglePermission: (moduleId: string, permissionId: string) => void;
    onDiscardChanges: () => void;
    onSaveChanges: () => void;
    isSaving: boolean;
    hasChanges: boolean;
}

export default function PermissionPanel({ role, onTogglePermission, onDiscardChanges, onSaveChanges, isSaving, hasChanges }: PermissionPanelProps) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/20 bg-white px-6 py-5">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-secondary">
                        {hasChanges ? UI_TEXT.ROLES.EDITING_ROLE : UI_TEXT.ROLES.VIEWING_ROLE}
                    </p>

                    <h2 className="text-2xl font-semibold text-on-surface">{role.name}</h2>
                </div>

                {hasChanges && (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onDiscardChanges}
                            className="rounded-lg border border-primary px-4 py-2 text-primary transition hover:bg-primary hover:text-white"
                        >
                            {UI_TEXT.ROLES.DISCARD_CHANGES}
                        </button>

                        <button
                            type="button"
                            onClick={onSaveChanges}
                            disabled={isSaving}
                            className="rounded-lg bg-primary px-4 py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {UI_TEXT.ROLES.SAVE_CHANGES}
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-5 bg-gray-50 p-6">
                {role.modules.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-400">{UI_TEXT.ROLES.ICON.LOCK}</span>

                        <p className="mt-4 text-gray-500">{UI_TEXT.ROLES.EMPTY_PERMISSION}</p>
                    </div>
                ) : (
                    role.modules.map((module) => <PermissionModule key={module.id} module={module} onTogglePermission={onTogglePermission} />)
                )}
            </div>
        </div>
    );
}
