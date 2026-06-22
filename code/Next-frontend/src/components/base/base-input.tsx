import { InputHTMLAttributes, ReactNode } from "react";
import { ErrorIcon } from "../icons";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
}

export function BaseInput({
    label,
    error,
    helperText,
    leadingIcon,
    trailingIcon,
    id,
    className = "",
    ...props
}: BaseInputProps) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="space-y-1.5">
            {/* Label */}
            <label
                htmlFor={inputId}
                className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant dark:text-white"
            >
                {label}
            </label>

            {/* Input wrapper */}
            <div className="relative group">
                {leadingIcon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary-500">
                        {leadingIcon}
                    </span>
                )}

                <input
                    id={inputId}
                    {...props}
                    className={[
                        // Base
                        "h-12 w-full rounded bg-surface-container-high text-on-surface text-sm",
                        "border-none outline-none",
                        "placeholder:text-outline ",
                        "transition-shadow duration-150",
                        // Focus ring
                        "focus:ring-1 focus:ring-primary-500",
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

                {trailingIcon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline ">
                        {trailingIcon}
                    </span>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p role="alert" className="flex items-center gap-1 text-xs text-error-500">
                    <ErrorIcon className="h-3.5 w-3.5 shrink-0" />
                    {error}
                </p>
            )}

            {/* Helper text (only when no error) */}
            {helperText && !error && (
                <p className="text-xs text-outline ">{helperText}</p>
            )}
        </div>
    );
}

