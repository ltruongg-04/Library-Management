"use client";

import { useEffect, useState } from "react";
import { BookOpen, Mail, ShieldAlert, User as UserIcon, X } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

export default function UserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "customer",
    });

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setForm({
                name: "",
                email: "",
                role: "customer",
            });
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 px-4 backdrop-blur-sm">
            <div className="level-2-shadow flex w-full max-w-lg transform flex-col overflow-hidden rounded-2xl bg-surface-container-lowest transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-bright p-lg">
                    <h3 className="font-headline-lg text-headline-lg-mobile text-on-background">{UI_TEXT.ADMIN_USER_MANAGEMENT.MODAL.CREATE_TITLE}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-error-container/20 hover:text-error"
                        title={UI_TEXT.ADMIN_USER_MANAGEMENT.MODAL.CLOSE}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex flex-col gap-md p-lg">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-body-sm text-body-sm font-medium text-on-surface">{UI_TEXT.ADMIN_USER_MANAGEMENT.MODAL.PLACEHOLDER_NAME}</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 font-body-md text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="e.g. Jane Doe"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-body-sm text-body-sm font-medium text-on-surface">{UI_TEXT.ADMIN_USER_MANAGEMENT.MODAL.PLACEHOLDER_EMAIL}</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 font-body-md text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="jane.doe@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                type="email"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-body-sm text-body-sm font-medium text-on-surface">{UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.COL_ROLE}</label>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Customer Role */}
                            <label className="cursor-pointer">
                                <input
                                    className="peer sr-only"
                                    name="role"
                                    type="radio"
                                    value="customer"
                                    checked={form.role === "customer"}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                />
                                <div className="flex flex-col items-center rounded-lg border border-outline-variant/50 p-3 text-center text-on-surface-variant transition-all hover:bg-surface-variant peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:text-primary">
                                    <UserIcon size={24} className="mb-1" />
                                    <span className="block font-label-caps text-label-caps">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.CUSTOMER}</span>
                                </div>
                            </label>

                            {/* Librarian Role */}
                            <label className="cursor-pointer">
                                <input
                                    className="peer sr-only"
                                    name="role"
                                    type="radio"
                                    value="librarian"
                                    checked={form.role === "librarian"}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                />
                                <div className="flex flex-col items-center rounded-lg border border-outline-variant/50 p-3 text-center text-on-surface-variant transition-all hover:bg-surface-variant peer-checked:border-primary peer-checked:bg-primary-container/10 peer-checked:text-primary">
                                    <BookOpen size={24} className="mb-1" />
                                    <span className="block font-label-caps text-label-caps">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.LIBRARIAN}</span>
                                </div>
                            </label>

                            {/* Admin Role */}
                            <label className="cursor-pointer">
                                <input
                                    className="peer sr-only"
                                    name="role"
                                    type="radio"
                                    value="admin"
                                    checked={form.role === "admin"}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                />
                                <div className="flex flex-col items-center rounded-lg border border-outline-variant/50 p-3 text-center text-on-surface-variant transition-all hover:bg-surface-variant peer-checked:border-secondary peer-checked:bg-secondary-container/10 peer-checked:text-secondary">
                                    <ShieldAlert size={24} className="mb-1" />
                                    <span className="block font-label-caps text-label-caps">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ADMIN}</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-auto flex justify-end gap-3 border-t border-outline-variant/30 bg-surface-bright p-lg">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-outline px-5 py-2.5 font-title-md text-sm text-title-md text-on-surface transition-colors hover:bg-surface-variant"
                    >
                        {UI_TEXT.ADMIN_USER_MANAGEMENT.MODAL.BTN_CANCEL}
                    </button>
                    <button className="rounded-lg bg-primary px-5 py-2.5 font-title-md text-sm text-title-md text-on-primary shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container">
                        {UI_TEXT.ADMIN_USER_MANAGEMENT.MODAL.BTN_CREATE}
                    </button>
                </div>
            </div>
        </div>
    );
}
