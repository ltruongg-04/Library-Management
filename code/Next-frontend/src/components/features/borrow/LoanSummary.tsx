"use client";

import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

interface LoanSummaryProps {
    userFullName: string;
    isSubmitting: boolean;
    isSuccess: boolean;
    onSubmit: () => void;
}

export default function LoanSummary({ userFullName, isSubmitting, isSuccess, onSubmit }: LoanSummaryProps) {
    const { BORROW } = UI_TEXT;

    return (
        <div className="flex h-full w-full flex-col lg:w-[280px]">
            <aside className="flex h-full w-full flex-col">
                <div className="flex h-full flex-col rounded-xl bg-primary-700 p-6 text-on-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-primary-900">
                    <div>
                        <h2 className="mb-6 border-b border-on-primary/20 pb-4 font-title-md text-title-md">{BORROW.SUMMARY.TITLE}</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-body-sm text-on-primary/70">{BORROW.SUMMARY.BORROWER}</span>
                                <span className="font-semibold">{userFullName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-body-sm text-on-primary/70">{BORROW.SUMMARY.LOAN_PERIOD}</span>
                                <span className="font-semibold">{BORROW.SUMMARY.LOAN_PERIOD_VALUE}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-body-sm text-on-primary/70">{BORROW.SUMMARY.LATE_FEE_RATE}</span>
                                <span className="font-semibold">{BORROW.SUMMARY.LATE_FEE_RATE_VALUE}</span>
                            </div>
                        </div>
                        <div className="mt-6 rounded-lg bg-on-primary/10 p-4">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="font-label-caps text-label-caps text-on-primary/60">{BORROW.SUMMARY.REFUNDABLE_DEPOSIT}</p>
                                    <p className="mt-1 font-display-lg text-[32px] font-bold leading-none">
                                        10.000<span className="text-xl">{BORROW.SUMMARY.CURRENCY}</span>
                                    </p>
                                </div>
                                <MaterialIcon name="verified_user" className="text-secondary-container dark:text-secondary-300" />
                            </div>
                        </div>
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
            </aside>
        </div>
    );
}
