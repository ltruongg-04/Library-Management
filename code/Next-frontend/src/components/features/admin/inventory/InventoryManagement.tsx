"use client";

import { useEffect, useState } from "react";
import { Calendar, ClipboardList, FileText, Package, Plus } from "lucide-react";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminStockReceipt, getAdminStockReceiptDetail, getAdminStockReceipts } from "@/services/adminStockReceipt";
import CreateReceiptModal from "./CreateReceiptModal";

export default function InventoryManagement() {
    const [receipts, setReceipts] = useState<AdminStockReceipt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<AdminStockReceipt | null>(null);

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        setIsLoading(true);
        try {
            const res = await getAdminStockReceipts();
            if (res.success && res.data) {
                setReceipts(res.data);
            } else {
                toast.error(res.message || UI_TEXT.RECENT.TEXT_99);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_98);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetail = async (id: number) => {
        try {
            const res = await getAdminStockReceiptDetail(id);
            if (res.success && res.data) {
                setSelectedReceipt(res.data);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_97);
        }
    };

    return (
        <div className="flex h-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">{UI_TEXT.RECENT.TEXT_96}</h1>
                    <p className="text-sm text-on-surface-variant">{UI_TEXT.RECENT.TEXT_95}</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:bg-primary/90"
                >
                    <Plus size={18} />
                    {UI_TEXT.RECENT.TEXT_94}
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-6 lg:flex-row">
                {/* List of Receipts */}
                <div className="flex w-full flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-1/3">
                    <div className="border-b border-outline-variant/30 bg-surface-container-low p-4 dark:border-slate-800 dark:bg-slate-800/60">
                        <h3 className="font-bold text-on-surface dark:text-white">{UI_TEXT.RECENT.TEXT_93}</h3>
                    </div>
                    <div className="hide-scrollbar flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex h-32 items-center justify-center">
                                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </div>
                        ) : receipts.length === 0 ? (
                            <div className="flex h-32 flex-col items-center justify-center text-on-surface-variant dark:text-slate-400">
                                <ClipboardList size={32} className="mb-2 opacity-50" />
                                <span className="text-sm">{UI_TEXT.RECENT.TEXT_92}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {receipts.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => handleViewDetail(r.id)}
                                        className={`flex flex-col gap-1 border-b border-outline-variant/20 p-4 text-left transition-colors hover:bg-surface-variant/50 dark:border-slate-800 dark:hover:bg-slate-800/50 ${selectedReceipt?.id === r.id ? "border-l-4 border-l-primary bg-primary/10 dark:bg-primary/20" : "border-l-4 border-l-transparent"}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-primary">{r.receiptCode}</span>
                                            <span className="text-xs text-on-surface-variant dark:text-slate-400">
                                                {r.createdAt ? formatDate(r.createdAt) : ""}
                                            </span>
                                        </div>
                                        <div className="line-clamp-1 text-sm text-on-surface dark:text-slate-200">{r.supplierName}</div>
                                        <div className="text-sm font-semibold text-error">{formatCurrency(r.totalAmount)}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Receipt Details */}
                <div className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-2/3">
                    {selectedReceipt ? (
                        <>
                            <div className="border-b border-outline-variant/30 bg-primary/5 p-6 dark:border-slate-800 dark:bg-primary/10">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-primary">
                                        {UI_TEXT.RECENT.TEXT_91}
                                        {selectedReceipt.receiptCode}
                                    </h2>
                                    <span className="rounded border border-outline-variant/50 bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        <Calendar size={12} className="mr-1 inline" />{" "}
                                        {selectedReceipt.createdAt ? formatDate(selectedReceipt.createdAt) : "N/A"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_90}</span>
                                        <p className="font-semibold text-on-surface dark:text-white">{selectedReceipt.supplierName}</p>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_89}</span>
                                        <p className="font-semibold text-on-surface dark:text-white">{selectedReceipt.createdBy || "Admin"}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_88}</span>
                                        <p className="italic text-on-surface dark:text-slate-300">{selectedReceipt.note || UI_TEXT.RECENT.TEXT_87}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <h3 className="mb-4 flex items-center gap-2 font-bold text-on-surface dark:text-white">
                                    <Package size={18} /> {UI_TEXT.RECENT.TEXT_86}
                                </h3>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-surface-container-low text-on-surface-variant dark:bg-slate-800 dark:text-slate-300">
                                        <tr>
                                            <th className="p-3 font-semibold">{UI_TEXT.RECENT.TEXT_85}</th>
                                            <th className="p-3 text-center font-semibold">{UI_TEXT.RECENT.TEXT_84}</th>
                                            <th className="p-3 text-right font-semibold">{UI_TEXT.RECENT.TEXT_83}</th>
                                            <th className="p-3 text-right font-semibold">{UI_TEXT.RECENT.TEXT_82}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedReceipt.details?.map((detail) => (
                                            <tr key={detail.id} className="border-b border-outline-variant/20 dark:border-slate-800">
                                                <td className="p-3 text-on-surface dark:text-slate-200">{detail.bookTitle}</td>
                                                <td className="p-3 text-center text-on-surface dark:text-slate-200">{detail.quantity}</td>
                                                <td className="p-3 text-right text-on-surface dark:text-slate-200">{formatCurrency(detail.unitPrice)}</td>
                                                <td className="p-3 text-right font-medium text-error">{formatCurrency(detail.totalPrice)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-primary/5 font-bold dark:bg-primary/10">
                                            <td colSpan={3} className="p-3 text-right uppercase text-on-surface dark:text-slate-200">
                                                {UI_TEXT.RECENT.TEXT_81}
                                            </td>
                                            <td className="p-3 text-right text-lg text-error">{formatCurrency(selectedReceipt.totalAmount)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-on-surface-variant dark:text-slate-400">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p>{UI_TEXT.RECENT.TEXT_80}</p>
                        </div>
                    )}
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateReceiptModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        setIsCreateModalOpen(false);
                        fetchReceipts();
                    }}
                />
            )}
        </div>
    );
}
