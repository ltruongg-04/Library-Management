"use client";

import { useEffect, useState } from "react";
import { Book, Calendar, DollarSign, User, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UI_TEXT } from "@/constants/ui-text";
import { AdminBorrowOrderDetailResponse, getAdminBorrowOrderDetail } from "@/services/adminBorrow";

const T = UI_TEXT.ADMIN_BORROW_MANAGEMENT.DETAIL_MODAL;

interface BorrowDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderCode: string | null;
}

export default function BorrowDetailModal({ isOpen, onClose, orderCode }: BorrowDetailModalProps) {
    const [detail, setDetail] = useState<AdminBorrowOrderDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && orderCode) {
            fetchDetail();
        } else {
            setDetail(null);
            setError(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, orderCode]);

    const fetchDetail = async () => {
        const startTime = Date.now();
        setIsLoading(true);
        setError(null);
        try {
            const res = await getAdminBorrowOrderDetail(orderCode!);
            if (res.success && res.data) {
                setDetail(res.data);
            } else {
                const elapsed = Date.now() - startTime;
                if (elapsed < 5000) {
                    await new Promise((resolve) => setTimeout(resolve, 5000 - elapsed));
                }
                setError(res.message || "Failed to load details");
            }
        } catch (err) {
            const elapsed = Date.now() - startTime;
            if (elapsed < 5000) {
                await new Promise((resolve) => setTimeout(resolve, 5000 - elapsed));
            }
            setError("Đã có lỗi xảy ra khi tải chi tiết");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const TRANSLATE_ORDER_STATUS: Record<string, string> = {
        PENDING: "Chờ xử lý",
        READY: "Chờ lấy sách",
        BORROWED: "Đang mượn",
        OVERDUE: "Quá hạn",
        RETURNED: "Đã trả",
        CANCELLED: "Đã hủy",
    };

    const TRANSLATE_BOOK_STATUS: Record<string, string> = {
        BORROWING: "Đang mượn",
        RETURNED: "Đã trả",
        OVERDUE: "Quá hạn",
        LOST: "Đã mất",
        CANCELLED: "Đã hủy",
        DAMAGED: "Hư hỏng",
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "N/A";
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-surface-container-lowest shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">{T.TITLE}</h2>
                        {orderCode && (
                            <p className="mt-1 text-sm text-on-surface-variant">
                                {T.ORDER_CODE}
                                {orderCode}
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Skeleton className="h-[140px] rounded-xl" />
                                <Skeleton className="h-[140px] rounded-xl" />
                            </div>
                            <div className="mt-4">
                                <Skeleton className="mb-4 h-6 w-1/3" />
                                <Skeleton className="h-16 w-full rounded-xl" />
                                <Skeleton className="mt-2 h-16 w-full rounded-xl" />
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex h-40 items-center justify-center text-error">{error}</div>
                    ) : detail ? (
                        <div className="flex flex-col gap-6">
                            {/* General Info Grid */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Customer Info */}
                                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-4">
                                    <div className="mb-3 flex items-center gap-2 font-medium text-on-surface">
                                        <User size={18} className="text-primary" />
                                        {T.SECTION_MEMBER}
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-on-surface-variant">{T.MEMBER_NAME}</span>{" "}
                                            <span className="font-medium">{detail.customerName}</span>
                                            {detail.isGuest && (
                                                <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                                                    {T.GUEST_BADGE}
                                                </span>
                                            )}
                                        </div>
                                        <p>
                                            <span className="text-on-surface-variant">{T.MEMBER_CODE}</span> <span>{detail.customerCode}</span>
                                        </p>
                                        <p>
                                            <span className="text-on-surface-variant">{T.MEMBER_PHONE}</span> <span>{detail.customerPhone}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-4">
                                    <div className="mb-3 flex items-center gap-2 font-medium text-on-surface">
                                        <Calendar size={18} className="text-secondary" />
                                        {T.SECTION_BORROW_INFO}
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="text-on-surface-variant">{T.CREATED_AT}</span> <span>{formatDate(detail.borrowDate)}</span>
                                        </p>
                                        <p>
                                            <span className="text-on-surface-variant">{T.DUE_DATE}</span> <span>{formatDate(detail.dueDate)}</span>
                                        </p>
                                        <p>
                                            <span className="text-on-surface-variant">{T.STATUS}</span>{" "}
                                            <span className="font-medium uppercase">{TRANSLATE_ORDER_STATUS[detail.status] || detail.status}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Books Table */}
                            <div className="overflow-hidden rounded-xl border border-outline-variant/30">
                                <div className="flex items-center gap-2 border-b border-outline-variant/30 bg-surface-container-low px-4 py-3 font-medium text-on-surface">
                                    <Book size={18} className="text-tertiary" />
                                    {T.SECTION_BOOKS}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-surface-container-lowest font-medium text-on-surface-variant">
                                            <tr>
                                                <th className="px-4 py-3">{T.BOOK_TITLE}</th>
                                                <th className="px-4 py-3">{T.BOOK_AUTHOR}</th>
                                                <th className="px-4 py-3">{T.BOOK_BARCODE}</th>
                                                <th className="px-4 py-3">{T.BOOK_STATUS}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
                                            {detail.items.map((item) => (
                                                <tr key={item.id} className="hover:bg-surface-container-low/30">
                                                    <td className="px-4 py-3 font-medium text-on-surface">{item.bookTitle}</td>
                                                    <td className="px-4 py-3 text-on-surface-variant">{item.bookAuthor}</td>
                                                    <td className="px-4 py-3">{item.barcode}</td>
                                                    <td className="px-4 py-3 text-xs font-medium uppercase text-on-surface-variant">
                                                        {TRANSLATE_BOOK_STATUS[item.status] || item.status}
                                                    </td>
                                                </tr>
                                            ))}
                                            {detail.items.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-6 text-center text-on-surface-variant">
                                                        {T.NO_BOOKS}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-4">
                                <div className="mb-3 flex items-center gap-2 font-medium text-on-surface">
                                    <DollarSign size={18} className="text-error" />
                                    {T.SECTION_FEE}
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">{T.FEE_RENT}</span>
                                        <span>{formatMoney(detail.subtotalFee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">{T.FEE_DISCOUNT}</span>
                                        <span>-{formatMoney(detail.discountAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">{T.FEE_DEPOSIT}</span>
                                        <span>{formatMoney(detail.totalDeposit)}</span>
                                    </div>
                                    <div className="mt-2 flex justify-between border-t border-outline-variant/30 pt-2 text-base font-bold">
                                        <span className="text-on-surface">{T.FEE_TOTAL}</span>
                                        <span className="text-primary">{formatMoney(detail.totalFee + detail.totalDeposit)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
