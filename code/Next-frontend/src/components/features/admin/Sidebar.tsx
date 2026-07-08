"use client";

import {
    BarChart3,
    BookOpen,
    Calendar,
    CircleHelp,
    ClipboardList,
    Feather,
    History,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    ShieldCheck,
    Tags,
    UserCog,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";
import { useSidebar } from "@/providers/SidebarContext";
import { useAuth } from "@/providers/auth";

const { SIDEBAR } = UI_TEXT.ADMIN;

const NAV_ITEMS = [
    { label: SIDEBAR.NAV_OVERVIEW, icon: LayoutDashboard, href: "/admin", roles: ["ADMIN", "LIBRARIAN"] },
    { label: SIDEBAR.NAV_BOOKS, icon: BookOpen, href: "/admin/kho-sach", roles: ["ADMIN", "LIBRARIAN"] },
    { label: SIDEBAR.NAV_CATEGORIES, icon: Tags, href: "/admin/the-loai", roles: ["ADMIN", "LIBRARIAN"] },
    { label: SIDEBAR.NAV_AUTHORS, icon: Feather, href: "/admin/tac-gia", roles: ["ADMIN", "LIBRARIAN"] },
    { label: SIDEBAR.NAV_BORROWS, icon: ClipboardList, href: "/admin/luot-muon", roles: ["ADMIN", "LIBRARIAN"] },
    { label: SIDEBAR.NAV_VISITS, icon: Calendar, href: "/admin/lich-hen", roles: ["ADMIN", "LIBRARIAN"] },
    { label: SIDEBAR.NAV_REVIEWS, icon: MessageSquare, href: "/admin/danh-gia", roles: ["ADMIN", "LIBRARIAN"] },
    { label: SIDEBAR.NAV_MEMBERS, icon: Users, href: "/admin/thanh-vien", roles: ["ADMIN"] },
    { label: SIDEBAR.NAV_ROLES, icon: ShieldCheck, href: "/admin/vai-tro", roles: ["ADMIN"] },
    { label: SIDEBAR.NAV_SETTINGS, icon: Settings, href: "/admin/cai-dat", roles: ["ADMIN"] },
    { label: SIDEBAR.NAV_AUDIT_LOGS, icon: History, href: "/admin/nhat-ky", roles: ["ADMIN"] },
    { label: SIDEBAR.NAV_STATS, icon: BarChart3, href: "/admin/thong-ke", roles: ["ADMIN"] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const params = useParams();
    const portal = (params?.portal as string) || "admin";
    const { logout, user } = useAuth();
    const { collapsed, toggleCollapsed } = useSidebar();

    const userRole = user?.role?.toUpperCase().replace(/^ROLE_/, "") || "";
    const filteredNavItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

    return (
        <aside
            className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-primary text-on-primary shadow-md transition-all duration-300 ${
                collapsed ? "w-[68px]" : "w-sidebar-width"
            }`}
        >
            {/* Toggle Button */}
            <div className={`flex w-full px-md pt-md ${collapsed ? "justify-center px-xs" : "justify-start"}`}>
                <button
                    onClick={toggleCollapsed}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-on-primary/70 transition-colors hover:bg-primary-container/20 hover:text-on-primary"
                    title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <PanelLeftOpen size={20} strokeWidth={2} /> : <PanelLeftClose size={20} strokeWidth={2} />}
                </button>
            </div>

            {/* Brand / Header */}
            <div className={`flex items-center gap-sm px-lg pb-lg pt-4 ${collapsed ? "justify-center px-sm pb-sm" : ""}`}>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                    <UserCog size={24} strokeWidth={1.8} />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="truncate text-headline-lg-mobile font-bold tracking-normal text-on-primary">{SIDEBAR.BRAND_TITLE}</h1>
                        <p className="truncate text-body-sm text-primary-fixed-dim">{SIDEBAR.BRAND_SUBTITLE}</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={`hide-scrollbar flex-1 overflow-y-auto py-md ${collapsed ? "px-xs" : "px-sm"}`} aria-label={SIDEBAR.HEADING_NAV}>
                <ul className="flex flex-col gap-xs">
                    {filteredNavItems.map((item) => {
                        const dynamicHref = item.href.replace("/admin", `/${portal}`);
                        const isActive = dynamicHref === `/${portal}` ? pathname === `/${portal}` : pathname?.startsWith(dynamicHref);
                        return (
                            <li key={item.label}>
                                <Link
                                    href={dynamicHref}
                                    title={collapsed ? item.label : undefined}
                                    className={`focus-ring flex min-h-12 items-center gap-md rounded-lg transition-colors ${
                                        collapsed ? "justify-center px-sm py-sm" : "px-lg py-sm"
                                    } ${
                                        isActive
                                            ? collapsed
                                                ? "bg-primary-container text-on-primary-container"
                                                : "ml-0 mr-sm rounded-l-none border-l-4 border-secondary-fixed bg-primary-container font-medium text-on-primary-container"
                                            : "text-on-primary/70 hover:bg-primary-container/20 hover:text-on-primary " + (collapsed ? "" : "mx-sm")
                                    }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <item.icon size={22} strokeWidth={1.8} className="flex-shrink-0" />
                                    {!collapsed && <span className="truncate text-body-md">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom section */}
            <div className={`mt-auto flex flex-col gap-md ${collapsed ? "p-xs" : "p-lg"}`}>
                {!collapsed && (
                    <div className="flex items-center gap-sm rounded-lg border border-primary-fixed-dim/20 bg-primary-container/20 p-md text-primary-fixed-dim">
                        <ShieldCheck size={16} strokeWidth={2} />
                        <span className="text-body-sm">{SIDEBAR.SYSTEM_STATUS}</span>
                    </div>
                )}

                <div className="flex flex-col gap-xs">
                    <button
                        title={collapsed ? SIDEBAR.SUPPORT : undefined}
                        className={`focus-ring flex items-center gap-md rounded-lg py-sm text-left text-body-sm text-on-primary/70 transition-colors hover:text-on-primary ${
                            collapsed ? "justify-center px-sm" : "px-md"
                        }`}
                    >
                        <CircleHelp size={20} strokeWidth={1.8} className="flex-shrink-0" />
                        {!collapsed && SIDEBAR.SUPPORT}
                    </button>
                    <button
                        onClick={() => logout()}
                        title={collapsed ? SIDEBAR.LOGOUT : undefined}
                        className={`focus-ring flex items-center gap-md rounded-lg py-sm text-left text-body-sm text-on-primary/70 transition-colors hover:text-on-primary ${
                            collapsed ? "justify-center px-sm" : "px-md"
                        }`}
                    >
                        <LogOut size={20} strokeWidth={1.8} className="flex-shrink-0" />
                        {!collapsed && SIDEBAR.LOGOUT}
                    </button>
                </div>
            </div>
        </aside>
    );
}
