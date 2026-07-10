"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { BorrowingPolicyDto, getActivePolicy } from "@/services/policy";

interface LoanSummaryProps {
    book?: any;
    pickupDate?: string;
    returnDate?: string;
    userFullName: string;
    isSubmitting: boolean;
    isSuccess: boolean;
    onSubmit: () => void;
}

export default function LoanSummary({ book, pickupDate, returnDate, userFullName, isSubmitting, isSuccess, onSubmit }: LoanSummaryProps) {
    const { BORROW } = UI_TEXT;

    const [policy, setPolicy] = useState<BorrowingPolicyDto | null>(null);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const data = await getActivePolicy();
                setPolicy(data);
            } catch (error) {
                console.error("Failed to fetch policy:", error);
            }
        };
        fetchPolicy();
    }, []);

    let days = 0;
    if (pickupDate && returnDate) {
        const pDate = new Date(pickupDate);
        const rDate = new Date(returnDate);
        const diffTime = rDate.getTime() - pDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
            days = diffDays;
        } else {
            days = 1;
        }
    }

    const rentalFeeRate = policy?.rentalFeePerDay || 5000;
    const lateFeeRate = policy?.overdueFinePerDay || 10000;
    const rentalFee = days * rentalFeeRate;
    const deposit = book?.depositPrice || 10000;

    return (
        <aside className="flex w-full flex-shrink-0 flex-col gap-6 lg:sticky lg:top-[100px] lg:w-[280px] lg:self-start">
            <div className="space-y-6 rounded-xl bg-primary-700 p-6 text-on-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-primary-900">
                <h2 className="border-b border-on-primary/20 pb-4 font-title-md text-title-md">{BORROW.SUMMARY.TITLE}</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-body-sm text-on-primary/70">{BORROW.SUMMARY.BORROWER}</span>
                        <span className="font-semibold">{userFullName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-body-sm text-on-primary/70">{BORROW.SUMMARY.LOAN_PERIOD}</span>
                        <span className="font-semibold">{`${days} ${BORROW.SUMMARY.DAYS_SUFFIX}`}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-body-sm text-on-primary/70">{BORROW.SUMMARY.RENTAL_FEE_RATE}</span>
                        <span className="font-semibold">{`${rentalFeeRate.toLocaleString("vi-VN")}${BORROW.SUMMARY.CURRENCY}/${BORROW.SUMMARY.DAYS_SUFFIX}`}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-body-sm text-on-primary/70">{BORROW.SUMMARY.LATE_FEE_RATE}</span>
                        <span className="font-semibold">{`${lateFeeRate.toLocaleString("vi-VN")}${BORROW.SUMMARY.CURRENCY}/${BORROW.SUMMARY.DAYS_SUFFIX}`}</span>
                    </div>
                </div>
                <div className="mt-6 rounded-lg bg-on-primary/10 p-4">
                    <div className="flex items-end justify-between border-b border-on-primary/10 pb-4">
                        <div>
                            <p className="font-label-caps text-label-caps text-on-primary/60">{BORROW.SUMMARY.RENTAL_FEE}</p>
                            <p className="font-display-sm mt-1 text-[24px] font-bold leading-none">
                                {rentalFee.toLocaleString("vi-VN")}
                                <span className="text-sm">{BORROW.SUMMARY.CURRENCY}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between pt-4">
                        <div>
                            <p className="font-label-caps text-label-caps text-on-primary/60">{BORROW.SUMMARY.REFUNDABLE_DEPOSIT}</p>
                            <p className="mt-1 font-display-lg text-[32px] font-bold leading-none">
                                {deposit.toLocaleString("vi-VN")}
                                <span className="text-xl">{BORROW.SUMMARY.CURRENCY}</span>
                            </p>
                        </div>
                        <MaterialIcon name="verified_user" className="mb-2 text-2xl text-secondary-container dark:text-secondary-300" />
                    </div>

                    <div className="mt-auto space-y-6 pt-6">
                        <button
                            onClick={onSubmit}
                            disabled={isSubmitting || isSuccess}
                            className={`flex w-full items-center justify-center gap-2 rounded-lg py-4 font-title-md text-title-md shadow-lg transition-all active:scale-95 ${
                                isSuccess
                                    ? "bg-green-500 text-white"
                                    : "bg-secondary-container text-on-secondary-container hover:brightness-110 dark:bg-secondary-300 dark:text-on-secondary-container"
                            } disabled:cursor-not-allowed disabled:opacity-70`}
                        >
                            {isSubmitting ? (
                                <>
                                    <MaterialIcon name="sync" className="animate-spin" />
                                    {BORROW.SUMMARY.PROCESSING}
                                </>
                            ) : isSuccess ? (
                                <>
                                    <MaterialIcon name="check" />
                                    {BORROW.SUMMARY.SUCCESS}
                                </>
                            ) : (
                                BORROW.SUMMARY.CONFIRM_BUTTON
                            )}
                        </button>
                        <p className="text-center font-label-caps text-[10px] uppercase tracking-widest text-on-primary/50">{BORROW.SUMMARY.SECURED_BY}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
