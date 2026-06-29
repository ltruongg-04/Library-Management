"use client";

import { useState } from "react";
import { ADMIN_USER_MANAGEMENT } from "@/constants/ui-text/admin";

export default function UserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "customer",
        lastlogin: "",
    });

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-[500px] space-y-4 rounded-xl bg-white p-6">
                {/* Header */}
                <div className="flex justify-between">
                    <h2 className="text-lg font-semibold">{ADMIN_USER_MANAGEMENT.MODAL.CREATE_TITLE}</h2>
                    <button onClick={onClose}>{ADMIN_USER_MANAGEMENT.MODAL.CLOSE}</button>
                </div>

                {/* Form */}
                <input
                    className="w-full rounded border p-2"
                    placeholder={ADMIN_USER_MANAGEMENT.MODAL.PLACEHOLDER_NAME}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    className="w-full rounded border p-2"
                    placeholder={ADMIN_USER_MANAGEMENT.MODAL.PLACEHOLDER_EMAIL}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <select
                    aria-label="Status filter"
                    className="w-full rounded border p-2"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="customer">{ADMIN_USER_MANAGEMENT.FILTERS.ROLES.CUSTOMER}</option>
                    <option value="librarian">{ADMIN_USER_MANAGEMENT.FILTERS.ROLES.LIBRARIAN}</option>
                    <option value="admin">{ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ADMIN}</option>
                </select>

                <input
                    className="w-full rounded border p-2"
                    placeholder={ADMIN_USER_MANAGEMENT.MODAL.PLACEHOLDER_LAST_LOGIN}
                    value={form.lastlogin}
                    onChange={(e) => setForm({ ...form, lastlogin: e.target.value })}
                />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="rounded border px-4 py-2">
                        {ADMIN_USER_MANAGEMENT.MODAL.BTN_CANCEL}
                    </button>

                    <button className="rounded bg-indigo-600 px-4 py-2 text-white">{ADMIN_USER_MANAGEMENT.MODAL.BTN_CREATE}</button>
                </div>
            </div>
        </div>
    );
}
