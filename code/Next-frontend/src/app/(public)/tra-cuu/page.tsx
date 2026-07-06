import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import { getGuestBorrowOrderDetail } from "@/services/borrow";
import type { BorrowOrderDetailResponseDto } from "@/types/borrow";

("use client");

export default function GuestLookupPage() {
    const [orderCode, setOrderCode] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orderDetail, setOrderDetail] = useState<BorrowOrderDetailResponseDto | null>(null);

    const isValidPhone = /^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone);
    const isFormValid = isValidPhone && orderCode.trim().length > 0;

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();

        let formattedCode = orderCode.trim().toUpperCase();
        if (formattedCode.startsWith("BO") && !formattedCode.startsWith("BO-")) {
            formattedCode = "BO-" + formattedCode.substring(2);
        }

        if (!formattedCode || !phone) {
            setError(UI_TEXT.BORROW.TRA_CUU.MISSING_INFO);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await getGuestBorrowOrderDetail(formattedCode, phone);
            if (response.data) {
                setOrderDetail(response.data);
            } else {
                setError(UI_TEXT.BORROW.TRA_CUU.NOT_FOUND);
            }
        } catch (err: any) {
            console.error("Lỗi tra cứu đơn mượn:", err);
            setError(err.response?.data?.message || API_ERRORS.SEARCH_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mx-auto flex min-h-[60vh] w-full max-w-container-max flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-6 text-center">
                    <MaterialIcon name="search" className="text-primary-600 dark:text-primary-400 mb-4 text-[48px]" />
                    <h1 className="font-display-sm text-display-sm text-on-surface dark:text-white">{UI_TEXT.BORROW.TRA_CUU.TITLE}</h1>
                    <p className="mt-2 font-body-md text-on-surface-variant dark:text-slate-400">{UI_TEXT.BORROW.TRA_CUU.DESC}</p>
                </div>

                <form onSubmit={handleLookup} className="space-y-6">
                    {error && (
                        <div className="rounded-lg bg-error-container p-4 text-on-error-container dark:bg-red-900/30 dark:text-red-300">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="error" />
                                <span className="font-body-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">
                            {UI_TEXT.BORROW.TRA_CUU.ORDER_CODE_LABEL}
                        </label>
                        <input
                            className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-3 font-body-md text-on-surface focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            type="text"
                            placeholder="VD: BO-123456"
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">
                            {UI_TEXT.BORROW.TRA_CUU.PHONE_LABEL}
                        </label>
                        <input
                            className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-3 font-body-md text-on-surface focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            type="tel"
                            placeholder="Số điện thoại lúc đặt"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className={`font-label-lg flex w-full items-center justify-center gap-2 rounded-full py-3 font-semibold text-white transition-all ${
                            isLoading || !isFormValid
                                ? "cursor-not-allowed bg-slate-300 dark:bg-slate-700 dark:text-slate-500"
                                : "hover:bg-primary-600 dark:bg-primary-600 bg-primary-700 dark:hover:bg-primary-500"
                        }`}
                    >
                        {isLoading ? <MaterialIcon name="sync" className="animate-spin" /> : <MaterialIcon name="search" />}
                        <span>{UI_TEXT.BORROW.TRA_CUU.SEARCH_BTN}</span>
                    </button>
                </form>

                <div className="mt-6 text-center font-body-sm text-on-surface-variant dark:text-slate-400">
                    {UI_TEXT.BORROW.TRA_CUU.HAVE_ACCOUNT}{" "}
                    <Link href="/login" className="font-semibold text-primary-700 hover:underline dark:text-primary-300">
                        {UI_TEXT.BORROW.TRA_CUU.LOGIN_NOW}
                    </Link>
                </div>
            </div>

            {orderDetail && (
                <div className="mt-8 w-full max-w-2xl rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="font-title-lg text-title-lg mb-4 text-on-surface dark:text-white">{UI_TEXT.BORROW.TRA_CUU.RESULT.TITLE}</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-on-surface-variant">{UI_TEXT.BORROW.TRA_CUU.RESULT.STATUS}</p>
                            <p className="font-semibold text-primary-700 dark:text-primary-300">{orderDetail.status}</p>
                        </div>
                        <div>
                            <p className="text-on-surface-variant">{UI_TEXT.BORROW.TRA_CUU.RESULT.DUE_DATE}</p>
                            <p className="font-medium text-on-surface dark:text-white">{orderDetail.dueDate || "—"}</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
