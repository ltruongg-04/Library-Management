"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Receipt, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { ADMIN_BORROW_MANAGEMENT } from "@/constants/ui-text/admin/borrow-management";
import { formatCurrency } from "@/lib/utils";
import { type ReturnBookResponse, confirmReturnCashPayment, generateReturnVnPayUrl, getAdminBorrowOrderDetail } from "@/services/adminBorrow";

const TEXT = ADMIN_BORROW_MANAGEMENT.RETURN_INVOICE_MODAL;

interface ReturnInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceData: ReturnBookResponse | null;
}

export default function ReturnInvoiceModal({ isOpen, onClose, invoiceData }: ReturnInvoiceModalProps) {
    const [vnpayUrl, setVnpayUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isConfirmingCash, setIsConfirmingCash] = useState(false);
    const [isCashConfirmed, setIsCashConfirmed] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isOpen && invoiceData?.orderCode && !isCashConfirmed && vnpayUrl) {
            // Poll every 3 seconds to check if status changed to RETURNED or PARTIALLY_RETURNED
            interval = setInterval(async () => {
                try {
                    const res = await getAdminBorrowOrderDetail(invoiceData.orderCode);
                    if (res.success && res.data) {
                        const status = res.data.status;
                        if (status === "RETURNED" || status === "PARTIALLY_RETURNED") {
                            toast.success(TEXT.SUCCESS_VNPAY_POLLING);
                            setIsCashConfirmed(true);
                            clearInterval(interval);
                            // Auto close modal to refresh the list
                            setTimeout(() => {
                                onClose();
                            }, 2000);
                        }
                    }
                } catch (error) {
                    // Ignore polling errors
                }
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isOpen, invoiceData?.orderCode, isCashConfirmed, vnpayUrl, onClose]);

    const handleGenerateVnPay = async () => {
        if (!invoiceData?.bookReturnId) return;
        setIsGenerating(true);
        try {
            const res = await generateReturnVnPayUrl(invoiceData.bookReturnId);
            if (res.success && res.data) {
                setVnpayUrl(res.data);
                toast.success(TEXT.SUCCESS_VNPAY);
            } else {
                toast.error(res.message || TEXT.ERROR_VNPAY);
            }
        } catch (error) {
            toast.error(TEXT.ERROR_CONN_VNPAY);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleConfirmCash = async () => {
        if (!invoiceData?.bookReturnId) return;
        setIsConfirmingCash(true);
        try {
            const res = await confirmReturnCashPayment(invoiceData.bookReturnId);
            if (res.success) {
                toast.success(TEXT.SUCCESS_CASH);
                setIsCashConfirmed(true);
            } else {
                toast.error(res.message || TEXT.ERROR_CASH);
            }
        } catch (error) {
            toast.error(TEXT.ERROR_CONN_CASH);
        } finally {
            setIsConfirmingCash(false);
        }
    };

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setVnpayUrl(null);
            setIsCashConfirmed(false);
            setIsGenerating(false);
            setIsConfirmingCash(false);
        }
    }, [isOpen]);

    if (!isOpen || !invoiceData) return null;

    const isRefund = invoiceData.totalAmountToPay < 0;
    const absAmount = Math.abs(invoiceData.totalAmountToPay);
    const requiresAction = invoiceData.totalAmountToPay !== 0 && !isCashConfirmed;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="animate-in zoom-in-95 flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl duration-200">
                {/* Header */}
                <div className="relative flex flex-col items-center justify-center bg-primary/10 px-6 py-8 text-center">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                    >
                        <X size={20} />
                    </button>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary/30">
                        <CheckCircle2 size={36} />
                    </div>
                    <h2 className="text-2xl font-bold text-on-surface">{TEXT.TITLE}</h2>
                    <p className="mt-1 text-sm text-on-surface-variant">
                        {TEXT.ORDER_CODE} {invoiceData.orderCode}
                    </p>
                </div>

                {/* Body - Invoice Details */}
                <div className="max-h-[70vh] flex-1 overflow-y-auto p-6">
                    <div className="mb-4 flex items-center gap-2 font-semibold text-on-surface">
                        <Receipt size={18} className="text-primary" />
                        {TEXT.BOOK_DETAILS}
                    </div>

                    <div className="mb-6 space-y-2">
                        {invoiceData.details?.map((detail, idx) => (
                            <div key={idx} className="flex items-start justify-between rounded-lg border border-outline-variant/20 bg-surface p-3 text-sm">
                                <div className="flex-1 pr-4">
                                    <p className="line-clamp-1 font-medium text-on-surface">{detail.bookTitle}</p>
                                    <p className="mt-1 text-xs text-on-surface-variant">
                                        {TEXT.LABEL_CODE} {detail.barcode} • {TEXT.LABEL_STATUS}{" "}
                                        {detail.conditionStatus === "NORMAL"
                                            ? TEXT.COND_NORMAL
                                            : detail.conditionStatus === "DAMAGED"
                                              ? TEXT.COND_DAMAGED
                                              : TEXT.COND_LOST}
                                    </p>
                                    {detail.note && (
                                        <p className="mt-1 text-xs italic text-on-surface-variant">
                                            {TEXT.LABEL_NOTE} {detail.note}
                                        </p>
                                    )}
                                </div>
                                {detail.fineAmount > 0 && (
                                    <div className="whitespace-nowrap text-right">
                                        <p className="text-xs text-on-surface-variant">{TEXT.LABEL_FINE}</p>
                                        <p className="font-medium text-error">{formatCurrency(detail.fineAmount)}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mb-4 flex items-center gap-2 font-semibold text-on-surface">
                        <Receipt size={18} className="text-primary" />
                        {TEXT.COST_SUMMARY}
                    </div>

                    <div className="space-y-3 rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-on-surface-variant">{TEXT.RENT_FEE}</span>
                            <span className="font-medium text-on-surface">{formatCurrency(invoiceData.subtotalFee)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-on-surface-variant">{TEXT.FINE_FEE}</span>
                            <span className="font-medium text-error">{formatCurrency(invoiceData.totalFineAmount)}</span>
                        </div>
                        <div className="my-2 h-px w-full bg-outline-variant/30"></div>
                        <div className="flex justify-between text-sm">
                            <span className="text-on-surface-variant">{TEXT.TOTAL_COST}</span>
                            <span className="font-medium text-on-surface">{formatCurrency(invoiceData.subtotalFee + invoiceData.totalFineAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-on-surface-variant">{TEXT.DEPOSIT_PAID}</span>
                            <span className="text-success font-medium">-{formatCurrency(invoiceData.totalDeposit)}</span>
                        </div>
                    </div>

                    <div
                        className={`mt-6 rounded-xl border p-4 ${isRefund ? "bg-success/10 border-success/20" : invoiceData.totalAmountToPay > 0 ? "border-error/20 bg-error/10" : "border-outline-variant/30 bg-surface-container-low"}`}
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className={`font-semibold ${isRefund ? "text-success" : invoiceData.totalAmountToPay > 0 ? "text-error" : "text-on-surface"}`}
                            >
                                {isRefund ? TEXT.REFUND_AMOUNT : invoiceData.totalAmountToPay > 0 ? TEXT.COLLECT_AMOUNT : TEXT.PAID_AMOUNT}
                            </span>
                            <span
                                className={`text-xl font-bold ${isRefund ? "text-success" : invoiceData.totalAmountToPay > 0 ? "text-error" : "text-on-surface"}`}
                            >
                                {formatCurrency(absAmount)}
                            </span>
                        </div>
                        {requiresAction && invoiceData.totalAmountToPay > 0 && <p className="mt-2 text-xs text-error/80">{TEXT.REQUIRE_COLLECT}</p>}
                        {requiresAction && isRefund && <p className="text-success/80 mt-2 text-xs">{TEXT.REQUIRE_REFUND}</p>}
                        {isCashConfirmed && (
                            <div className="text-success mt-3 flex items-center gap-1.5 text-sm font-medium">
                                <CheckCircle2 size={16} /> {TEXT.CASH_CONFIRMED}
                            </div>
                        )}
                    </div>

                    {requiresAction && invoiceData.totalAmountToPay > 0 && (
                        <div className="mt-4 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleConfirmCash}
                                    disabled={isConfirmingCash || isGenerating}
                                    className="flex-1 rounded-lg border border-primary px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5 disabled:opacity-50"
                                >
                                    {isConfirmingCash ? TEXT.STATUS_PROCESSING : TEXT.BTN_CASH_PAY}
                                </button>
                                <button
                                    onClick={handleGenerateVnPay}
                                    disabled={isConfirmingCash || isGenerating || !!vnpayUrl}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isGenerating ? TEXT.STATUS_GENERATING : TEXT.BTN_VNPAY}
                                </button>
                            </div>

                            {vnpayUrl && (
                                <div className="animate-in slide-in-from-top-4 mt-2 flex flex-col items-center rounded-xl border border-blue-200 bg-blue-50 p-4">
                                    <p className="mb-3 text-sm font-medium text-blue-800">{TEXT.SCAN_VNPAY}</p>
                                    <div className="rounded-lg bg-white p-2 shadow-sm">
                                        <QRCodeSVG value={vnpayUrl} size={160} level="H" includeMargin={true} />
                                    </div>
                                    <a
                                        href={vnpayUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 text-xs text-blue-600 underline hover:text-blue-800"
                                    >
                                        {TEXT.OPEN_LINK_NEW_TAB}
                                    </a>
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-blue-600">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                        <span>{TEXT.WAITING_CONFIRMATION}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {requiresAction && isRefund && (
                        <div className="mt-4">
                            <button
                                onClick={handleConfirmCash}
                                disabled={isConfirmingCash}
                                className="bg-success hover:bg-success/90 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
                            >
                                {isConfirmingCash ? TEXT.STATUS_PROCESSING : TEXT.BTN_CASH_REFUND}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 border-t border-outline-variant/30 bg-surface-container-lowest px-6 py-4">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary/90"
                    >
                        {TEXT.BTN_COMPLETE}
                    </button>
                </div>
            </div>
        </div>
    );
}
