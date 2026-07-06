"use client";

import { useState } from "react";
import { SuccessModal } from "@/components/base/success-modal";
import { UI_TEXT } from "@/constants/ui-text";
import { LoginActivitySection } from "./login-activity-section";
import { PasswordUpdateForm } from "./password-update-form";
import { TwoFactorSection } from "./two-factor-section";

const securityText = UI_TEXT.SETTINGS_SECURITY.PAGE;

export default function SecuritySettings() {
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setShowSuccessModal(true);
    };

    return (
        <div className="w-full max-w-4xl rounded-2xl border border-ink-200 bg-white p-xl shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
            <header className="mb-xl border-b border-ink-200 pb-xl dark:border-slate-800">
                <div className="max-w-[760px]">
                    <h1 className="mb-2 text-3xl font-bold text-ink-950 dark:text-white">{securityText.HEADING}</h1>
                    <p className="max-w-2xl font-body-md text-body-md text-ink-600 dark:text-slate-400">{securityText.SUBHEADING}</p>
                </div>
            </header>

            <div className="space-y-xl">
                <PasswordUpdateForm showSuccess={showSuccess} />
                <TwoFactorSection showSuccess={showSuccess} />
                <LoginActivitySection showSuccess={showSuccess} />
            </div>

            <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} message={successMessage} />
        </div>
    );
}
