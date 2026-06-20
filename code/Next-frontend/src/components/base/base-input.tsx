import { InputHTMLAttributes, ReactNode } from "react";

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
        className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant dark:text-slate-300"
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative group">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400 transition-colors group-focus-within:text-primary-500">
            {leadingIcon}
          </span>
        )}

        <input
          id={inputId}
          {...props}
          className={[
            // Base
            "h-12 w-full rounded bg-surface-container-high dark:bg-slate-800 text-on-surface dark:text-white text-sm",
            "border-none outline-none",
            "placeholder:text-outline dark:text-slate-400",
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
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400">
            {trailingIcon}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p role="alert" className="flex items-center gap-1 text-xs text-error-500">
          <svg
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          {error}
        </p>
      )}

      {/* Helper text (only when no error) */}
      {helperText && !error && (
        <p className="text-xs text-outline dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

