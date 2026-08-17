"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BaseButton } from "@/components/base/base-button";
import { BaseInput } from "@/components/base/base-input";
import { UI_TEXT } from "@/constants/ui-text";
import { type RegisterFormData, registerSchema } from "@/schemas/auth";
import { authService } from "@/services/auth";

export default function RegisterForm() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setFocus,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            await authService.register({
                fullName: data.fullName.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password,
                phone: data.phoneNumber?.trim() || undefined,
            });

            reset();
            router.replace("/login?registered=true");
        } catch (error) {
            const message = error instanceof Error ? error.message : UI_TEXT.AUTH.REGISTER.ERROR_MSG;

            setErrorMessage(message);

            // focus UX: ưu tiên email (hoặc bạn có thể map theo backend error)
            setFocus("email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error */}
            {errorMessage && (
                <div className="flex items-start gap-3 rounded-lg border border-error-500/30 bg-error-50 p-4 text-error-500 dark:bg-error-900/20 dark:text-error-100">
                    <span className="text-xl">{UI_TEXT.AUTH.REGISTER.ERROR_ICON}</span>
                    <span className="text-sm">{errorMessage}</span>
                </div>
            )}

            {/* Full Name */}
            <BaseInput
                label={UI_TEXT.AUTH.REGISTER.FULL_NAME_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.FULL_NAME_PLACEHOLDER}
                type="text"
                error={errors.fullName?.message}
                leadingIcon={<User size={16} strokeWidth={1.5} />}
                {...register("fullName", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Phone */}
            <BaseInput
                label={UI_TEXT.AUTH.REGISTER.PHONE_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.PHONE_PLACEHOLDER}
                type="tel"
                error={errors.phoneNumber?.message}
                leadingIcon={<Phone size={16} strokeWidth={1.5} />}
                {...register("phoneNumber", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Email */}
            <BaseInput
                label={UI_TEXT.AUTH.REGISTER.EMAIL_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.EMAIL_PLACEHOLDER}
                type="email"
                error={errors.email?.message}
                leadingIcon={<Mail size={16} strokeWidth={1.5} />}
                {...register("email", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Password */}
            <BaseInput
                label={UI_TEXT.AUTH.REGISTER.PASSWORD_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.PASSWORD_PLACEHOLDER}
                type="password"
                error={errors.password?.message}
                leadingIcon={<Lock size={16} strokeWidth={1.5} />}
                {...register("password", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Confirm Password */}
            <BaseInput
                label={UI_TEXT.AUTH.REGISTER.CONFIRM_PASSWORD_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.CONFIRM_PASSWORD_PLACEHOLDER}
                type="password"
                error={errors.confirmPassword?.message}
                leadingIcon={<Lock size={16} strokeWidth={1.5} />}
                {...register("confirmPassword", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Submit */}
            <BaseButton type="submit" isLoading={isLoading} disabled={isLoading || !isValid}>
                <span>{isLoading ? UI_TEXT.AUTH.REGISTER.LOADING_BTN : UI_TEXT.AUTH.REGISTER.SUBMIT_BTN}</span>
                <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </BaseButton>

            {/* Login link */}
            <div className="text-center text-sm text-on-surface-variant dark:text-slate-400">
                {UI_TEXT.AUTH.REGISTER.ALREADY_HAVE_ACCOUNT}{" "}
                <Link href="/login" className="font-medium text-primary-500 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-100">
                    {UI_TEXT.AUTH.REGISTER.LOGIN_LINK}
                </Link>
            </div>
        </form>
    );
}
