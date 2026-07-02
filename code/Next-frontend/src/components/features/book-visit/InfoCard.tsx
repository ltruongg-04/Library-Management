import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type InfoCardProps = {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
};

export function InfoCard({ icon: Icon, title, children }: InfoCardProps) {
    return (
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 flex items-center gap-2 font-title-md text-body-md text-on-surface dark:text-white">
                <Icon size={20} className="text-secondary dark:text-secondary-300" />
                {title}
            </h3>
            {children}
        </div>
    );
}
