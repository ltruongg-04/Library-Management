"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { UI_TEXT } from "@/constants/ui-text";
import { SpinnerIcon } from "../icons";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-primary-500 text-white hover:bg-primary-700 active:bg-primary-900 dark:bg-primary-500 dark:hover:bg-primary-300 dark:active:bg-primary-100 dark:text-white",
    secondary:
        "bg-surface-container-high text-on-surface hover:bg-surface-default active:bg-surface-container-high dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
    outline:
        "border border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 active:bg-primary-100 dark:border-primary-300 dark:text-primary-300 dark:hover:bg-primary-900/20",
    ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-high active:bg-surface-container-high dark:text-slate-400 dark:hover:bg-slate-800",
    destructive: "bg-error-500 text-white hover:bg-error-700 active:bg-error-700",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2",
};

export function BaseButton({ children, variant = "primary", size = "lg", isLoading = false, disabled, className = "", ...props }: BaseButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={[
                // Base
                "inline-flex w-full items-center justify-center rounded font-medium",
                "transition-colors duration-150 ease-in-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                variantClasses[variant],
                sizeClasses[size],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {isLoading ? (
                <>
                    <SpinnerIcon className="h-4 w-4 animate-spin" />
                    <span>{UI_TEXT.COMMON.LOADING}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
