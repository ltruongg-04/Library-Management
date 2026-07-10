"use client";

import React, { useCallback, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { MaterialIcon } from "./material-icon";

interface CaptchaProps {
    onValidate: (token: string | null) => void;
    refreshLabel?: string;
}

export function Captcha({ onValidate, refreshLabel }: CaptchaProps) {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    // Site key can be from environment variable or a default placeholder for development
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Using test key by default

    const handleChange = useCallback(
        (token: string | null) => {
            onValidate(token);
        },
        [onValidate],
    );

    const handleRefresh = useCallback(() => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
            onValidate(null);
        }
    }, [onValidate]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
                <div className="overflow-hidden rounded-md">
                    <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey} onChange={handleChange} onExpired={() => onValidate(null)} />
                </div>
                <button
                    type="button"
                    onClick={handleRefresh}
                    className="hover:text-primary-600 mt-2 p-2 text-on-surface-variant transition-colors dark:text-slate-300 dark:hover:text-primary-100"
                    title={refreshLabel}
                    aria-label={refreshLabel}
                >
                    <MaterialIcon name="refresh" />
                </button>
            </div>
        </div>
    );
}
