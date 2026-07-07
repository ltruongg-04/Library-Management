"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BaseButton } from "@/components/base/base-button";
import { BaseInput } from "@/components/base/base-input";
import { UI_TEXT } from "@/constants/ui-text";
import { authService } from "@/services/auth";

export function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<{ email?: string; otp?: string; password?: string; confirm?: string; global?: string }>({});

    function validateStep1() {
        const next: typeof errors = {};
        if (!email) next.email = UI_TEXT.AUTH.FORGOT_PASSWORD.VALIDATION.EMAIL_REQUIRED;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = UI_TEXT.AUTH.FORGOT_PASSWORD.VALIDATION.EMAIL_INVALID;
        return next;
    }

    function validateStep2() {
        const next: typeof errors = {};
        if (!otp) next.otp = UI_TEXT.AUTH.FORGOT_PASSWORD.VALIDATION.OTP_REQUIRED;
        else if (otp.length !== 6) next.otp = UI_TEXT.AUTH.FORGOT_PASSWORD.VALIDATION.OTP_LENGTH;
        return next;
    }

    function validateStep3() {
        const next: typeof errors = {};
        if (!newPassword) next.password = UI_TEXT.AUTH.FORGOT_PASSWORD.VALIDATION.PASSWORD_REQUIRED;
        else if (newPassword.length < 8) next.password = UI_TEXT.AUTH.FORGOT_PASSWORD.VALIDATION.PASSWORD_MIN_LENGTH;

        if (newPassword !== confirmPassword) next.confirm = UI_TEXT.AUTH.FORGOT_PASSWORD.VALIDATION.PASSWORD_MISMATCH;
        return next;
    }

    async function handleRequestOtp(e: React.FormEvent) {
        e.preventDefault();
        const next = validateStep1();
        if (Object.keys(next).length) {
            setErrors(next);
            return;
        }
        setErrors({});
        setIsLoading(true);
        try {
            await authService.forgotPassword({ email });
            toast.success(UI_TEXT.AUTH.FORGOT_PASSWORD.MESSAGES.OTP_SENT_SUCCESS);
            setStep(2);
        } catch (error: any) {
            setErrors({ global: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault();
        const next = validateStep2();
        if (Object.keys(next).length) {
            setErrors(next);
            return;
        }
        setErrors({});
        setIsLoading(true);
        try {
            const res = await authService.verifyOtp({ email, otp });
            setResetToken(res.resetToken);
            toast.success(UI_TEXT.AUTH.FORGOT_PASSWORD.MESSAGES.OTP_VERIFIED_SUCCESS);
            setStep(3);
        } catch (error: any) {
            setErrors({ global: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault();
        const next = validateStep3();
        if (Object.keys(next).length) {
            setErrors(next);
            return;
        }
        setErrors({});
        setIsLoading(true);
        try {
            await authService.resetPassword({ resetToken, newPassword });
            toast.success(UI_TEXT.AUTH.FORGOT_PASSWORD.MESSAGES.RESET_SUCCESS);
            router.push("/login?reset=true");
        } catch (error: any) {
            setErrors({ global: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="animate-slide-up relative w-full max-w-md">
            <div className="mb-8">
                <h1 className="text-4xl font-semibold text-on-surface">{UI_TEXT.AUTH.FORGOT_PASSWORD.HEADING}</h1>
                <p className="mt-2 text-sm text-on-surface-variant">{UI_TEXT.AUTH.FORGOT_PASSWORD.SUBHEADING}</p>
            </div>

            {errors.global && (
                <div className="mb-6 rounded-lg border border-error/30 bg-error-container/20 p-3 text-sm font-medium text-error">{errors.global}</div>
            )}

            {step === 1 ? (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                    <BaseInput
                        label={UI_TEXT.AUTH.FORGOT_PASSWORD.EMAIL_LABEL}
                        type="email"
                        placeholder={UI_TEXT.AUTH.FORGOT_PASSWORD.EMAIL_PLACEHOLDER}
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        leadingIcon={<Mail size={16} strokeWidth={1.5} />}
                    />

                    <BaseButton type="submit" isLoading={isLoading}>
                        <span>{UI_TEXT.AUTH.FORGOT_PASSWORD.SUBMIT_EMAIL_BTN}</span>
                        <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
                    </BaseButton>
                </form>
            ) : step === 2 ? (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <BaseInput
                        label={UI_TEXT.AUTH.FORGOT_PASSWORD.OTP_LABEL}
                        type="text"
                        placeholder={UI_TEXT.AUTH.FORGOT_PASSWORD.OTP_PLACEHOLDER}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        error={errors.otp}
                        maxLength={6}
                    />

                    <BaseButton type="submit" isLoading={isLoading}>
                        <span>{UI_TEXT.AUTH.FORGOT_PASSWORD.SUBMIT_OTP_BTN}</span>
                        <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
                    </BaseButton>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <BaseInput
                        label={UI_TEXT.AUTH.FORGOT_PASSWORD.NEW_PASSWORD_LABEL}
                        type={showPassword ? "text" : "password"}
                        placeholder={UI_TEXT.AUTH.FORGOT_PASSWORD.NEW_PASSWORD_PLACEHOLDER}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={errors.password}
                        leadingIcon={<KeyRound size={16} strokeWidth={1.5} />}
                        trailingIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-on-surface-variant transition-colors hover:text-primary-500"
                            >
                                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                            </button>
                        }
                    />

                    <BaseInput
                        label={UI_TEXT.AUTH.FORGOT_PASSWORD.CONFIRM_PASSWORD_LABEL}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={UI_TEXT.AUTH.FORGOT_PASSWORD.CONFIRM_PASSWORD_PLACEHOLDER}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirm}
                        leadingIcon={<KeyRound size={16} strokeWidth={1.5} />}
                        trailingIcon={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-on-surface-variant transition-colors hover:text-primary-500"
                            >
                                {showConfirmPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                            </button>
                        }
                    />

                    <BaseButton type="submit" isLoading={isLoading}>
                        <span>{UI_TEXT.AUTH.FORGOT_PASSWORD.SUBMIT_RESET_BTN}</span>
                    </BaseButton>
                </form>
            )}

            <div className="mt-8 flex justify-center">
                <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-secondary-500 transition-colors hover:text-primary-700">
                    <ArrowLeft size={16} strokeWidth={1.5} />
                    {UI_TEXT.AUTH.FORGOT_PASSWORD.BACK_TO_LOGIN}
                </Link>
            </div>
        </div>
    );
}
