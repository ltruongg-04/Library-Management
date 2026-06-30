"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import BorrowForm from "@/components/features/borrow/BorrowForm";
import BorrowSuccess from "@/components/features/borrow/BorrowSuccess";
import LoanSummary from "@/components/features/borrow/LoanSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { UI_TEXT } from "@/constants/ui-text";
import { useBookDetail } from "@/hooks/useBooks";
import { useAuth } from "@/providers/auth";
import { createBorrowRequest } from "@/services/borrow";

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

    // Redirect to login if not authenticated
    useEffect(() => {
        if (isAuthenticated === false) {
            router.push(`/login?callbackUrl=/sach/${params.id}/muon`);
        }
    }, [isAuthenticated, router, params.id]);

    const handleSubmit = async () => {
        if (!pickupDate || !returnDate) {
            setSubmitError("Vui lòng chọn đầy đủ ngày đến lấy và ngày hoàn trả.");
            return;
        }

        if (!book) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await createBorrowRequest({
                bookId: book.id,
                pickupDate,
                returnDate,
                paymentMethod: paymentMethod.toUpperCase(),
            });
            setIsSuccess(true);
        } catch (err: any) {
            console.error("Lỗi đặt mượn sách:", err);
            setSubmitError(err.response?.data?.message || err.message || "Đã xảy ra lỗi khi đặt mượn sách");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || isAuthenticated === undefined) {
        return (
            <main className="mx-auto w-full max-w-container-max px-6 py-12">
                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* Form Skeleton */}
                    <div className="flex-1 space-y-8">
                        <Skeleton className="h-8 w-48" />
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

    // Wait until we have a user
    if (!user) {
        return null;
    }

    if (isSuccess) {
        return (
            <main className="mx-auto flex w-full max-w-container-max justify-center px-6 py-12">
                <BorrowSuccess book={book} />
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-container-max px-6 py-12">
            {submitError && (
                <div className="mb-6 rounded-lg bg-error-container p-4 text-on-error-container">
                    <div className="flex items-center gap-2">
                        <MaterialIcon name="error" />
                        <span className="font-semibold">{submitError}</span>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-12 lg:flex-row">
                <BorrowForm
                    book={book}
                    pickupDate={pickupDate}
                    setPickupDate={setPickupDate}
                    returnDate={returnDate}
                    setReturnDate={setReturnDate}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />
                <LoanSummary userFullName={user.fullName} isSubmitting={isSubmitting} isSuccess={isSuccess} onSubmit={handleSubmit} />
            </div>
        </main>
    );
}
