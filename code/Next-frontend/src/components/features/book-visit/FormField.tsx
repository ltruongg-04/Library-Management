import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type FormSectionProps = {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
};

type FieldProps = {
    label: string;
    htmlFor: string;
    className?: string;
    children: ReactNode;
};

export function FormSection({ icon: Icon, title, children }: FormSectionProps) {
    return (
        <fieldset>
            <legend className="mb-4 flex w-full items-center gap-2 border-b border-outline-variant/30 pb-2 font-title-md text-title-md text-on-surface dark:border-slate-800 dark:text-white">
                <Icon size={22} className="text-primary dark:text-secondary-300" />
                {title}
            </legend>
            {children}
        </fieldset>
    );
}

export function Field({ label, htmlFor, className = "", children }: FieldProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            <label htmlFor={htmlFor} className="block font-body-sm text-body-sm font-medium text-on-surface-variant dark:text-slate-300">
                {label}
            </label>
            {children}
        </div>
    );
}
