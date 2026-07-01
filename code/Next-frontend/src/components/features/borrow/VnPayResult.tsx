"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

interface VnPayResultProps {
    status: "success" | "failed";
    orderCode: string | null;
}

export default function VnPayResult({ status, orderCode }: VnPayResultProps) {
    const { VNPAY_RESULT } = UI_TEXT.BORROW;
    const isSuccess = status === "success";
    const texts = isSuccess ? VNPAY_RESULT.SUCCESS : VNPAY_RESULT.FAILED;

    return (
        <div className="relative flex min-h-[60vh] w-full flex-grow items-center justify-center overflow-hidden px-4 py-12">
            {/* Ambient Background */}
            <div className={`absolute left-10 top-1/4 h-64 w-64 animate-pulse rounded-full blur-3xl ${isSuccess ? "bg-primary-500/5" : "bg-red-500/5"}`}></div>
            <div
                className={`absolute bottom-1/4 right-10 h-96 w-96 animate-pulse rounded-full blur-3xl ${isSuccess ? "bg-secondary-500/5" : "bg-orange-500/5"}`}
                style={{ animationDelay: "-2s" }}
            ></div>

            {/* Result Card */}
            <div className="z-10 w-full max-w-2xl">
                <div className="transform rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.01] dark:border-slate-700 dark:bg-slate-900 md:p-12">
                    {/* Icon */}
                    <div className="mb-8 flex justify-center">
                        <div
                            className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-[0_0_20px_2px] ${
                                isSuccess
                                    ? "bg-primary-fixed/30 shadow-primary-500/20 dark:bg-primary-900/30"
                                    : "bg-red-100/30 shadow-red-500/20 dark:bg-red-900/30"
                            }`}
                        >
                            <div
                                className={`absolute inset-0 animate-ping rounded-full opacity-25 ${isSuccess ? "bg-secondary-container/20" : "bg-red-200/20"}`}
                            ></div>
                            <MaterialIcon
                                name={isSuccess ? "check_circle" : "cancel"}
                                className={`scale-125 text-[48px] transition-transform delay-300 duration-500 ${
                                    isSuccess ? "text-primary-700 dark:text-primary-300" : "text-red-500 dark:text-red-400"
                                }`}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h1
                        className={`mb-6 font-display-lg text-3xl tracking-tight md:text-4xl ${
                            isSuccess ? "text-primary-700 dark:text-primary-300" : "text-red-600 dark:text-red-400"
                        }`}
                    >
                        {texts.TITLE}
                    </h1>

                    {/* Order Code Pill */}
                    {orderCode && (
                        <div className="mb-8 inline-flex items-center rounded-full bg-surface-container-high px-4 py-1.5 dark:bg-slate-800">
                            <span className="text-secondary-600 dark:text-secondary-400 mr-2 font-label-caps text-label-caps font-bold uppercase">
                                {texts.ORDER_CODE}:
                            </span>
                            <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">{orderCode}</span>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mx-auto mb-10 max-w-lg">
                        <p className="font-body-md leading-relaxed text-on-surface-variant dark:text-slate-300">{texts.DESCRIPTION}</p>
                    </div>

                    {/* VNPay Badge */}
                    <div
                        className={`mx-auto mb-10 inline-flex items-center gap-2 rounded-lg px-4 py-2 ${
                            isSuccess
                                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                    >
                        <MaterialIcon name={isSuccess ? "verified" : "warning"} className="text-base" />
                        <span className="font-body-sm font-semibold">{VNPAY_RESULT.BRAND}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {isSuccess ? (
                            <>
                                <Link
                                    href="/lich-su"
                                    className="hover:bg-primary-800 w-full rounded-lg bg-primary-700 px-8 py-3 text-center font-title-md text-white shadow-md transition-all active:scale-95 sm:w-auto"
                                >
                                    {VNPAY_RESULT.SUCCESS.VIEW_LOANS}
                                </Link>
                                <Link
                                    href="/"
                                    className="border-secondary-600 text-secondary-600 dark:border-secondary-400 dark:text-secondary-400 w-full rounded-lg border-2 px-8 py-3 text-center font-title-md transition-all hover:bg-secondary-50 active:scale-95 dark:hover:bg-slate-800 sm:w-auto"
                                >
                                    {VNPAY_RESULT.SUCCESS.CONTINUE_BROWSING}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/"
                                    className="hover:bg-primary-800 w-full rounded-lg bg-primary-700 px-8 py-3 text-center font-title-md text-white shadow-md transition-all active:scale-95 sm:w-auto"
                                >
                                    {VNPAY_RESULT.FAILED.TRY_AGAIN}
                                </Link>
                                <Link
                                    href="/"
                                    className="w-full rounded-lg border-2 border-outline-variant px-8 py-3 text-center font-title-md text-on-surface-variant transition-all hover:bg-surface-container-high active:scale-95 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 sm:w-auto"
                                >
                                    {VNPAY_RESULT.FAILED.BACK_TO_HOME}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
