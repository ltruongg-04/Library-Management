"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

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
    "bg-primary-500 text-white hover:bg-primary-700 active:bg-primary-900",
  secondary:
    "bg-surface-container-high dark:bg-slate-800 text-on-surface dark:text-white hover:bg-surface-default active:bg-surface-container-high dark:bg-slate-800",
  outline:
    "border border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 active:bg-primary-100",
  ghost:
    "bg-transparent text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high dark:bg-slate-800 active:bg-surface-container-high dark:bg-slate-800",
  destructive:
    "bg-error-500 text-white hover:bg-error-700 active:bg-error-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export function BaseButton({
  children,
  variant = "primary",
  size = "lg",
  isLoading = false,
  disabled,
  className = "",
  ...props
}: BaseButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={[
        // Base
        "inline-flex w-full items-center justify-center font-medium rounded",
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
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>Đang xử lý...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

