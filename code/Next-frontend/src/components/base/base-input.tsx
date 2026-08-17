import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { ErrorIcon } from "../icons";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    labelClassName?: string;
}

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(function BaseInput(
    { label, error, helperText, leadingIcon, trailingIcon, labelClassName, id, className = "", ...props },
    ref,
) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="space-y-1.5">
            {/* Label */}
            <label
                htmlFor={inputId}
                className={`block text-xs font-medium uppercase tracking-wider text-on-surface-variant dark:text-slate-400 ${labelClassName || ""}`}
            >
                {label}
            </label>

            {/* Input wrapper */}
            <div className="group relative">
                {leadingIcon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary-500 dark:text-slate-500 dark:group-focus-within:text-primary-300">
                        {leadingIcon}
                    </span>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    {...props}
                    className={[
                        // Base
                        "h-12 w-full rounded bg-surface-container-high text-sm text-on-surface",
                        "border-none outline-none",
                        "placeholder:text-outline",
                        "transition-shadow duration-150",
                        // Dark mode
                        "dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500",
                        // Focus ring
                        "focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-300",
                        // Error ring
                        error ? "ring-1 ring-error-500" : "",
                        // Icon padding
                        leadingIcon ? "pl-10" : "pl-4",
                        trailingIcon ? "pr-10" : "pr-4",
                        className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                />

                {trailingIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500">{trailingIcon}</span>}
            </div>

            {/* Error message */}
            {error && (
                <p role="alert" className="flex items-center gap-1 text-xs text-error-500">
                    <ErrorIcon className="h-3.5 w-3.5 shrink-0" />
                    {error}
                </p>
            )}

            {/* Helper text (only when no error) */}
            {helperText && !error && <p className="text-xs text-outline dark:text-slate-500">{helperText}</p>}
        </div>
    );
});
