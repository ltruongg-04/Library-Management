"use client";
import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, CheckCircle2, Loader2, Search, User as UserIcon, X } from "lucide-react";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import { createAdminBorrowOrder } from "@/services/adminBorrow";
import { AdminCustomerLookupResponse, lookupCustomer } from "@/services/adminCustomer";

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
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [customerData, setCustomerData] = useState<AdminCustomerLookupResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setForm({ phone: "", fullName: "", email: "", bookBarcodes: "", dueDate: "" });
            setError(null);
            setIsLoading(false);
            setCustomerData(null);
            setIsLookingUp(false);
        }
    }, [open]);

    if (!open) return null;

    const handleLookup = async () => {
        if (!form.phone.trim()) {
            toast.error(UI_TEXT.RECENT.TEXT_50);
            return;
        }

        setIsLookingUp(true);
        setError(null);
        try {
            const res = await lookupCustomer(form.phone);
            if (res.success && res.data) {
                setCustomerData(res.data);
                setForm((prev) => ({
                    ...prev,
                    phone: res.data!.phone,
                    fullName: res.data!.fullName,
                    email: res.data!.email || "",
                }));
                toast.success(UI_TEXT.RECENT.TEXT_49 + res.data.fullName);
            } else {
                toast.error(res.message || UI_TEXT.RECENT.TEXT_48);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || UI_TEXT.RECENT.TEXT_47);
            setCustomerData(null);
        } finally {
            setIsLookingUp(false);
        }
    };

    const handleSubmit = async () => {
        setError(null);
        if (!form.phone.trim() || !form.bookBarcodes.trim() || !form.dueDate) {
            setError(API_ERRORS.MISSING_FIELDS);
            return;
        }

        const barcodes = form.bookBarcodes
            .split(",")
            .map((b) => b.trim())
            .filter((b) => b.length > 0);

        if (barcodes.length === 0) {
            setError(API_ERRORS.MISSING_BARCODE);
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
                toast.success(UI_TEXT.RECENT.TEXT_46);
                onSubmitSuccess();
                onClose();
            } else {
                setError(res.message || API_ERRORS.CREATE_BORROW_FAILED);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || API_ERRORS.GENERIC_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-scrim/50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="level-2-shadow flex w-full max-w-lg transform flex-col overflow-hidden rounded-2xl bg-surface-container-lowest transition-all dark:border dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="dark:bg-slate-850 flex items-center justify-between border-b border-outline-variant/30 bg-surface-bright p-6 dark:border-slate-800">
                    <div>
                        <h3 className="text-xl font-bold text-on-background dark:text-white">{UI_TEXT.RECENT.TEXT_45}</h3>
                        <p className="text-sm text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_44}</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-error-container/20 hover:text-error disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex flex-col gap-5 p-6">
                    {error && <div className="rounded border border-error/50 bg-error-container/20 p-3 text-sm text-error">{error}</div>}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-on-surface dark:text-slate-200">
                            {UI_TEXT.RECENT.TEXT_43}
                            <span className="text-error">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500" size={20} />
                                <input
                                    className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    placeholder="Quét mã thẻ hoặc nhập SĐT..."
                                    value={form.phone}
                                    onChange={(e) => {
                                        setForm({ ...form, phone: e.target.value });
                                        if (customerData) setCustomerData(null);
                                    }}
                                    type="text"
                                    disabled={isLoading || isLookingUp}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleLookup();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleLookup}
                                disabled={isLoading || isLookingUp || !form.phone.trim()}
                                className="flex items-center justify-center gap-2 rounded-lg bg-surface-variant px-4 text-sm font-medium text-on-surface transition-colors hover:bg-outline-variant/30 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                {isLookingUp ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                {UI_TEXT.RECENT.TEXT_42}
                            </button>
                        </div>
                    </div>

                    {customerData && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 dark:border-primary/30 dark:bg-primary/10">
                            <div className="mb-1 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-primary" />
                                <span className="text-sm font-semibold text-primary">{UI_TEXT.RECENT.TEXT_41}</span>
                                {customerData.isGuest ? (
                                    <span className="bg-secondary-100 text-secondary-700 dark:bg-secondary-900 ml-auto rounded px-2 py-0.5 text-[10px] font-semibold dark:text-secondary-300">
                                        {UI_TEXT.RECENT.TEXT_40}
                                    </span>
                                ) : (
                                    <span className="ml-auto rounded bg-success-100 px-2 py-0.5 text-[10px] font-semibold text-success-700 dark:bg-success-900 dark:text-success-300">
                                        {UI_TEXT.RECENT.TEXT_39}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 pl-6 text-sm text-on-surface dark:text-slate-200">
                                <p>
                                    <span className="text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_38}</span>{" "}
                                    <span className="font-medium text-on-surface dark:text-white">{customerData.fullName}</span>
                                </p>
                                {customerData.libraryCardNo && (
                                    <p>
                                        <span className="text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_37}</span>{" "}
                                        {customerData.libraryCardNo}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-on-surface dark:text-slate-200">
                            {T.LABEL_FULL_NAME}{" "}
                            {!customerData && <span className="text-xs font-normal text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_36}</span>}
                        </label>
                        <div className="relative">
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-surface-variant disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
                                placeholder="Nhập họ và tên..."
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                type="text"
                                disabled={isLoading || customerData !== null}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-on-surface dark:text-slate-200">
                            {T.LABEL_BOOK_BARCODE} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                placeholder="Quét mã sách (Ví dụ: BC001, BC002...)"
                                value={form.bookBarcodes}
                                onChange={(e) => setForm({ ...form, bookBarcodes: e.target.value })}
                                type="text"
                                disabled={isLoading}
                            />
                        </div>
                        <p className="text-xs text-on-surface-variant dark:text-slate-400">{T.HINT_MULTIPLE_BARCODE}</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-on-surface dark:text-slate-200">
                            {T.LABEL_DUE_DATE} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                type="date"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="dark:bg-slate-850 mt-auto flex justify-end gap-3 border-t border-outline-variant/30 bg-surface-bright p-6 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg border border-outline px-5 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        {T.BTN_CANCEL}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-70"
                    >
                        {isLoading && <Loader2 className="animate-spin" size={16} />}
                        {UI_TEXT.RECENT.TEXT_35}
                    </button>
                </div>
            </div>
        </div>
    );
}
