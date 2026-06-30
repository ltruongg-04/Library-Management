"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseButton } from "@/components/base/base-button";
import { BaseInput } from "@/components/base/base-input";
import { AppleIcon } from "@/components/icons/apple-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { useAuth } from "@/providers/auth";
import { isAdminRole } from "@/utils/role";

export function LoginForm() {
    const { login, loginWithGoogle } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams.get("registered") === "true";
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    function validate() {
        const next: typeof errors = {};
        if (!email) next.email = UI_TEXT.AUTH.LOGIN.VALIDATION.EMAIL_REQUIRED;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = UI_TEXT.AUTH.LOGIN.VALIDATION.EMAIL_INVALID;
        if (!password) next.password = UI_TEXT.AUTH.LOGIN.VALIDATION.PASSWORD_REQUIRED;
        else if (password.length < 8) next.password = UI_TEXT.AUTH.LOGIN.VALIDATION.PASSWORD_MIN_LENGTH;
        return next;
    }

    async function handleSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        const next = validate();
        if (Object.keys(next).length) {
            setErrors(next);
            return;
        }
        setErrors({});
        setIsLoading(true);
        try {
            await login(email, password);
            const session = await getSession();
            if (isAdminRole(session?.user?.role)) {
                router.replace("/admin");
            } else {
                router.replace("/");
            }
        } catch (error) {
            setErrors({
                email: error instanceof Error ? error.message : UI_TEXT.AUTH.LOGIN.ERROR_MSG,
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
        } catch {
            setIsGoogleLoading(false);
        }
    }

    return (
        <div className="animate-slide-up w-full max-w-md">
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-4xl font-semibold text-on-surface">{UI_TEXT.AUTH.LOGIN.HEADING}</h1>
                <p className="mt-2 text-sm text-on-surface-variant">{UI_TEXT.AUTH.LOGIN.SUBHEADING}</p>
            </div>

            {isRegistered && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    <span>✅</span>
                    <span>{UI_TEXT.AUTH.LOGIN.REGISTER_SUCCESS}</span>
                </div>
            )}

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <BaseInput
                    label={UI_TEXT.AUTH.LOGIN.EMAIL_LABEL}
                    type="email"
                    placeholder={UI_TEXT.AUTH.LOGIN.EMAIL_PLACEHOLDER}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    leadingIcon={<Mail size={16} strokeWidth={1.5} />}
                />

                <div className="space-y-1.5">
                    <BaseInput
                        label={UI_TEXT.AUTH.LOGIN.PASSWORD_LABEL}
                        type={showPassword ? "text" : "password"}
                        placeholder={UI_TEXT.AUTH.LOGIN.PASSWORD_PLACEHOLDER}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        leadingIcon={<Lock size={16} strokeWidth={1.5} />}
                        trailingIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="text-outline transition-colors hover:text-on-surface focus:outline-none"
                                aria-label={showPassword ? UI_TEXT.AUTH.LOGIN.HIDE_PASSWORD_ARIA : UI_TEXT.AUTH.LOGIN.SHOW_PASSWORD_ARIA}
                            >
                                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                            </button>
                        }
                    />

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-xs text-secondary-500 transition-colors hover:text-primary-700">
                            {UI_TEXT.AUTH.LOGIN.FORGOT_PASSWORD}
                        </Link>
                    </div>
                </div>

                <BaseButton type="submit" isLoading={isLoading}>
                    <span>{UI_TEXT.AUTH.LOGIN.SUBMIT_BTN}</span>
                    <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
                </BaseButton>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-surface-container-high" />
                <span className="font-mono text-xs uppercase tracking-wider text-outline">{UI_TEXT.AUTH.LOGIN.OR_CONTINUE_WITH}</span>
                <div className="h-px flex-1 bg-surface-container-high" />
            </div>

            {/* Social logins */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    id="btn-login-google"
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isGoogleLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
                    {UI_TEXT.AUTH.LOGIN.GOOGLE_BTN}
                </button>

                <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                    <AppleIcon />
                    {UI_TEXT.AUTH.LOGIN.APPLE_BTN}
                </button>
            </div>

            {/* Sign up */}
            <p className="mt-8 text-center text-sm text-on-surface-variant">
                {UI_TEXT.AUTH.LOGIN.NO_ACCOUNT}{" "}
                <Link
                    href="/register"
                    className="font-semibold text-primary-500 underline decoration-primary-100 underline-offset-4 transition-colors hover:text-primary-700"
                >
                    {UI_TEXT.AUTH.LOGIN.SIGN_UP_LINK}
                </Link>
            </p>
        </div>
    );
}
