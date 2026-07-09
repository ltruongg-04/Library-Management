"use client";

import { UI_TEXT } from "@/constants/ui-text";
import { Role } from "@/types/role";

interface RoleListProps {
    roles: Role[];
    selectedRole: Role;
    onSelect: (role: Role) => void;
}

export default function RoleList({ roles, selectedRole, onSelect }: RoleListProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="border-b border-outline-variant/20 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-lg font-semibold text-on-surface dark:text-white">{UI_TEXT.ROLES.ROLE_LIST_TITLE}</h2>
            </div>

            <div className="space-y-1 p-2">
                {roles.map((role) => {
                    const active = role.id === selectedRole.id;

                    return (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => onSelect(role)}
                            className={`group relative flex w-full flex-col items-start rounded-lg p-3 text-left transition-all ${
                                active
                                    ? "border border-blue-200 bg-blue-50 dark:border-primary-300/40 dark:bg-primary-900/30"
                                    : "hover:bg-gray-50 dark:hover:bg-slate-900"
                            } `}
                        >
                            {active && <div className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-indigo-700" />}

                            <div className={`flex w-full items-center justify-between ${active ? "pl-2" : ""}`}>
                                <span
                                    className={`font-semibold ${
                                        active
                                            ? "text-indigo-700 dark:text-primary-100"
                                            : "text-gray-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-primary-100"
                                    }`}
                                >
                                    {role.name}
                                </span>

                                <span
                                    className={`material-symbols-outlined text-[18px] ${
                                        active
                                            ? "text-indigo-700 dark:text-primary-100"
                                            : "text-gray-400 group-hover:text-indigo-700 dark:text-slate-500 dark:group-hover:text-primary-100"
                                    }`}
                                >
                                    {UI_TEXT.ROLES.ICON.CHEVRON}
                                </span>
                            </div>

                            <p className={`mt-1 text-sm ${active ? "pl-2 text-indigo-500 dark:text-primary-100/80" : "text-gray-500 dark:text-slate-400"}`}>
                                {role.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
