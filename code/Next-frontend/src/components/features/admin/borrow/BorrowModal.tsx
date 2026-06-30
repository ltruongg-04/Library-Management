"use client";

import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, Loader2, User as UserIcon, X } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import { createAdminBorrowOrder } from "@/services/adminBorrow";

const T = UI_TEXT.ADMIN_BORROW_MANAGEMENT.MODAL;

export default function BorrowModal({ open, onClose, onSubmitSuccess }: { open: boolean; onClose: () => void; onSubmitSuccess: () => void }) {
    const [form, setForm] = useState({
        phone: "",
        fullName: "",
        email: "",
        bookBarcodes: "",
        dueDate: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setForm({ phone: "", fullName: "", email: "", bookBarcodes: "", dueDate: "" });
            setError(null);
            setIsLoading(false);
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = async () => {
        setError(null);
        if (!form.phone.trim() || !form.bookBarcodes.trim() || !form.dueDate) {
            setError("Vui lòng điền các thông tin bắt buộc (SĐT, Mã vạch, Ngày hẹn trả)");
            return;
        }

        const barcodes = form.bookBarcodes
            .split(",")
            .map((b) => b.trim())
            .filter((b) => b.length > 0);

        if (barcodes.length === 0) {
            setError("Vui lòng nhập ít nhất một mã vạch hợp lệ");
            return;
        }

        setIsLoading(true);
        try {
            const res = await createAdminBorrowOrder({
                phone: form.phone,
                fullName: form.fullName,
                email: form.email,
                bookBarcodes: barcodes,
                dueDate: form.dueDate,
            });

            if (res.success) {
                onSubmitSuccess();
                onClose();
            } else {
                setError(res.message || "Tạo phiếu mượn thất bại");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Đã có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="level-2-shadow flex w-full max-w-lg transform flex-col overflow-hidden rounded-2xl bg-surface-container-lowest transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-bright p-6">
                    <h3 className="text-xl font-bold text-on-background">{T.CREATE_TITLE}</h3>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-error-container/20 hover:text-error disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex flex-col gap-5 p-6">
                    {error && <div className="rounded border border-error/50 bg-error-container/20 p-3 text-sm text-error">{error}</div>}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-on-surface">
                            {T.LABEL_PHONE} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-70"
                                placeholder="Nhập số điện thoại..."
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                type="text"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-on-surface">
                            {T.LABEL_FULL_NAME} <span className="text-xs font-normal text-on-surface-variant">{T.HINT_OPTIONAL_CREATE}</span>
                        </label>
                        <div className="relative">
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-70"
                                placeholder="Nhập họ và tên..."
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                type="text"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-on-surface">
                            {T.LABEL_EMAIL} <span className="text-xs font-normal text-on-surface-variant">{T.HINT_OPTIONAL}</span>
                        </label>
                        <div className="relative">
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-70"
                                placeholder="Nhập email..."
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                type="email"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-on-surface">
                            {T.LABEL_BOOK_BARCODE} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-70"
                                placeholder="Ví dụ: BC001, BC002..."
                                value={form.bookBarcodes}
                                onChange={(e) => setForm({ ...form, bookBarcodes: e.target.value })}
                                type="text"
                                disabled={isLoading}
                            />
                        </div>
                        <p className="text-xs text-on-surface-variant">{T.HINT_MULTIPLE_BARCODE}</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-on-surface">
                            {T.LABEL_DUE_DATE} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-70"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                type="date"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-auto flex justify-end gap-3 border-t border-outline-variant/30 bg-surface-bright p-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg border border-outline px-5 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50"
                    >
                        {T.BTN_CANCEL}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-70"
                    >
                        {isLoading && <Loader2 className="animate-spin" size={16} />}
                        {T.BTN_CREATE}
                    </button>
                </div>
            </div>
        </div>
    );
}
