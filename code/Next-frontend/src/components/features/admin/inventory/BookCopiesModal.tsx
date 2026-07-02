"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ADMIN } from "@/constants/ui-text/admin";
import { bookCopyService } from "@/services/book-copy";
import type { BookCopy, BookCopyStatus } from "@/types/book-copy";

interface BookCopiesModalProps {
    bookId: number;
    bookTitle: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Triggered when quantity changes
}

export default function BookCopiesModal({ bookId, bookTitle, isOpen, onClose, onSuccess }: BookCopiesModalProps) {
    const [copies, setCopies] = useState<BookCopy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addQuantity, setAddQuantity] = useState<number>(1);

    const textUI = ADMIN.MODAL.BOOK_COPIES;

    // Status mapping for UI
    const statusMap: Record<BookCopyStatus, { label: string; colorClass: string }> = {
        AVAILABLE: { label: textUI.STATUS_AVAILABLE, colorClass: "bg-info-50 text-info-600 border-info-100" },
        BORROWED: { label: textUI.STATUS_BORROWED, colorClass: "bg-surface-container-high text-on-surface-variant border-outline" },
        LOST: { label: textUI.STATUS_LOST, colorClass: "bg-error-50 text-error-600 border-error-100" },
        DAMAGED: { label: textUI.STATUS_DAMAGED, colorClass: "bg-warning-50 text-warning-700 border-warning-200" },
        MAINTENANCE: { label: textUI.STATUS_MAINTENANCE, colorClass: "bg-tertiary-50 text-tertiary-600 border-tertiary-100" },
    };

    useEffect(() => {
        if (isOpen && bookId) {
            fetchCopies();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, bookId]);

    const fetchCopies = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookCopyService.getCopiesByBookId(bookId);
            setCopies(data);
        } catch (err: any) {
            setError(err.message || textUI.ERROR_FETCH);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCopy = async () => {
        if (addQuantity <= 0) return;
        try {
            setLoading(true);
            await bookCopyService.addCopy(bookId, addQuantity);
            await fetchCopies();
            setAddQuantity(1);
            onSuccess(); // Triggers table refresh to update quantity
        } catch (err: any) {
            toast.error(err.message || textUI.ERROR_ADD);
            setLoading(false);
        }
    };

    const handleStatusChange = async (copyId: number, newStatus: BookCopyStatus) => {
        try {
            setLoading(true);
            await bookCopyService.updateCopy(copyId, { status: newStatus });
            await fetchCopies();
            onSuccess(); // Status change might affect availableQuantity
        } catch (err: any) {
            toast.error(err.message || textUI.ERROR_UPDATE);
            setLoading(false);
        }
    };

    const handleDeleteCopy = async (copyId: number) => {
        if (!confirm(textUI.CONFIRM_DELETE)) return;

        try {
            setLoading(true);
            await bookCopyService.deleteCopy(copyId);
            await fetchCopies();
            onSuccess(); // Triggers table refresh to update quantity
        } catch (err: any) {
            toast.error(err.message || textUI.ERROR_DELETE);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
            <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-surface-container-high bg-surface px-6 py-4">
                    <div>
                        <h2 className="text-[18px] font-semibold text-ink-950">{textUI.TITLE}</h2>
                        <p className="mt-0.5 text-[13px] text-on-surface-variant">
                            {textUI.BOOK_TITLE} <span className="font-semibold">{bookTitle}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex shrink-0 items-center justify-between border-b border-surface-container-high px-6 py-4">
                    <div className="text-[14px] font-medium text-on-surface-variant">
                        {textUI.TOTAL} <span className="font-bold text-on-surface">{copies.length}</span> {textUI.COPIES_UNIT}
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="1"
                            value={addQuantity}
                            onChange={(e) => setAddQuantity(Number(e.target.value))}
                            disabled={loading}
                            className="w-20 rounded-lg border border-surface-container-high px-3 py-2 text-center text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                        />
                        <button
                            onClick={handleAddCopy}
                            disabled={loading || addQuantity <= 0}
                            className="focus-ring flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
                        >
                            <Plus size={16} />
                            {textUI.ADD_COPY}
                        </button>
                    </div>
                </div>

                {/* List Content */}
                <div className="overflow-y-auto bg-surface-container-lowest p-6">
                    {loading && copies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-12 text-outline">
                            <Loader2 size={32} className="animate-spin text-primary-500" />
                            <p>{textUI.LOADING_DATA}</p>
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center text-error">
                            <p>{error}</p>
                        </div>
                    ) : copies.length === 0 ? (
                        <div className="py-12 text-center text-outline">
                            <p>{textUI.EMPTY_STATE}</p>
                            <button onClick={handleAddCopy} className="text-primary-600 mt-4 text-[14px] font-medium hover:underline">
                                {textUI.IMPORT_NOW}
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-surface-container-high bg-white">
                            <table className="w-full text-left text-[14px]">
                                <thead className="border-b border-surface-container-high bg-surface/50 font-label-caps text-[12px] uppercase tracking-wider text-on-surface-variant">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">{textUI.COL_BARCODE}</th>
                                        <th className="px-6 py-3 font-medium">{textUI.COL_STATUS}</th>
                                        <th className="px-6 py-3 font-medium">{textUI.COL_CONDITION_NOTE}</th>
                                        <th className="px-6 py-3 text-right font-medium">{textUI.COL_ACTIONS}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-high text-on-surface">
                                    {copies.map((copy) => (
                                        <tr key={copy.id} className="transition-colors hover:bg-surface/30">
                                            <td className="px-6 py-3 font-mono font-medium text-ink-900">{copy.barcode}</td>
                                            <td className="px-6 py-3">
                                                <select
                                                    value={copy.status}
                                                    onChange={(e) => handleStatusChange(copy.id, e.target.value as BookCopyStatus)}
                                                    disabled={loading}
                                                    className={`cursor-pointer appearance-none rounded-full border px-3 py-1 text-[12px] font-medium outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 ${statusMap[copy.status].colorClass}`}
                                                >
                                                    {Object.entries(statusMap).map(([val, { label }]) => (
                                                        <option key={val} value={val}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-3 text-[13px] text-on-surface-variant">
                                                {copy.conditionNote || <span className="italic text-outline">{textUI.NO_NOTE}</span>}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button
                                                    onClick={() => handleDeleteCopy(copy.id)}
                                                    disabled={loading}
                                                    className="rounded p-1.5 text-error-400 transition-colors hover:bg-error-50 hover:text-error disabled:opacity-50"
                                                    title={textUI.TOOLTIP_DELETE}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
