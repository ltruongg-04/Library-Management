"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import BorrowForm from "@/components/features/borrow/BorrowForm";
import BorrowSuccess from "@/components/features/borrow/BorrowSuccess";
import LoanSummary from "@/components/features/borrow/LoanSummary";
import SupportChatWidget from "@/components/features/borrow/SupportChatWidget";
import { Skeleton } from "@/components/ui/skeleton";
import { UI_TEXT } from "@/constants/ui-text";
import { useBookDetail } from "@/hooks/useBooks";
import { useAuth } from "@/providers/auth";
import { createBorrowRequest, createGuestBorrowRequest } from "@/services/borrow";

export default function BorrowPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const bookId = parseInt(params.id, 10);
    const { book, loading, error } = useBookDetail(isNaN(bookId) ? null : bookId);

    const [pickupDate, setPickupDate] = useState<string>("");
    const [returnDate, setReturnDate] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("cash");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Guest states
    const [fullName, setFullName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    // Allow both authenticated and unauthenticated users

    const handleSubmit = async () => {
        if (!pickupDate || !returnDate) {
            setSubmitError(UI_TEXT.BORROW.FORM.ERRORS.MISSING_DATES);
            return;
        }

        if (!book) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            let response;
            if (isAuthenticated) {
                response = await createBorrowRequest({
                    bookId: book.id,
                    pickupDate,
                    returnDate,
                    paymentMethod: paymentMethod.toUpperCase(),
                });
            } else {
                if (!phone || !fullName) {
                    setSubmitError(UI_TEXT.BORROW.FORM.ERRORS.MISSING_GUEST_INFO);
                    return;
                }
                response = await createGuestBorrowRequest({
                    bookId: book.id,
                    pickupDate,
                    returnDate,
                    paymentMethod: paymentMethod.toUpperCase(),
                    fullName,
                    phone,
                    email,
                });
            }

            // If VNPay payment URL is returned, redirect to VNPay gateway
            if (response.data?.paymentUrl) {
                window.location.href = response.data.paymentUrl;
                return;
            }

            // For CASH or other methods, show success page
            setIsSuccess(true);
        } catch (err: any) {
            console.error("Lỗi đặt mượn sách:", err);
            setSubmitError(err.response?.data?.message || err.message || UI_TEXT.BORROW.FORM.ERRORS.SUBMIT_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || isAuthenticated === undefined) {
        return (
            <main className="mx-auto w-full max-w-container-max px-6 py-12">
                <div className="mb-6">
                    <Skeleton className="mb-4 h-6 w-32" />
                    <Skeleton className="mb-2 h-10 w-64" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* Form Skeleton */}
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                    {/* Summary Skeleton */}
                    <div className="w-full lg:w-[280px]">
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                    </div>
                </div>
            </main>
        );
    }

    if (error || !book) {
        return (
            <div className="mx-auto flex w-full max-w-container-max flex-col items-center justify-center px-4 py-24 md:px-6">
                <MaterialIcon name="error_outline" className="mb-4 text-[64px] text-red-400" />
                <h2 className="mb-2 text-[24px] font-semibold text-on-surface dark:text-white">{UI_TEXT.COMMON.ERROR_LOAD_BOOK_DETAIL}</h2>
                <p className="text-on-surface-variant dark:text-white/70">{error || UI_TEXT.COMMON.BOOK_NOT_FOUND}</p>
                <button onClick={() => router.push("/")} className="hover:bg-primary-600 mt-6 rounded-lg bg-primary-700 px-6 py-2 text-white">
                    {UI_TEXT.COMMON.BACK_TO_HOME}
                </button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <main className="mx-auto flex w-full max-w-container-max justify-center px-6 py-12">
                <BorrowSuccess book={book} />
            </main>
        );
    }

    if (book.availableQuantity <= 0) {
        return (
            <div className="mx-auto flex w-full max-w-container-max flex-col items-center justify-center px-4 py-24 md:px-6">
                <MaterialIcon name="event_busy" className="mb-4 text-[64px] text-error" />
                <h2 className="mb-2 text-[24px] font-semibold text-on-surface dark:text-white">{UI_TEXT.BORROW.OUT_OF_STOCK.TITLE}</h2>
                <p className="text-on-surface-variant dark:text-white/70">{UI_TEXT.BORROW.OUT_OF_STOCK.DESCRIPTION}</p>
                <button onClick={() => router.push(`/sach/${book.id}`)} className="hover:bg-primary-600 mt-6 rounded-lg bg-primary-700 px-6 py-2 text-white">
                    {UI_TEXT.BORROW.OUT_OF_STOCK.BACK_TO_DETAIL}
                </button>
            </div>
        );
    }

    return (
        <main className="relative mx-auto flex min-h-screen w-full max-w-container-max flex-col px-6 py-12">
            <div className="mb-6">
                <Link href={`/sach/${book.id}`} className="mb-4 flex items-center gap-1 text-primary-700 dark:text-primary-300">
                    <MaterialIcon name="arrow_back" />
                    <span className="font-title-md text-title-md hover:underline">{UI_TEXT.BORROW.BACK_TO_CATALOG}</span>
                </Link>
                <h1 className="font-display-lg text-display-lg text-primary-700 dark:text-primary-300">{UI_TEXT.BORROW.TITLE}</h1>
                <p className="mt-2 font-body-md text-on-surface-variant dark:text-slate-300">{UI_TEXT.BORROW.SUBTITLE}</p>
            </div>

            {submitError && (
                <div className="mb-6 rounded-lg bg-error-container p-4 text-on-error-container">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="error" />
                        <span className="font-semibold">{submitError}</span>
                    </div>
                </div>
            )}
            <div className="grid flex-grow grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
                <BorrowForm
                    book={book}
                    pickupDate={pickupDate}
                    setPickupDate={setPickupDate}
                    returnDate={returnDate}
                    setReturnDate={setReturnDate}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    isGuest={!isAuthenticated}
                    fullName={fullName}
                    setFullName={setFullName}
                    phone={phone}
                    setPhone={setPhone}
                    email={email}
                    setEmail={setEmail}
                />
                <LoanSummary
                    book={book}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                    userFullName={isAuthenticated ? user?.fullName || "User" : fullName || UI_TEXT.COMMON.GUEST}
                    isSubmitting={isSubmitting}
                    isSuccess={isSuccess}
                    onSubmit={handleSubmit}
                />
            </div>

            <SupportChatWidget />
        </main>
    );
}
