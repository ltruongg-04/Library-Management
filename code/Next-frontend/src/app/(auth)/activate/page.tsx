"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BaseButton } from "@/components/base/base-button";
import { BaseInput } from "@/components/base/base-input";
import { UI_TEXT } from "@/constants/ui-text";
import { authService } from "@/services/auth";

const { ACTIVATION } = UI_TEXT.AUTH;

export default function ActivateAccountPage() {
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [isActivating, setIsActivating] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const queryToken = searchParams?.get("token");

        if (queryToken) {
            setToken(queryToken);
        }
    }, [searchParams]);

    const activateAccount = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsActivating(true);
        setMessage("");
        setError("");

        try {
            await authService.activate({ token: token.trim() });
            setMessage(ACTIVATION.SUCCESS_MSG);
        } catch (activationError) {
            setError(activationError instanceof Error ? activationError.message : ACTIVATION.ERROR_MSG);
        } finally {
            setIsActivating(false);
        }
    };

    const resendActivation = async () => {
        setIsResending(true);
        setMessage("");
        setError("");

        try {
            await authService.resendActivation({ email: email.trim().toLowerCase() });
            setMessage(ACTIVATION.RESEND_SUCCESS_MSG);
        } catch (resendError) {
            setError(resendError instanceof Error ? resendError.message : ACTIVATION.ERROR_MSG);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-semibold text-on-surface">{ACTIVATION.HEADING}</h1>
                <p className="mt-2 text-sm text-on-surface-variant">{ACTIVATION.SUBHEADING}</p>
            </div>

            {message && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                    {message}
                </div>
            )}

            {error && <div className="mb-5 rounded-lg border border-error/30 bg-error-container/20 px-4 py-3 text-sm font-medium text-error">{error}</div>}

            <form onSubmit={activateAccount} className="space-y-5">
                <BaseInput
                    label={ACTIVATION.TOKEN_LABEL}
                    placeholder={ACTIVATION.TOKEN_PLACEHOLDER}
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                />

                <BaseButton type="submit" isLoading={isActivating} disabled={!token.trim() || isActivating}>
                    {isActivating ? ACTIVATION.ACTIVATING_BTN : ACTIVATION.ACTIVATE_BTN}
                </BaseButton>
            </form>

            <div className="my-8 h-px bg-surface-container-high" />

            <div className="space-y-5">
                <BaseInput
                    label={ACTIVATION.EMAIL_LABEL}
                    type="email"
                    placeholder={ACTIVATION.EMAIL_PLACEHOLDER}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <BaseButton type="button" variant="secondary" isLoading={isResending} disabled={!email.trim() || isResending} onClick={resendActivation}>
                    {isResending ? ACTIVATION.RESENDING_BTN : ACTIVATION.RESEND_BTN}
                </BaseButton>
            </div>

            <Link href="/login" className="mt-8 text-center text-sm font-semibold text-primary-500 hover:text-primary-700">
                {ACTIVATION.BACK_TO_LOGIN}
            </Link>
        </div>
    );
}
