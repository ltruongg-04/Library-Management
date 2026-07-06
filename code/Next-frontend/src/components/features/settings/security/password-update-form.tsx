"use client";

import { type ChangeEvent, useState } from "react";
import { KeyRound } from "lucide-react";
import { BaseButton } from "@/components/base/base-button";
import { BaseInput } from "@/components/base/base-input";
import { UI_TEXT } from "@/constants/ui-text";
import { authService } from "@/services/auth";

const securityText = UI_TEXT.SETTINGS_SECURITY.PAGE;
const MIN_PASSWORD_LENGTH = 8;

interface Props {
    showSuccess: (message: string) => void;
}

export function PasswordUpdateForm({ showSuccess }: Props) {
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const hasCurrentPassword = passwordForm.currentPassword.trim().length > 0;
    const hasNewPassword = passwordForm.newPassword.length > 0;
    const hasConfirmPassword = passwordForm.confirmPassword.length > 0;
    const isNewPasswordEligible = passwordForm.newPassword.trim().length >= MIN_PASSWORD_LENGTH;
    const isConfirmPasswordMatched = hasConfirmPassword && passwordForm.confirmPassword === passwordForm.newPassword;
    const isPasswordFormValid = hasCurrentPassword && isNewPasswordEligible && isConfirmPasswordMatched;

    const handlePasswordChange = (field: keyof typeof passwordForm) => (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordForm((current) => ({
            ...current,
            [field]: event.target.value,
        }));
    };

    const handleUpdatePassword = async () => {
        if (!isPasswordFormValid) return;

        setIsUpdatingPassword(true);
        setPasswordError("");

        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            showSuccess(securityText.SUCCESS_MESSAGES.PASSWORD_UPDATED);
        } catch (error: any) {
            setPasswordError(error.message || securityText.ERROR_MESSAGES.PASSWORD_UPDATE_FAILED);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <section className="border-b border-ink-200 pb-xl dark:border-slate-800">
            <div className="flex items-center gap-md">
                <KeyRound size={22} strokeWidth={2} className="text-ink-950 dark:text-white" />
                <h2 className="font-title-md text-title-md font-semibold text-ink-950 dark:text-white">{securityText.CHANGE_PASSWORD}</h2>
            </div>

            <form className="mt-7 max-w-[760px] space-y-6">
                <BaseInput
                    label={securityText.CURRENT_PASSWORD_LABEL}
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange("currentPassword")}
                    placeholder={securityText.CURRENT_PASSWORD_PLACEHOLDER}
                />

                <div className="grid gap-md md:grid-cols-2">
                    <BaseInput
                        label={securityText.NEW_PASSWORD_LABEL}
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange("newPassword")}
                        placeholder={securityText.NEW_PASSWORD_PLACEHOLDER}
                        error={hasNewPassword && !isNewPasswordEligible ? securityText.PASSWORD_INELIGIBLE : undefined}
                        helperText={hasNewPassword && isNewPasswordEligible ? securityText.PASSWORD_ELIGIBLE : undefined}
                    />

                    <BaseInput
                        label={securityText.CONFIRM_NEW_LABEL}
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange("confirmPassword")}
                        placeholder={securityText.CONFIRM_NEW_PLACEHOLDER}
                        error={hasConfirmPassword && !isConfirmPasswordMatched ? securityText.PASSWORD_MISMATCH : undefined}
                        helperText={hasConfirmPassword && isConfirmPasswordMatched ? securityText.PASSWORD_MATCH : undefined}
                    />
                </div>

                <div className="flex flex-col gap-2 pt-2 sm:items-end">
                    {passwordError && <div className="text-sm font-medium text-error-500 dark:text-error-300">{passwordError}</div>}
                    <div className="w-full sm:w-[220px]">
                        <BaseButton
                            type="button"
                            disabled={!isPasswordFormValid || isUpdatingPassword}
                            onClick={handleUpdatePassword}
                            isLoading={isUpdatingPassword}
                        >
                            {isUpdatingPassword ? securityText.UPDATING_PASSWORD_BTN : securityText.UPDATE_PASSWORD_BTN}
                        </BaseButton>
                    </div>
                </div>
            </form>
        </section>
    );
}
