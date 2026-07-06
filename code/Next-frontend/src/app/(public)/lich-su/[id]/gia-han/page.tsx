"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import { SuccessModal } from "@/components/base/success-modal";
import { UI_TEXT } from "@/constants/ui-text";
import { RENEW_PAGE } from "@/constants/ui-text/public";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import { getBorrowOrderDetail, renewBorrowOrder } from "@/services/borrow";
import { BorrowOrderDetailResponseDto } from "@/types/borrow";

const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("vi-VN")}đ`;
};

const parseCurrency = (amountStr: string | null | undefined) => {
    if (!amountStr) return 0;
    return parseInt(amountStr.replace(/\D/g, ""), 10) || 0;
};

// Đơn giá gia hạn: 5.000đ/ngày (khớp với Backend)
const EXTENSION_FEE_PER_DAY = 5000;
const RENEWAL_OPTIONS = [
    { days: 5, fee: EXTENSION_FEE_PER_DAY * 5 },
    { days: 7, fee: EXTENSION_FEE_PER_DAY * 7 },
];

export default function RenewBookPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;

    const [orderData, setOrderData] = useState<BorrowOrderDetailResponseDto | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedDuration, setSelectedDuration] = useState(RENEWAL_OPTIONS[0].days);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);
                const res = await getBorrowOrderDetail(orderId);
                if (res.success && res.data) {
                    setOrderData(res.data);
                } else {
                    setError(res.message || API_ERRORS.FETCH_ERROR);
                }
            } catch (err) {
                setError(API_ERRORS.GENERIC_FETCH_ERROR);
            } finally {
                setIsFetching(false);
            }
        };

        if (orderId) {
            fetchData();
        }
    }, [orderId]);

    if (isFetching) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-body-md text-on-surface-variant">{UI_TEXT.COMMON.LOADING_DATA}</p>
            </div>
        );
    }

    if (error || !orderData || !orderData.books || orderData.books.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <MaterialIcon name="error_outline" className="mb-2 text-4xl text-error" />
                <p className="text-body-lg text-error">{error || API_ERRORS.NOT_FOUND_LOAN}</p>
                <Link href="/lich-su" className="mt-4 text-primary hover:underline">
                    {RENEW_PAGE.BACK_TO_HISTORY}
                </Link>
            </div>
        );
    }

    const book = orderData.books[0];

    // Tính phí quá hạn (chỉ để hiển thị cho rõ ràng)
    const LATE_FEE_PER_DAY = 10000;
    const currentLateFee = (orderData.overdueDays || 0) * LATE_FEE_PER_DAY;

    const selectedOption = RENEWAL_OPTIONS.find((opt) => opt.days === selectedDuration)!;

    // Tổng tiền phải trả ngay VNPay = Khoản nợ cũ (Tiền mượn cũ + Phạt quá hạn)
    // Dữ liệu này đã được Backend trừ đi số tiền từng thanh toán online
    const amountToPayNow = parseCurrency(orderData.total);

    const handleRenew = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await renewBorrowOrder(orderId, selectedDuration);
            if (res.success) {
                if (res.data && res.data.paymentUrl) {
                    window.location.href = res.data.paymentUrl;
                } else {
                    setIsSuccessModalOpen(true);
                }
            } else {
                setError(res.message || API_ERRORS.RENEW_FAILED);
                alert(res.message || API_ERRORS.RENEW_FAILED); // Optional: Use toast in future
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.message || API_ERRORS.RENEW_REQUEST_ERROR;
            setError(errMsg);
            alert(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsSuccessModalOpen(false);
        router.push("/lich-su");
    };

    return (
        <div className="mx-auto max-w-container-max px-lg pb-xl pt-6">
            {/* Breadcrumb */}
            <nav className="mb-lg flex items-center gap-xs text-body-sm text-on-surface-variant dark:text-slate-400">
                <Link href="/lich-su" className="transition-colors hover:text-primary dark:hover:text-primary-300">
                    {RENEW_PAGE.BREADCRUMB_ACCOUNT}
                </Link>
                <MaterialIcon name="chevron_right" className="text-[16px]" />
                <Link href="/lich-su" className="transition-colors hover:text-primary dark:hover:text-primary-300">
                    {RENEW_PAGE.BREADCRUMB_HISTORY}
                </Link>
                <MaterialIcon name="chevron_right" className="text-[16px]" />
                <span className="font-medium text-primary dark:text-primary-300">{RENEW_PAGE.BREADCRUMB_RENEW}</span>
            </nav>

            {/* Page Title */}
            <h1 className="mb-xl font-headline-lg text-headline-lg text-primary dark:text-white">{RENEW_PAGE.TITLE}</h1>

            {/* Section 1: Book Info Card */}
            <section className="mb-xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-lg md:flex-row">
                    {/* Cover Image */}
                    <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm dark:border-slate-700">
                        {book.imgSrc ? (
                            <Image src={book.imgSrc} alt={book.title} fill className="object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-surface-container-high dark:bg-slate-800">
                                <MaterialIcon name="book" className="text-[32px] text-outline dark:text-slate-500" />
                            </div>
                        )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-grow space-y-sm">
                        <div className="flex flex-wrap items-center gap-md">
                            <h2 className="font-title-md text-title-md text-on-surface dark:text-white">{book.title}</h2>
                            {orderData.overdueDays > 0 && (
                                <span className="flex items-center gap-xs rounded-full bg-error-container/30 px-sm py-1 font-label-caps text-label-caps text-error dark:bg-slate-800 dark:text-error-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-error dark:bg-error-300"></span>
                                    {RENEW_PAGE.OVERDUE_BADGE_PREFIX} ({orderData.overdueDays} {RENEW_PAGE.OVERDUE_DAYS_SUFFIX})
                                </span>
                            )}
                        </div>
                        <p className="text-body-sm text-on-surface-variant dark:text-slate-400">
                            {RENEW_PAGE.AUTHOR_PREFIX} {book.author}
                        </p>

                        {/* Dates Row */}
                        <div className="grid grid-cols-2 gap-lg pt-sm lg:grid-cols-3">
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{RENEW_PAGE.BORROW_DATE}</p>
                                <p className="text-body-md font-medium dark:text-white">{orderData.borrowDate}</p>
                            </div>
                            <div>
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{RENEW_PAGE.DUE_DATE}</p>
                                <p className="text-body-md font-medium text-error dark:text-error-300">{orderData.dueDate}</p>
                            </div>
                            <div className="hidden lg:block">
                                <p className="font-label-caps text-label-caps uppercase text-outline dark:text-slate-400">{RENEW_PAGE.ACTUAL_RETURN_DATE}</p>
                                <p className="text-body-md text-on-surface-variant dark:text-slate-400">
                                    {orderData.actualReturnDate ?? RENEW_PAGE.ACTUAL_RETURN_DASH}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Renewal Details */}
            <section className="mb-xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-lg font-title-md text-title-md text-on-surface dark:text-white">{RENEW_PAGE.DETAIL.HEADING}</h2>

                {/* Duration Selection + Summary */}
                <div className="flex flex-col gap-xl lg:flex-row lg:items-start lg:justify-between">
                    {/* Radio Options */}
                    <div>
                        <h3 className="mb-md font-title-md text-title-md text-on-surface dark:text-white">{RENEW_PAGE.DURATION.HEADING}</h3>
                        <div className="space-y-md">
                            {RENEWAL_OPTIONS.map((option) => (
                                <label key={option.days} className="flex cursor-pointer items-center gap-md" htmlFor={`duration-${option.days}`}>
                                    <input
                                        type="radio"
                                        id={`duration-${option.days}`}
                                        name="renewal-duration"
                                        value={option.days}
                                        checked={selectedDuration === option.days}
                                        onChange={() => setSelectedDuration(option.days)}
                                        className="h-5 w-5 cursor-pointer border-2 border-outline text-primary accent-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-500 dark:accent-primary-300"
                                    />
                                    <span className="text-body-md text-on-surface dark:text-white">
                                        {option.days} {RENEW_PAGE.DURATION.DAYS_SUFFIX} ({RENEW_PAGE.DURATION.FEE_PREFIX}
                                        {formatCurrency(option.fee)})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Cost Summary Panel */}
                    <div className="w-full space-y-md rounded-xl bg-surface-container-high p-lg dark:bg-slate-800 lg:max-w-sm">
                        {/* Total */}
                        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-md dark:border-slate-700">
                            <span className="font-title-md text-body-md font-semibold text-on-surface dark:text-white">
                                {RENEW_PAGE.SUMMARY.TOTAL_NEW_COST}
                            </span>
                            <span className="font-title-md text-title-md font-bold text-primary dark:text-primary-300">{formatCurrency(amountToPayNow)}</span>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-sm text-body-sm">
                            <div className="flex items-center justify-between text-on-surface-variant dark:text-slate-400">
                                <span>{RENEW_PAGE.DETAIL.UNPAID_RENTAL_FEE}</span>
                                <span>{formatCurrency(amountToPayNow - currentLateFee > 0 ? amountToPayNow - currentLateFee : 0)}</span>
                            </div>
                            {currentLateFee > 0 && (
                                <div className="flex items-center justify-between text-error dark:text-error-300">
                                    <span>
                                        {RENEW_PAGE.SUMMARY.LATE_FEE_LABEL} ({orderData.overdueDays} {RENEW_PAGE.OVERDUE_DAYS_SUFFIX}):
                                    </span>
                                    <span>{formatCurrency(currentLateFee)}</span>
                                </div>
                            )}
                            <div className="dark:text-secondary-400 mt-2 flex items-center justify-between border-t border-outline-variant/30 pt-2 font-medium text-secondary">
                                <span>
                                    {RENEW_PAGE.SUMMARY.RENEWAL_FEE_LABEL} {RENEW_PAGE.SUMMARY.POSTPAID_NOTE}
                                </span>
                                <span>{formatCurrency(selectedOption.fee)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Confirm Button */}
            <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-title-md text-title-md text-on-primary shadow-sm transition-all hover:bg-primary-container hover:text-on-primary-container active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                id="confirm-renewal-btn"
                onClick={handleRenew}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {UI_TEXT.COMMON.PROCESSING}
                    </>
                ) : amountToPayNow > 0 ? (
                    `Thanh toán ${formatCurrency(amountToPayNow)} & Gia hạn`
                ) : (
                    RENEW_PAGE.CONFIRM_BUTTON
                )}
            </button>

            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseModal}
                title="Gia hạn thành công"
                message={`Yêu cầu gia hạn sách "${book.title}" thêm ${selectedDuration} ngày đã được gửi thành công.`}
            />
        </div>
    );
}
