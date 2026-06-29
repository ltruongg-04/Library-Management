"use client";

import { ArrowLeftRight, BarChart3, BookOpen, CircleHelp, History, LayoutDashboard, LogOut, Settings, ShieldCheck, UserCog, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";
import { useAuth } from "@/providers/auth";

const { SIDEBAR } = UI_TEXT.ADMIN;

const NAV_ITEMS = [
    { label: SIDEBAR.NAV_OVERVIEW, icon: LayoutDashboard, href: "/admin" },
    { label: SIDEBAR.NAV_BOOKS, icon: BookOpen, href: "/admin/kho-sach" },
    { label: SIDEBAR.NAV_BORROWS, icon: ArrowLeftRight, href: "/admin/luot-muon" },
    { label: SIDEBAR.NAV_MEMBERS, icon: Users, href: "/admin/thanh-vien" },
    { label: SIDEBAR.NAV_ROLES, icon: ShieldCheck, href: "/admin/vai-tro" },
    { label: SIDEBAR.NAV_SETTINGS, icon: Settings, href: "/admin/cai-dat" },
    { label: SIDEBAR.NAV_AUDIT_LOGS, icon: History, href: "/admin/nhat-ky" },
    { label: SIDEBAR.NAV_STATS, icon: BarChart3, href: "/admin/thong-ke" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-sidebar-width flex-col overflow-y-auto bg-primary text-on-primary shadow-md">
            <div className="flex items-center gap-md border-b border-on-primary/10 px-lg py-lg">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-container text-primary-fixed-dim">
                    <UserCog size={24} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                    <h1 className="truncate text-title-md font-bold tracking-normal text-on-primary">{SIDEBAR.BRAND_TITLE}</h1>
                    <p className="text-body-sm text-primary-fixed-dim">{SIDEBAR.BRAND_SUBTITLE}</p>
                </div>
            </div>

            <div className="px-lg py-md">
                <div className="flex items-center gap-sm rounded border border-primary-fixed-dim/20 bg-primary-container/30 p-3 text-primary-fixed-dim">
                    <span className="h-2 w-2 rounded-full bg-secondary-container" />
                    <span className="font-label-caps text-label-caps">{SIDEBAR.SYSTEM_STATUS}</span>
                </div>
            </div>

            <nav className="thin-scroll flex-1 overflow-y-auto px-sm py-md" aria-label={SIDEBAR.HEADING_NAV}>
                <ul className="flex flex-col gap-xs">
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`focus-ring flex min-h-12 items-center gap-md rounded-lg px-lg py-sm text-body-md transition-colors ${
                                        isActive
                                            ? "ml-0 mr-sm rounded-l-none border-l-4 border-secondary-fixed bg-primary-container font-medium text-on-primary-container"
                                            : "mx-sm text-on-primary/70 hover:bg-primary-container/20 hover:text-on-primary"
                                    }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <item.icon size={22} strokeWidth={1.8} />
                                    <span className="truncate">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="mt-auto border-t border-on-primary/10 p-lg">
                <div className="flex flex-col gap-xs">
                    <button className="focus-ring flex items-center gap-md rounded-lg px-md py-sm text-left text-body-sm text-on-primary/70 transition-colors hover:text-on-primary">
                        <CircleHelp size={20} strokeWidth={1.8} />
                        {SIDEBAR.SUPPORT}
                    </button>
                    <button
                        onClick={() => logout()}
                        className="focus-ring flex items-center gap-md rounded-lg px-md py-sm text-left text-body-sm text-on-primary/70 transition-colors hover:text-on-primary"
                    >
                        <LogOut size={20} strokeWidth={1.8} />
                        {SIDEBAR.LOGOUT}
                    </button>
                </div>
            </div>
        </aside>
    );
}
