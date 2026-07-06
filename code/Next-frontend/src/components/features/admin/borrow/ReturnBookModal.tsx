"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Book, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ADMIN_BORROW_MANAGEMENT } from "@/constants/ui-text/admin/borrow-management";
import {
    AdminBorrowOrderDetailResponse,
    AdminReturnBookRequest,
    BookReturnDetailRequest,
    ReturnBookResponse,
    getAdminBorrowOrderDetail,
    returnBooks,
} from "@/services/adminBorrow";

const TEXT = ADMIN_BORROW_MANAGEMENT.RETURN_BOOK_MODAL;

interface ReturnBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderCode: string | null;
    onSubmitSuccess: (data: ReturnBookResponse) => void;
}

export default function ReturnBookModal({ isOpen, onClose, orderCode, onSubmitSuccess }: ReturnBookModalProps) {
    const [detail, setDetail] = useState<AdminBorrowOrderDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isReturning, setIsReturning] = useState<Record<number, boolean>>({});
    const [conditions, setConditions] = useState<Record<number, "NORMAL" | "DAMAGED" | "LOST">>({});
    const [notes, setNotes] = useState<Record<number, string>>({});
    const [generalNote, setGeneralNote] = useState("");

    useEffect(() => {
        if (isOpen && orderCode) {
            fetchDetail();
            setIsReturning({});
            setConditions({});
            setNotes({});
            setGeneralNote("");
        } else {
            setDetail(null);
            setError(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, orderCode]);

    const fetchDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await getAdminBorrowOrderDetail(orderCode!);
            if (res.success && res.data) {
                setDetail(res.data);
                const initialReturning: Record<number, boolean> = {};
                const initialConditions: Record<number, "NORMAL" | "DAMAGED" | "LOST"> = {};
                res.data.items.forEach((item) => {
                    const alreadyReturned = ["RETURNED", "LOST", "DAMAGED"].includes(item.status);
                    initialReturning[item.id] = !alreadyReturned;
                    initialConditions[item.id] = "NORMAL";
                });
                setIsReturning(initialReturning);
                setConditions(initialConditions);
            } else {
                setError(res.message || "Failed to load details");
            }
        } catch (err) {
            setError("Đã có lỗi xảy ra khi tải chi tiết phiếu mượn");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturningChange = (itemId: number, checked: boolean) => {
        setIsReturning((prev) => ({ ...prev, [itemId]: checked }));
    };

    const handleConditionChange = (itemId: number, condition: "NORMAL" | "DAMAGED" | "LOST") => {
        setConditions((prev) => ({ ...prev, [itemId]: condition }));
    };

    const handleNoteChange = (itemId: number, note: string) => {
        setNotes((prev) => ({ ...prev, [itemId]: note }));
    };

    const handleSubmit = async () => {
        if (!detail) return;
        setIsSubmitting(true);
        try {
            const details: BookReturnDetailRequest[] = detail.items
                .filter((item) => isReturning[item.id])
                .map((item) => ({
                    bookCopyId: item.bookCopyId,
                    conditionStatus: conditions[item.id] || "NORMAL",
                    note: notes[item.id] || undefined,
                }));

            if (details.length === 0) {
                toast.error("Vui lòng chọn ít nhất 1 cuốn sách để trả");
                setIsSubmitting(false);
                return;
            }

            const payload: AdminReturnBookRequest = {
                borrowOrderId: detail.id,
                details,
                generalNote: generalNote || undefined,
            };

            const res = await returnBooks(detail.id, payload);
            if (res.success && res.data) {
                onSubmitSuccess(res.data);
                onClose();
            } else {
                toast.error(res.message || "Xác nhận trả sách thất bại.");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-surface-container-lowest shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">{TEXT.TITLE}</h2>
                        {orderCode && (
                            <p className="mt-1 text-sm text-on-surface-variant">
                                {TEXT.ORDER_CODE}: {orderCode}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col gap-6">
                            <Skeleton className="h-40 w-full rounded-xl" />
                        </div>
                    ) : error ? (
                        <div className="flex h-40 items-center justify-center text-error">{error}</div>
                    ) : detail ? (
                        <div className="flex flex-col gap-6">
                            {/* Books List */}
                            <div className="overflow-hidden rounded-xl border border-outline-variant/30">
                                <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-4 py-3 font-medium text-on-surface">
                                    <div className="flex items-center gap-2">
                                        <Book size={18} className="text-tertiary" />
                                        {TEXT.BOOK_STATUS_TITLE}
                                    </div>
                                    <div className="text-sm font-normal text-on-surface-variant">
                                        {TEXT.SELECTING_RETURN}{" "}
                                        <span className="font-bold text-primary">{Object.values(isReturning).filter(Boolean).length}</span> /{" "}
                                        {detail.items.filter((i) => !["RETURNED", "LOST", "DAMAGED"].includes(i.status)).length} {TEXT.BOOKS_UNIT}
                                    </div>
                                </div>
                                <div className="space-y-4 p-4">
                                    {detail.items.map((item) => {
                                        const alreadyReturned = ["RETURNED", "LOST", "DAMAGED"].includes(item.status);
                                        const active = isReturning[item.id] && !alreadyReturned;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`rounded-lg border p-4 transition-colors ${alreadyReturned ? "border-outline-variant/30 bg-surface-container-lowest opacity-60" : active ? "border-primary/50 bg-primary/5" : "border-outline-variant/50"}`}
                                            >
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {!alreadyReturned && (
                                                            <input
                                                                type="checkbox"
                                                                checked={isReturning[item.id] || false}
                                                                onChange={(e) => handleReturningChange(item.id, e.target.checked)}
                                                                className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="flex items-center gap-2 font-semibold text-on-surface">
                                                                {item.bookTitle}
                                                                {alreadyReturned && (
                                                                    <span className="bg-success/20 text-success rounded-full px-2 py-0.5 text-xs">
                                                                        {TEXT.ALREADY_RETURNED}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-on-surface-variant">
                                                                {TEXT.BARCODE} {item.barcode}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {!alreadyReturned && (
                                                    <div
                                                        className={`mt-3 grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2 ${active ? "opacity-100" : "pointer-events-none opacity-40"}`}
                                                    >
                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium">{TEXT.CONDITION}</label>
                                                            <select
                                                                value={conditions[item.id] || "NORMAL"}
                                                                onChange={(e) =>
                                                                    handleConditionChange(item.id, e.target.value as "NORMAL" | "DAMAGED" | "LOST")
                                                                }
                                                                disabled={!active}
                                                                className="w-full rounded-lg border border-outline-variant bg-transparent p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-surface-container-low"
                                                            >
                                                                <option value="NORMAL">{TEXT.COND_NORMAL}</option>
                                                                <option value="DAMAGED">{TEXT.COND_DAMAGED}</option>
                                                                <option value="LOST">{TEXT.COND_LOST}</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium">{TEXT.NOTE_OPTIONAL}</label>
                                                            <input
                                                                type="text"
                                                                value={notes[item.id] || ""}
                                                                onChange={(e) => handleNoteChange(item.id, e.target.value)}
                                                                disabled={!active}
                                                                placeholder="Mô tả hư hỏng..."
                                                                className="w-full rounded-lg border border-outline-variant bg-transparent p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-surface-container-low"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* General Note */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">{TEXT.GENERAL_NOTE}</label>
                                <textarea
                                    value={generalNote}
                                    onChange={(e) => setGeneralNote(e.target.value)}
                                    placeholder="Ví dụ: Trả thiếu 1 cuốn, khách đền bù sau..."
                                    rows={3}
                                    className="w-full rounded-lg border border-outline-variant bg-transparent p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div className="border-warning-container bg-warning-container/20 text-warning flex gap-3 rounded-xl border p-4">
                                <AlertTriangle size={24} className="shrink-0" />
                                <div className="text-sm">
                                    <span className="mb-1 block font-semibold">{TEXT.NOTICE}</span>
                                    {TEXT.NOTICE_DESC}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-outline-variant/30 px-6 py-4">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
                    >
                        {TEXT.BTN_CANCEL}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !detail}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
                        ) : (
                            <CheckCircle size={18} />
                        )}
                        {TEXT.BTN_CONFIRM}
                    </button>
                </div>
            </div>
        </div>
    );
}
