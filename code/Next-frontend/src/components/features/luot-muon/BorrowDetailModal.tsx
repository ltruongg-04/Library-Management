"use client";

import { useEffect, useState } from "react";
import { X, User, Calendar, Book, DollarSign } from "lucide-react";
import { getAdminBorrowOrderDetail, AdminBorrowOrderDetailResponse } from "@/services/adminBorrow";

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
        setIsLoading(true);
        setError(null);
        try {
            const res = await getAdminBorrowOrderDetail(orderCode!);
            if (res.success && res.data) {
                setDetail(res.data);
            } else {
                setError(res.message || "Failed to load details");
            }
        } catch (err) {
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
                        <h2 className="text-xl font-bold text-on-surface">Chi tiết lượt mượn</h2>
                        {orderCode && <p className="mt-1 text-sm text-on-surface-variant">Mã phiếu: {orderCode}</p>}
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
                        <div className="flex h-40 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
                                        Thông tin người mượn
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-on-surface-variant">Họ tên:</span> <span className="font-medium">{detail.customerName}</span></p>
                                        <p><span className="text-on-surface-variant">Mã thẻ/SĐT:</span> <span>{detail.customerCode}</span></p>
                                        <p><span className="text-on-surface-variant">Số điện thoại:</span> <span>{detail.customerPhone}</span></p>
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-4">
                                    <div className="mb-3 flex items-center gap-2 font-medium text-on-surface">
                                        <Calendar size={18} className="text-secondary" />
                                        Thông tin mượn trả
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-on-surface-variant">Ngày tạo:</span> <span>{formatDate(detail.borrowDate)}</span></p>
                                        <p><span className="text-on-surface-variant">Ngày hẹn trả:</span> <span>{formatDate(detail.dueDate)}</span></p>
                                        <p><span className="text-on-surface-variant">Trạng thái:</span> <span className="font-medium uppercase">{TRANSLATE_ORDER_STATUS[detail.status] || detail.status}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Books Table */}
                            <div className="rounded-xl border border-outline-variant/30 overflow-hidden">
                                <div className="bg-surface-container-low px-4 py-3 flex items-center gap-2 font-medium text-on-surface border-b border-outline-variant/30">
                                    <Book size={18} className="text-tertiary" />
                                    Danh sách sách mượn
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-surface-container-lowest text-on-surface-variant font-medium">
                                            <tr>
                                                <th className="px-4 py-3">Tên sách</th>
                                                <th className="px-4 py-3">Tác giả</th>
                                                <th className="px-4 py-3">Mã vạch</th>
                                                <th className="px-4 py-3">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
                                            {detail.items.map((item) => (
                                                <tr key={item.id} className="hover:bg-surface-container-low/30">
                                                    <td className="px-4 py-3 font-medium text-on-surface">{item.bookTitle}</td>
                                                    <td className="px-4 py-3 text-on-surface-variant">{item.bookAuthor}</td>
                                                    <td className="px-4 py-3">{item.barcode}</td>
                                                    <td className="px-4 py-3 uppercase text-xs font-medium text-on-surface-variant">{TRANSLATE_BOOK_STATUS[item.status] || item.status}</td>
                                                </tr>
                                            ))}
                                            {detail.items.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-6 text-center text-on-surface-variant">Không có dữ liệu sách</td>
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
                                    Chi phí
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">Tiền thuê:</span>
                                        <span>{formatMoney(detail.subtotalFee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">Giảm giá:</span>
                                        <span>-{formatMoney(detail.discountAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">Tiền cọc:</span>
                                        <span>{formatMoney(detail.totalDeposit)}</span>
                                    </div>
                                    <div className="mt-2 border-t border-outline-variant/30 pt-2 flex justify-between font-bold text-base">
                                        <span className="text-on-surface">Tổng cộng:</span>
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
