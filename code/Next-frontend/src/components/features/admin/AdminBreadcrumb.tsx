"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface AdminBreadcrumbProps {
    pageName?: string;
    items?: BreadcrumbItem[];
}

const routeLabelMap: Record<string, string> = {
    "": UI_TEXT.ADMIN.SIDEBAR.NAV_OVERVIEW,
    "kho-sach": UI_TEXT.ADMIN.SIDEBAR.NAV_BOOKS,
    "the-loai": UI_TEXT.ADMIN.SIDEBAR.NAV_CATEGORIES,
    "tac-gia": UI_TEXT.ADMIN.SIDEBAR.NAV_AUTHORS,
    "luot-muon": UI_TEXT.ADMIN.SIDEBAR.NAV_BORROWS,
    "lich-hen": UI_TEXT.ADMIN.SIDEBAR.NAV_VISITS,
    "danh-gia": UI_TEXT.ADMIN.SIDEBAR.NAV_REVIEWS,
    "thanh-vien": UI_TEXT.ADMIN.SIDEBAR.NAV_MEMBERS,
    "vai-tro": UI_TEXT.ADMIN.SIDEBAR.NAV_ROLES,
    "cai-dat": UI_TEXT.ADMIN.SIDEBAR.NAV_SETTINGS,
    "nhat-ky": UI_TEXT.ADMIN.SIDEBAR.NAV_AUDIT_LOGS,
    "thong-ke": UI_TEXT.ADMIN.SIDEBAR.NAV_STATS,
};

function buildAdminBreadcrumb(portal: string, pathname: string, fallbackPageName?: string): BreadcrumbItem[] {
    const normalizedPath = pathname.replace(/\/$/, "");
    const portalRoot = `/${portal}`;
    const relativePath = normalizedPath === portalRoot ? "" : normalizedPath.replace(`${portalRoot}/`, "");
    const firstSegment = relativePath.split("/").filter(Boolean)[0] || "";
    const currentLabel = routeLabelMap[firstSegment] || fallbackPageName || firstSegment;

    if (!firstSegment) {
        return [{ label: routeLabelMap[""] }];
    }

    return [{ label: routeLabelMap[""], href: portalRoot }, { label: currentLabel }];
}

export default function AdminBreadcrumb({ pageName, items }: AdminBreadcrumbProps) {
    const params = useParams();
    const pathname = usePathname();
    const portal = (params?.portal as string) || "admin";
    const breadcrumbItems = items?.length ? items : buildAdminBreadcrumb(portal, pathname || `/${portal}`, pageName);

    return (
        <nav
            aria-label={UI_TEXT.COMMON.BREADCRUMB_ARIA}
            className="mb-6 font-body-md text-body-md text-on-surface-variant transition-colors duration-200 dark:text-slate-300"
        >
            <ol className="flex flex-wrap items-center gap-2">
                {breadcrumbItems.map((item, index) => {
                    const isCurrent = index === breadcrumbItems.length - 1;
                    return (
                        <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                            {index > 0 ? <ChevronRight className="h-4 w-4 text-on-surface-variant/60 dark:text-slate-500" aria-hidden="true" /> : null}
                            {item.href && !isCurrent ? (
                                <Link
                                    href={item.href}
                                    className="font-semibold text-primary transition-colors hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-100"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current={isCurrent ? "page" : undefined} className="font-medium text-on-surface dark:text-white">
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
