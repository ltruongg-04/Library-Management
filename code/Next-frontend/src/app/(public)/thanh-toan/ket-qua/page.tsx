"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VnPayResult from "@/components/features/borrow/VnPayResult";
import { UI_TEXT } from "@/constants/ui-text";

function VnPayResultContent() {
    const searchParams = useSearchParams();
    const status = searchParams?.get("status") === "success" ? "success" : "failed";
    const orderCode = searchParams?.get("orderCode") || null;
    const amount = searchParams?.get("amount") || null;
    const txnNo = searchParams?.get("txnNo") || null;
    const payDate = searchParams?.get("payDate") || null;
    const orderInfo = searchParams?.get("orderInfo") || null;
    const type = searchParams?.get("type") || null;

    return (
        <main className="mx-auto flex w-full max-w-container-max justify-center px-6 py-12">
            <VnPayResult status={status} orderCode={orderCode} amount={amount} txnNo={txnNo} payDate={payDate} orderInfo={orderInfo} paymentType={type} />
        </main>
    );
}

export default function VnPayResultPage() {
    const { VNPAY_RESULT } = UI_TEXT.BORROW;

    return (
        <Suspense
            fallback={
                <main className="mx-auto flex min-h-[60vh] w-full max-w-container-max items-center justify-center px-6 py-12">
                    <div className="text-center">
                        <div className="border-primary-200 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-primary-700 dark:border-slate-700 dark:border-t-primary-300"></div>
                        <p className="font-body-md text-on-surface-variant dark:text-slate-400">{VNPAY_RESULT.LOADING}</p>
                    </div>
                </main>
            }
        >
            <VnPayResultContent />
        </Suspense>
    );
}
