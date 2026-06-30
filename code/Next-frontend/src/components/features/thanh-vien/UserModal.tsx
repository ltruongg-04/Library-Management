"use client";

import { useEffect, useState } from "react";
import { BookOpen, Mail, ShieldAlert, User as UserIcon, X, Lock } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import type { User } from "@/types/user";

interface UserModalProps {
    open: boolean;
    onClose: () => void;
    initialData?: User | null;
    onSave?: (data: { name: string; email: string; role: string; password?: string }) => Promise<void>;
}

export default function UserModal({ open, onClose, initialData, onSave }: UserModalProps) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!initialData;
    const initialRole = initialData?.role?.toLowerCase();

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setForm({
                name: initialData?.name || "",
                email: initialData?.email || "",
                password: "",
                role: initialRole || "customer",
            });
            setError(null);
        }
    }, [open, initialData, initialRole]);

    if (!open) return null;

    const handleSave = async () => {
        setError(null);
        if (!form.name.trim()) {
            setError("Tên không được để trống");
            return;
        }
        if (!isEditMode && !form.email.trim()) {
            setError("Email không được để trống");
            return;
        }
        if (!isEditMode && form.password.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự");
            return;
        }

        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(form);
            }
            onClose();
        } catch (error: any) {
            console.error("Failed to save user", error);
            setError(error?.response?.data?.message || "Lưu thông tin thất bại");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 px-4 backdrop-blur-sm">
            <div className="level-2-shadow flex w-full max-w-lg transform flex-col overflow-hidden rounded-2xl bg-surface-container-lowest transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-bright p-lg">
                    <h3 className="font-headline-lg text-headline-lg-mobile text-on-background">
                        {isEditMode ? "Chỉnh sửa thành viên" : UI_TEXT.ADMIN_USER_MANAGEMENT.MODAL.CREATE_TITLE}
                    </h3>
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
                    {error && (
                        <div className="rounded-lg bg-error-container/20 p-3 text-sm font-medium text-error border border-error/30">
                            {error}
                        </div>
                    )}

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
                                className={`w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 font-body-md text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                                placeholder="e.g. jane@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                type="email"
                                disabled={isEditMode}
                            />
                        </div>
                        {isEditMode && <p className="text-xs text-on-surface-variant mt-1">Không thể thay đổi email sau khi đăng ký.</p>}
                    </div>

                    {!isEditMode && (
                        <div className="flex flex-col gap-1.5">
                            <label className="font-body-sm text-body-sm font-medium text-on-surface">Mật khẩu khởi tạo</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                                <input
                                    className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 font-body-md text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Tối thiểu 8 ký tự"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    type="password"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="font-body-sm text-body-sm font-medium text-on-surface">{UI_TEXT.ADMIN_USER_MANAGEMENT.TABLE.COL_ROLE}</label>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Customer Role */}
                            <label className={initialRole === 'admin' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}>
                                <input
                                    className="peer sr-only"
                                    name="role"
                                    type="radio"
                                    value="customer"
                                    checked={form.role === "customer"}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    disabled={initialRole === 'admin'}
                                />
                                <div className={`flex flex-col items-center rounded-lg border border-outline-variant/50 p-3 text-center text-on-surface-variant transition-all peer-checked:border-secondary peer-checked:bg-secondary-container/10 peer-checked:text-secondary ${initialRole === 'admin' ? 'bg-surface-container-low grayscale' : 'hover:bg-surface-variant'}`}>
                                    <UserIcon size={24} className="mb-1" />
                                    <span className="block font-label-caps text-label-caps">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.CUSTOMER}</span>
                                </div>
                            </label>

                            {/* Librarian Role */}
                            <label className={initialRole === 'admin' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}>
                                <input
                                    className="peer sr-only"
                                    name="role"
                                    type="radio"
                                    value="librarian"
                                    checked={form.role === "librarian"}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    disabled={initialRole === 'admin'}
                                />
                                <div className={`flex flex-col items-center rounded-lg border border-outline-variant/50 p-3 text-center text-on-surface-variant transition-all peer-checked:border-secondary peer-checked:bg-secondary-container/10 peer-checked:text-secondary ${initialRole === 'admin' ? 'bg-surface-container-low grayscale' : 'hover:bg-surface-variant'}`}>
                                    <BookOpen size={24} className="mb-1" />
                                    <span className="block font-label-caps text-label-caps">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.LIBRARIAN}</span>
                                </div>
                            </label>

                            {/* Admin Role */}
                            <label className={initialRole !== 'admin' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}>
                                <input
                                    className="peer sr-only"
                                    name="role"
                                    type="radio"
                                    value="admin"
                                    checked={form.role === "admin"}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    disabled={initialRole !== 'admin'}
                                />
                                <div className={`flex flex-col items-center rounded-lg border border-outline-variant/50 p-3 text-center text-on-surface-variant transition-all peer-checked:border-secondary peer-checked:bg-secondary-container/10 peer-checked:text-secondary ${initialRole !== 'admin' ? 'bg-surface-container-low grayscale' : 'hover:bg-surface-variant'}`}>
                                    <ShieldAlert size={24} className="mb-1" />
                                    <span className="block font-label-caps text-label-caps">{UI_TEXT.ADMIN_USER_MANAGEMENT.FILTERS.ROLES.ADMIN}</span>
                                </div>
                            </label>
                        </div>
                        {initialRole === 'admin' && <p className="text-xs text-on-surface-variant mt-1">Không thể thay đổi vai trò của tài khoản Admin.</p>}
                        {!isEditMode && <p className="text-xs text-on-surface-variant mt-1">Không thể cấp quyền Admin cho tài khoản mới.</p>}
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-auto flex justify-end gap-3 border-t border-outline-variant/30 bg-surface-bright p-lg">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-outline px-5 py-2.5 text-[14px] font-semibold text-on-surface transition-colors hover:bg-surface-variant"
                    >
                        {UI_TEXT.ADMIN_USER_MANAGEMENT.MODAL.BTN_CANCEL}
                    </button>
                    <button
                        className="rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50"
                        onClick={handleSave}
                        disabled={!form.name.trim() || isSaving}
                    >
                        {isSaving ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : UI_TEXT.ADMIN_USER_MANAGEMENT.MODAL.BTN_CREATE}
                    </button>
                </div>
            </div>
        </div>
    );
}
