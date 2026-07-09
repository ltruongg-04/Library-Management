"use client";

import { PermissionModule as Module } from "@/types/role";
import PermissionItem from "./PermissionItem";

interface PermissionModuleProps {
    module: Module;
    onTogglePermission: (moduleId: string, permissionId: string) => void;
}

export default function PermissionModule({ module, onTogglePermission }: PermissionModuleProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2 border-b border-outline-variant/20 bg-surface-container-low px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <span className="material-symbols-outlined text-[20px] text-secondary dark:text-secondary-50">{module.icon}</span>

                <h3 className="font-semibold text-on-surface dark:text-white">{module.name}</h3>
            </div>

            <div>
                {module.permissions.map((permission) => (
                    <PermissionItem key={permission.id} permission={permission} onToggle={() => onTogglePermission(module.id, permission.id)} />
                ))}
            </div>
        </div>
    );
}
