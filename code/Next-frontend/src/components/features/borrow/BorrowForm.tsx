"use client";

import Image from "next/image";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import type { Book } from "@/types/book";

interface BorrowFormProps {
    book: Book;
    pickupDate: string;
    setPickupDate: (date: string) => void;
    returnDate: string;
    setReturnDate: (date: string) => void;
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
}

export default function BorrowForm({ book, pickupDate, setPickupDate, returnDate, setReturnDate, paymentMethod, setPaymentMethod }: BorrowFormProps) {
    const { BORROW } = UI_TEXT;

    // Minimum pickup date is today
    const minPickupDate = new Date().toISOString().split("T")[0];

    // Minimum return date is pickup date + 1
    const minReturnDate = pickupDate
        ? (() => {
              const date = new Date(pickupDate);
              date.setDate(date.getDate() + 1);
              return date.toISOString().split("T")[0];
          })()
        : minPickupDate;

    return (
        <div className="flex h-full flex-col">
            <form className="flex h-full flex-col space-y-6 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-900">
                {/* Book Information (Read Only) */}
                <div className="space-y-1">
                    <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">{BORROW.FORM.SELECTED_TITLE}</label>
                    <div className="flex items-center gap-4 rounded-lg border border-outline-variant/20 bg-surface-container-low p-4 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex h-24 w-16 flex-shrink-0 overflow-hidden rounded-sm border border-outline-variant/30 bg-primary-fixed dark:border-slate-600">
                            {book.imageUrl ? (
                                <Image src={book.imageUrl} alt={book.title} width={64} height={96} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary-100 dark:bg-slate-700">
                                    <MaterialIcon name="book" className="text-primary-500" />
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                className="w-full cursor-default border-none bg-transparent p-0 font-title-md text-title-md text-on-surface focus:ring-0 dark:text-white"
                                readOnly
                                type="text"
                                value={book.title}
                            />
                            <p className="font-body-sm text-on-surface-variant dark:text-slate-400">
                                {book.authors?.map((a) => a.name).join(", ") || "Unknown Author"} • {book.categories?.[0]?.name || "Sách"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Date Selection Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="group space-y-1">
                        <label
                            className="font-label-caps text-label-caps text-on-surface-variant group-focus-within:text-primary-700 dark:text-slate-400 dark:group-focus-within:text-primary-300"
                            htmlFor="pickup-date"
                        >
                            {BORROW.FORM.PICKUP_DATE}
                        </label>
                        <div className="relative rounded-lg focus-within:ring-2 focus-within:ring-primary-500/20">
                            <MaterialIcon
                                name="calendar_today"
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400"
                            />
                            <input
                                className="w-full cursor-pointer rounded-lg border-none bg-surface-container py-4 pl-12 font-body-md text-on-surface transition-all [color-scheme:light] focus:ring-1 focus:ring-primary-700 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] dark:focus:ring-primary-300 [&::-webkit-calendar-picker-indicator]:hidden"
                                id="pickup-date"
                                type="date"
                                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                                min={minPickupDate}
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="group space-y-1">
                        <label
                            className="font-label-caps text-label-caps text-on-surface-variant group-focus-within:text-primary-700 dark:text-slate-400 dark:group-focus-within:text-primary-300"
                            htmlFor="return-date"
                        >
                            {BORROW.FORM.RETURN_DATE}
                        </label>
                        <div className="relative rounded-lg focus-within:ring-2 focus-within:ring-primary-500/20">
                            <MaterialIcon
                                name="event_repeat"
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400"
                            />
                            <input
                                className="w-full cursor-pointer rounded-lg border-none bg-surface-container py-4 pl-12 font-body-md text-on-surface transition-all [color-scheme:light] focus:ring-1 focus:ring-primary-700 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] dark:focus:ring-primary-300 [&::-webkit-calendar-picker-indicator]:hidden"
                                id="return-date"
                                type="date"
                                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                                min={minReturnDate}
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                    <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">{BORROW.FORM.PAYMENT_METHOD}</label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <label
                            className={`group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-6 transition-all hover:bg-surface-container-high dark:hover:bg-slate-800 ${paymentMethod === "cash" ? "border-primary-700 bg-primary-fixed/20 dark:border-primary-300 dark:bg-primary-900/20" : "border-outline-variant/40 dark:border-slate-700"}`}
                        >
                            <input
                                className="peer sr-only"
                                name="payment"
                                type="radio"
                                value="cash"
                                checked={paymentMethod === "cash"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <MaterialIcon
                                name="payments"
                                className={`text-[32px] transition-colors ${paymentMethod === "cash" ? "text-primary-700 dark:text-primary-300" : "text-on-surface-variant group-hover:text-primary-700 dark:text-slate-400 dark:group-hover:text-primary-300"}`}
                            />
                            <span className="text-center font-body-sm font-semibold text-on-surface dark:text-white">{BORROW.FORM.CASH}</span>
                            <div className={`absolute right-2 top-2 transition-opacity ${paymentMethod === "cash" ? "opacity-100" : "opacity-0"}`}>
                                <MaterialIcon name="check_circle" className="text-base text-primary-700 dark:text-primary-300" />
                            </div>
                        </label>

                        <label
                            className={`group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-6 transition-all hover:bg-surface-container-high dark:hover:bg-slate-800 ${paymentMethod === "momo" ? "border-primary-700 bg-primary-fixed/20 dark:border-primary-300 dark:bg-primary-900/20" : "border-outline-variant/40 dark:border-slate-700"}`}
                        >
                            <input
                                className="peer sr-only"
                                name="payment"
                                type="radio"
                                value="momo"
                                checked={paymentMethod === "momo"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <MaterialIcon
                                name="account_balance_wallet"
                                className={`text-[32px] transition-colors ${paymentMethod === "momo" ? "text-primary-700 dark:text-primary-300" : "text-on-surface-variant group-hover:text-primary-700 dark:text-slate-400 dark:group-hover:text-primary-300"}`}
                            />
                            <span className="text-center font-body-sm font-semibold text-on-surface dark:text-white">{BORROW.FORM.MOMO}</span>
                            <div className={`absolute right-2 top-2 transition-opacity ${paymentMethod === "momo" ? "opacity-100" : "opacity-0"}`}>
                                <MaterialIcon name="check_circle" className="text-base text-primary-700 dark:text-primary-300" />
                            </div>
                        </label>

                        <label
                            className={`group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-6 transition-all hover:bg-surface-container-high dark:hover:bg-slate-800 ${paymentMethod === "vnpay" ? "border-primary-700 bg-primary-fixed/20 dark:border-primary-300 dark:bg-primary-900/20" : "border-outline-variant/40 dark:border-slate-700"}`}
                        >
                            <input
                                className="peer sr-only"
                                name="payment"
                                type="radio"
                                value="vnpay"
                                checked={paymentMethod === "vnpay"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <MaterialIcon
                                name="qr_code_2"
                                className={`text-[32px] transition-colors ${paymentMethod === "vnpay" ? "text-primary-700 dark:text-primary-300" : "text-on-surface-variant group-hover:text-primary-700 dark:text-slate-400 dark:group-hover:text-primary-300"}`}
                            />
                            <span className="text-center font-body-sm font-semibold text-on-surface dark:text-white">{BORROW.FORM.VNPAY}</span>
                            <div className={`absolute right-2 top-2 transition-opacity ${paymentMethod === "vnpay" ? "opacity-100" : "opacity-0"}`}>
                                <MaterialIcon name="check_circle" className="text-base text-primary-700 dark:text-primary-300" />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Policy Note */}
                <div className="flex items-start gap-4 rounded-lg bg-secondary-fixed/30 p-4 dark:bg-slate-800">
                    <MaterialIcon name="info" className="text-on-secondary-container dark:text-secondary-300" />
                    <div>
                        <p className="font-body-sm leading-relaxed text-on-secondary-container dark:text-secondary-50">
                            <strong>{BORROW.POLICY.TITLE}</strong> {BORROW.POLICY.CONTENT}
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
