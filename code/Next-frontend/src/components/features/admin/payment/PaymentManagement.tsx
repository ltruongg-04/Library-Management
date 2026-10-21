"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminPayment, getAdminPayments, refundAdminPayment } from "@/services/adminPayment";

export default function PaymentManagement() {
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefunding, setIsRefunding] = useState<number | null>(null);

    // Pagination & Search
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchCode, setSearchCode] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAdminPayments(page, 15, activeSearch);
            if (res.success && res.data) {
                setPayments(res.data.content);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_151);
        } finally {
            setIsLoading(false);
        }
    }, [page, activeSearch]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleSearch = () => {
        setPage(0);
        setActiveSearch(searchCode);
    };

    const handleRefund = async (id: number) => {
        if (!confirm(UI_TEXT.RECENT.TEXT_150)) return;

        setIsRefunding(id);
        try {
            const res = await refundAdminPayment(id);
            if (res.success) {
                toast.success(UI_TEXT.RECENT.TEXT_149);
                fetchPayments();
            } else {
                toast.error(res.message || UI_TEXT.RECENT.TEXT_148);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_147);
        } finally {
            setIsRefunding(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return <span className="bg-success/10 text-success rounded px-2 py-1 text-xs font-semibold">{UI_TEXT.RECENT.TEXT_146}</span>;
            case "REFUNDED":
                return <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{UI_TEXT.RECENT.TEXT_145}</span>;
            case "PENDING":
                return <span className="bg-warning/10 text-warning rounded px-2 py-1 text-xs font-semibold">{UI_TEXT.RECENT.TEXT_144}</span>;
            case "FAILED":
                return <span className="rounded bg-error/10 px-2 py-1 text-xs font-semibold text-error">{UI_TEXT.RECENT.TEXT_143}</span>;
            default:
                return <span className="rounded bg-surface-variant px-2 py-1 text-xs font-semibold">{status}</span>;
        }
    };

    return (
        <div className="flex h-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">{UI_TEXT.RECENT.TEXT_142}</h1>
                    <p className="text-sm text-on-surface-variant">{UI_TEXT.RECENT.TEXT_141}</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Mã giao dịch..."
                        className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 rounded-lg bg-surface-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-outline-variant/30 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        <Search size={18} /> {UI_TEXT.RECENT.TEXT_140}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-surface-container-low text-on-surface-variant dark:bg-slate-800/80 dark:text-slate-300">
                            <tr>
                                <th className="p-4 font-semibold">{UI_TEXT.RECENT.TEXT_139}</th>
                                <th className="p-4 font-semibold">{UI_TEXT.RECENT.TEXT_138}</th>
                                <th className="p-4 font-semibold">{UI_TEXT.RECENT.TEXT_137}</th>
                                <th className="p-4 text-right font-semibold">{UI_TEXT.RECENT.TEXT_136}</th>
                                <th className="p-4 text-center font-semibold">{UI_TEXT.RECENT.TEXT_135}</th>
                                <th className="p-4 font-semibold">{UI_TEXT.RECENT.TEXT_134}</th>
                                <th className="p-4 font-semibold">{UI_TEXT.RECENT.TEXT_133}</th>
                                <th className="p-4 text-center font-semibold">{UI_TEXT.RECENT.TEXT_132}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center">
                                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center text-on-surface-variant">
                                        <SearchX size={32} className="mx-auto mb-2 opacity-50" />
                                        {UI_TEXT.RECENT.TEXT_131}
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="border-b border-outline-variant/20 transition-colors hover:bg-surface-variant/30 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="p-4 font-medium text-primary">{payment.transactionCode || "N/A"}</td>
                                        <td className="p-4 text-on-surface dark:text-slate-200">{payment.orderCode || "N/A"}</td>
                                        <td className="p-4 text-on-surface dark:text-slate-200">
                                            {payment.paymentType === "DEPOSIT"
                                                ? UI_TEXT.RECENT.TEXT_130
                                                : payment.paymentType === "FINE"
                                                  ? UI_TEXT.RECENT.TEXT_129
                                                  : payment.paymentType}
                                        </td>
                                        <td className="p-4 text-right font-semibold text-error">{formatCurrency(payment.amount)}</td>
                                        <td className="p-4 text-center">{getStatusBadge(payment.paymentStatus)}</td>
                                        <td className="p-4 text-xs text-on-surface-variant dark:text-slate-400">
                                            {payment.paymentDate ? formatDate(payment.paymentDate) : "N/A"}
                                        </td>
                                        <td className="p-4 text-on-surface-variant dark:text-slate-400">{payment.processedByName || "-"}</td>
                                        <td className="p-4 text-center">
                                            {payment.paymentStatus === "PAID" && payment.paymentType === "DEPOSIT" && (
                                                <button
                                                    onClick={() => handleRefund(payment.id)}
                                                    disabled={isRefunding === payment.id}
                                                    className="inline-flex items-center gap-1 rounded bg-surface-variant px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-outline-variant/30 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                                    title={UI_TEXT.RECENT.TEXT_150}
                                                >
                                                    {isRefunding === payment.id ? (
                                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                    ) : (
                                                        <RotateCcw size={14} />
                                                    )}
                                                    {UI_TEXT.RECENT.TEXT_128}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-outline-variant/30 bg-surface px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
                        <span className="text-sm text-on-surface-variant dark:text-slate-400">
                            Trang {page + 1} / {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className="rounded border border-outline-variant px-3 py-1 text-sm text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                {UI_TEXT.RECENT.TEXT_127}
                            </button>
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(page + 1)}
                                className="rounded border border-outline-variant px-3 py-1 text-sm text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
