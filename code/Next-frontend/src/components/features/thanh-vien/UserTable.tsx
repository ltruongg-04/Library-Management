"use client";

import { BookOpen, ChevronLeft, ChevronRight, Edit2, Lock, ShieldAlert, Unlock, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { UI_TEXT } from "@/constants/ui-text";

export type User = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "librarian" | "customer";
    status: "active" | "locked" | "inactive";
    lastLogin: string;
    avatarUrl?: string;
};

export default function UserTable({
    users,
    onEditUser,
    onToggleStatus
}: {
    users: User[];
    onEditUser?: (user: User) => void;
    onToggleStatus?: (id: number, isActive: boolean) => void;
}) {
    const renderRoleBadge = (role: User["role"]) => {
        if (role === "admin") {
            return (
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary-container px-2.5 py-0.5 font-label-caps text-xs text-on-primary-container">
                    <ShieldAlert size={14} className="mr-1" />
                    {UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ADMIN}
                </span>
            );
        }
        if (role === "librarian") {
            return (
                <span className="inline-flex items-center rounded-full border border-outline-variant bg-surface-variant px-2.5 py-0.5 font-label-caps text-xs text-on-surface">
                    <BookOpen size={14} className="mr-1" />
                    {UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.LIBRARIAN}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full border border-outline-variant px-2.5 py-0.5 font-label-caps text-xs text-on-surface-variant">
                <UserIcon size={14} className="mr-1" />
                {UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.CUSTOMER}
            </span>
        );
    };

    const renderStatusBadge = (status: User["status"]) => {
        if (status === "active") {
            return (
                <span className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-secondary">
                    <span className="h-2 w-2 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(45,188,254,0.6)]"></span>
                    {UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.ACTIVE}
                </span>
            );
        }
        if (status === "locked") {
            return (
                <span className="inline-flex items-center gap-1.5 font-body-sm text-body-sm font-medium text-error">
                    <Lock size={16} />
                    {UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.LOCKED}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-outline">
                <span className="h-2 w-2 rounded-full bg-outline"></span>
                {UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.STATUS.INACTIVE}
            </span>
        );
    };

    return (
        <div className="level-1-shadow relative flex flex-1 flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
            {/* Table Header */}
            <div className="sticky top-0 z-10 grid grid-cols-12 gap-4 border-b border-outline-variant/30 bg-surface-bright/50 p-md font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant backdrop-blur-sm">
                <div className="col-span-12 sm:col-span-4 md:col-span-3 lg:col-span-3">{UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.COL_USER}</div>
                <div className="col-span-8 hidden sm:block md:col-span-4 lg:col-span-3">{UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.COL_EMAIL}</div>
                <div className="col-span-3 hidden md:col-span-2 md:block">{UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.COL_ROLE}</div>
                <div className="col-span-2 hidden lg:col-span-2 lg:block">{UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.COL_STATUS}</div>
                <div className="col-span-2 hidden text-right lg:col-span-1 lg:block">{UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.COL_LAST_LOGIN}</div>
                <div className="col-span-12 text-right sm:col-span-4 md:col-span-3 lg:col-span-1">{UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.COL_ACTIONS}</div>
            </div>

            {/* Table Body */}
            <div className="flex min-h-[400px] flex-col overflow-y-auto">
                {users.map((u) => {
                    const isLocked = u.status === "locked";
                    return (
                        <div
                            key={u.id}
                            className={`group grid grid-cols-12 items-center gap-4 border-b border-surface-variant p-md transition-colors ${isLocked ? "bg-surface-container-low/20 hover:bg-surface-container-low/50" : "hover:bg-surface-container-low/50"}`}
                        >
                            {/* User Details */}
                            <div className={`col-span-12 flex items-center gap-3 sm:col-span-4 md:col-span-3 lg:col-span-3 ${isLocked ? "opacity-60" : ""}`}>
                                {u.avatarUrl ? (
                                    <Image
                                        src={u.avatarUrl}
                                        alt={u.name}
                                        className={`h-10 w-10 rounded-full border border-outline-variant/50 object-cover ${isLocked ? "grayscale" : ""}`}
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-container text-[14px] font-semibold text-on-tertiary-container">
                                        {u.name.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className={`text-[15px] font-semibold text-on-background ${isLocked ? "line-through decoration-error/50" : ""}`}>
                                        {u.name}
                                    </span>
                                    <span className="font-body-sm text-body-sm text-on-surface-variant sm:hidden">{u.email}</span>
                                </div>
                            </div>

                            {/* Email (Desktop) */}
                            <div
                                className={`col-span-8 hidden items-center truncate font-body-sm text-body-sm text-on-surface sm:flex md:col-span-4 lg:col-span-3 ${isLocked ? "text-on-surface-variant opacity-60" : ""}`}
                            >
                                {u.email}
                            </div>

                            {/* Role */}
                            <div className={`col-span-12 flex items-center gap-2 sm:col-span-4 md:col-span-2 ${isLocked ? "opacity-60" : ""}`}>
                                {renderRoleBadge(u.role)}
                            </div>

                            {/* Status */}
                            <div className="col-span-6 hidden items-center lg:col-span-2 lg:flex">{renderStatusBadge(u.status)}</div>

                            {/* Last Login */}
                            <div
                                className={`col-span-6 hidden items-center justify-end font-body-sm text-body-sm text-on-surface-variant lg:col-span-1 lg:flex ${isLocked ? "opacity-60" : ""}`}
                            >
                                {u.lastLogin}
                            </div>

                            {/* Actions */}
                            <div className="col-span-12 flex items-center justify-end gap-2 opacity-100 transition-opacity group-hover:opacity-100 sm:col-span-4 md:col-span-3 lg:col-span-1 lg:opacity-0">
                                <button
                                    className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-secondary"
                                    title={UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.BTN_EDIT}
                                    onClick={() => onEditUser?.(u)}
                                >
                                    <Edit2 size={20} />
                                </button>
                                {isLocked ? (
                                    <button
                                        className="flex items-center rounded-lg p-2 text-error transition-colors hover:bg-error hover:text-on-error"
                                        title={UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.BTN_UNLOCK}
                                        onClick={() => onToggleStatus?.(u.id, true)}
                                    >
                                        <Unlock size={20} />
                                    </button>
                                ) : (
                                    <button
                                        className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container/50 hover:text-error"
                                        title={UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.BTN_LOCK}
                                        onClick={() => onToggleStatus?.(u.id, false)}
                                    >
                                        <Lock size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Footer */}
            <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-lowest p-sm px-md">
                <span className="font-body-sm text-body-sm text-on-surface-variant">{UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.PAGINATION_INFO}</span>
                <div className="flex items-center gap-1">
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-30"
                        disabled
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-[14px] font-semibold text-on-primary-container">
                        1
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg font-body-sm text-body-sm text-on-surface transition-colors hover:bg-surface-variant">
                        2
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg font-body-sm text-body-sm text-on-surface transition-colors hover:bg-surface-variant">
                        3
                    </button>
                    <span className="px-1 text-on-surface-variant">...</span>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg font-body-sm text-body-sm text-on-surface transition-colors hover:bg-surface-variant">
                        12
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
