"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
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
                <div className="flex items-start gap-3 rounded-lg border border-red-500 bg-red-50 p-4 text-red-700">
                    <span className="text-xl">{UI_TEXT.AUTH.REGISTER.ERROR_ICON}</span>
                    <span className="text-sm">{errorMessage}</span>
                </div>
            )}

            {/* Full Name */}
            <Input
                label={UI_TEXT.AUTH.REGISTER.FULL_NAME_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.FULL_NAME_PLACEHOLDER}
                type="text"
                error={errors.fullName?.message}
                {...register("fullName", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Phone */}
            <Input
                label={UI_TEXT.AUTH.REGISTER.PHONE_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.PHONE_PLACEHOLDER}
                type="tel"
                error={errors.phoneNumber?.message}
                {...register("phoneNumber", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Email */}
            <Input
                label={UI_TEXT.AUTH.REGISTER.EMAIL_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.EMAIL_PLACEHOLDER}
                type="email"
                error={errors.email?.message}
                {...register("email", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Password */}
            <Input
                label={UI_TEXT.AUTH.REGISTER.PASSWORD_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.PASSWORD_PLACEHOLDER}
                type="password"
                error={errors.password?.message}
                {...register("password", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Confirm Password */}
            <Input
                label={UI_TEXT.AUTH.REGISTER.CONFIRM_PASSWORD_LABEL}
                placeholder={UI_TEXT.AUTH.REGISTER.CONFIRM_PASSWORD_PLACEHOLDER}
                type="password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                    onChange: () => errorMessage && setErrorMessage(""),
                })}
            />

            {/* Submit */}
            <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading || !isValid}>
                {isLoading ? UI_TEXT.AUTH.REGISTER.LOADING_BTN : UI_TEXT.AUTH.REGISTER.SUBMIT_BTN}
            </Button>

            {/* Login link */}
            <div className="text-center text-sm text-gray-600">
                {UI_TEXT.AUTH.REGISTER.ALREADY_HAVE_ACCOUNT}{" "}
                <Link href="/login" className="font-medium text-primary-500 hover:text-primary-700">
                    {UI_TEXT.AUTH.REGISTER.LOGIN_LINK}
                </Link>
            </div>
        </form>
    );
}
