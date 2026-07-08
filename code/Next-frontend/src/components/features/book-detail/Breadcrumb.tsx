import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav
            aria-label={UI_TEXT.COMMON.BREADCRUMB_ARIA}
            className="mb-6 font-body-sm text-body-sm text-on-surface-variant transition-colors duration-200 dark:text-slate-300"
        >
            <ol className="flex flex-wrap items-center gap-1">
                {items.map((item, index) => {
                    const isCurrent = index === items.length - 1;
                    return (
                        <li key={`${item.label}-${index}`} className="flex items-center">
                            {index > 0 && <MaterialIcon name="chevron_right" className="mx-1 text-[16px] text-on-surface-variant/60 dark:text-slate-500" />}
                            {item.href && !isCurrent ? (
                                <Link href={item.href} className="transition-colors hover:text-primary dark:hover:text-primary-300">
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current={isCurrent ? "page" : undefined} className="font-semibold text-on-surface dark:text-white">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
