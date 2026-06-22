import { TextareaHTMLAttributes } from "react";

interface BaseTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function BaseTextarea({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: BaseTextareaProps) {
  const textareaId =
    id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={textareaId}
        className="block text-xs font-medium uppercase tracking-wider text-content-secondary dark:text-white"
      >
        {label}
      </label>

      <textarea
        id={textareaId}
        {...props}
        className={[
          "w-full min-h-[120px] rounded bg-surface-high",
          "px-4 py-3 text-sm",
          "focus:ring-1 focus:ring-primary-500",
          error ? "ring-1 ring-error-500" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {error && (
        <p className="text-xs text-error-500">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="text-xs text-content-outline">
          {helperText}
        </p>
      )}
    </div>
  );
}