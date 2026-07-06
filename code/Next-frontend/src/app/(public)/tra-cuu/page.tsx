"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import { useAuth } from "@/providers/auth";
import { getGuestBorrowOrders, requestGuestLookupOtp } from "@/services/borrow";
import type { BorrowOrderDetailResponseDto } from "@/types/borrow";

export default function GuestLookupPage() {
    const { isAuthenticated } = useAuth();
    const [lookupMethod, setLookupMethod] = useState<"ORDER_CODE" | "EMAIL">("ORDER_CODE");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orderList, setOrderList] = useState<BorrowOrderDetailResponseDto[]>([]);

    const isEmail = lookupMethod === "EMAIL";
    const isFormValid = searchQuery.trim().length > 0 && (!isEmail || !isOtpSent || (isOtpSent && otp.trim().length >= 6));

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();

        let identifier = searchQuery.trim();
        if (identifier.toUpperCase().startsWith("BO") && !identifier.toUpperCase().startsWith("BO-")) {
            identifier = "BO-" + identifier.substring(2);
        }

        if (!identifier) {
            setError(UI_TEXT.BORROW.TRA_CUU.MISSING_INFO);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (isEmail && !isOtpSent) {
                // Request OTP
                await requestGuestLookupOtp(identifier);
                setIsOtpSent(true);
                toast.success(UI_TEXT.BORROW.TRA_CUU.OTP_SENT);
            } else {
                // Lookup
                if (isEmail && (!otp || otp.trim().length === 0)) {
                    setError(UI_TEXT.BORROW.TRA_CUU.MISSING_OTP);
                    setIsLoading(false);
                    return;
                }

                const response = await getGuestBorrowOrders(identifier, isEmail ? otp.trim() : undefined);
                if (response.data && response.data.length > 0) {
                    setOrderList(response.data);
                } else {
                    setError(UI_TEXT.BORROW.TRA_CUU.NOT_FOUND);
                    setOrderList([]);
                }
            }
        } catch (err: any) {
            console.error("Lỗi tra cứu đơn mượn:", err);
            setError(err.response?.data?.message || API_ERRORS.SEARCH_FAILED);
            if (!isOtpSent) setOrderList([]);
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
                    <div className="mb-6 flex w-full rounded-lg bg-surface-container-highest p-1 dark:bg-slate-800">
                        <button
                            type="button"
                            className={`font-label-md flex-1 rounded-md py-2 transition-colors ${
                                lookupMethod === "ORDER_CODE"
                                    ? "bg-surface-container-lowest text-on-surface shadow-sm dark:bg-slate-700 dark:text-white"
                                    : "text-on-surface-variant hover:text-on-surface dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                            onClick={() => {
                                setLookupMethod("ORDER_CODE");
                                setSearchQuery("");
                                setError(null);
                                setOrderList([]);
                                setIsOtpSent(false);
                                setOtp("");
                            }}
                        >
                            {UI_TEXT.BORROW.TRA_CUU.METHOD_ORDER_CODE}
                        </button>
                        <button
                            type="button"
                            className={`font-label-md flex-1 rounded-md py-2 transition-colors ${
                                lookupMethod === "EMAIL"
                                    ? "bg-surface-container-lowest text-on-surface shadow-sm dark:bg-slate-700 dark:text-white"
                                    : "text-on-surface-variant hover:text-on-surface dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                            onClick={() => {
                                setLookupMethod("EMAIL");
                                setSearchQuery("");
                                setError(null);
                                setIsOtpSent(false);
                                setOtp("");
                                setOrderList([]);
                            }}
                        >
                            {UI_TEXT.BORROW.TRA_CUU.METHOD_EMAIL}
                        </button>
                    </div>

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
                            {lookupMethod === "ORDER_CODE" ? UI_TEXT.BORROW.TRA_CUU.SEARCH_LABEL_ORDER : UI_TEXT.BORROW.TRA_CUU.SEARCH_LABEL_EMAIL}
                        </label>
                        <input
                            className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-3 font-body-md text-on-surface focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            type="text"
                            placeholder={
                                lookupMethod === "ORDER_CODE"
                                    ? UI_TEXT.BORROW.TRA_CUU.SEARCH_PLACEHOLDER_ORDER
                                    : UI_TEXT.BORROW.TRA_CUU.SEARCH_PLACEHOLDER_EMAIL
                            }
                            value={searchQuery}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchQuery(val);
                                if (isOtpSent) {
                                    setIsOtpSent(false);
                                    setOtp("");
                                }
                                if (val.trim() === "") {
                                    setOrderList([]);
                                }
                            }}
                        />
                    </div>

                    {lookupMethod === "EMAIL" && isOtpSent && (
                        <div className="space-y-1">
                            <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">
                                {UI_TEXT.BORROW.TRA_CUU.OTP_LABEL}
                            </label>
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-3 font-body-md text-on-surface focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                type="text"
                                placeholder={UI_TEXT.BORROW.TRA_CUU.OTP_PLACEHOLDER}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className={`font-label-lg flex w-full items-center justify-center gap-2 rounded-full py-3 font-semibold text-white transition-all ${
                            isLoading || !isFormValid
                                ? "cursor-not-allowed bg-slate-300 dark:bg-slate-700 dark:text-slate-500"
                                : "hover:bg-primary-600 dark:bg-primary-600 bg-primary-700 dark:hover:bg-primary-500"
                        }`}
                    >
                        {isLoading ? (
                            <MaterialIcon name="sync" className="animate-spin" />
                        ) : isEmail && !isOtpSent ? (
                            <MaterialIcon name="mail" />
                        ) : (
                            <MaterialIcon name="search" />
                        )}
                        <span>{isEmail && !isOtpSent ? UI_TEXT.BORROW.TRA_CUU.SEND_OTP_BTN : UI_TEXT.BORROW.TRA_CUU.SEARCH_BTN}</span>
                    </button>
                </form>

                {!isAuthenticated && (
                    <div className="mt-6 text-center font-body-sm text-on-surface-variant dark:text-slate-400">
                        {UI_TEXT.BORROW.TRA_CUU.HAVE_ACCOUNT}{" "}
                        <Link href="/login" className="font-semibold text-primary-700 hover:underline dark:text-primary-300">
                            {UI_TEXT.BORROW.TRA_CUU.LOGIN_NOW}
                        </Link>
                    </div>
                )}
            </div>

            {orderList.length > 0 && (
                <div className="mt-8 w-full max-w-2xl space-y-4">
                    <h2 className="font-title-lg text-title-lg mb-4 text-center text-on-surface dark:text-white">{UI_TEXT.BORROW.TRA_CUU.RESULT.TITLE}</h2>
                    {orderList.map((order, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-title-md text-title-md text-on-surface dark:text-white">
                                    {UI_TEXT.BORROW.TRA_CUU.ORDER_CODE_LABEL.replace(":", "")}:{" "}
                                    <span className="text-primary-700 dark:text-primary-300">{order.id}</span>
                                </h3>
                                <span className="font-label-md text-primary-800 rounded-full bg-primary-100 px-3 py-1 dark:bg-primary-900/30 dark:text-primary-300">
                                    {order.status}
                                </span>
                            </div>
                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-on-surface-variant">{UI_TEXT.BORROW.TRA_CUU.RESULT.NAME}</p>
                                        <p className="font-medium text-on-surface dark:text-white">{order.customerName || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-on-surface-variant">{UI_TEXT.BORROW.TRA_CUU.RESULT.PHONE}</p>
                                        <p className="font-medium text-on-surface dark:text-white">{order.customerPhone || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-on-surface-variant">{UI_TEXT.BORROW.TRA_CUU.RESULT.BORROW_DATE}</p>
                                        <p className="font-medium text-on-surface dark:text-white">{order.borrowDate || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-on-surface-variant">{UI_TEXT.BORROW.TRA_CUU.RESULT.DUE_DATE}</p>
                                        <p className="font-medium text-on-surface dark:text-white">{order.dueDate || "—"}</p>
                                    </div>
                                </div>
                                <div className="border-t border-outline-variant/30 pt-4 dark:border-slate-700">
                                    <p className="mb-2 text-on-surface-variant">{UI_TEXT.BORROW.TRA_CUU.RESULT.BOOKS}</p>
                                    <ul className="list-inside list-disc space-y-1">
                                        {order.books &&
                                            order.books.map((book, bIdx) => (
                                                <li key={bIdx} className="font-medium text-on-surface dark:text-white">
                                                    {book.title}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 dark:border-slate-700">
                                    <span className="font-title-sm text-title-sm text-on-surface dark:text-white">{UI_TEXT.BORROW.TRA_CUU.RESULT.TOTAL}</span>
                                    <span className="font-title-md text-title-md text-primary-700 dark:text-primary-300">{order.total || "—"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
