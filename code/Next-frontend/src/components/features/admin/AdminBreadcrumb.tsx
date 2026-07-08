"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";

interface AdminBreadcrumbProps {
    pageName: string;
}

export default function AdminBreadcrumb({ pageName }: AdminBreadcrumbProps) {
    const params = useParams();
    const portal = (params?.portal as string) || "admin";

    return (
        <nav className="mb-6 flex items-center font-body-md text-body-md text-on-surface-variant transition-colors duration-200 dark:text-white">
            <span className="flex items-center">
                <Link href={`/${portal}`} className="font-bold text-primary transition-opacity hover:opacity-80 dark:text-primary-300">
                    {UI_TEXT.ADMIN.SIDEBAR.NAV_OVERVIEW}
                </Link>
            </span>
            <span className="mx-2 flex items-center text-on-surface-variant/70">
                <ChevronRight className="h-5 w-5" />
            </span>
            <span className="flex items-center">
                <span className="font-medium text-on-surface dark:text-white">{pageName}</span>
            </span>
        </nav>
    );
}
