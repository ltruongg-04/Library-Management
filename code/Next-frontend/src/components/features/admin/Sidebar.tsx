"use client";

import { ArrowLeftRight, BookMarked, HelpCircle, LayoutGrid, Library, LineChart, LogOut, Plus, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";
import { useAuth } from "@/providers/auth";

const { SIDEBAR } = UI_TEXT.ADMIN;

const NAV_ITEMS = [
    { label: SIDEBAR.NAV_OVERVIEW, icon: LayoutGrid, href: "/admin" },
    { label: SIDEBAR.NAV_BOOKS, icon: Library, href: "/admin/kho-sach" },
    { label: SIDEBAR.NAV_BORROWS, icon: ArrowLeftRight, href: "/admin/luot-muon" },
    { label: SIDEBAR.NAV_MEMBERS, icon: Users, href: "/admin/thanh-vien" },
    { label: SIDEBAR.NAV_STATS, icon: LineChart, href: "/admin/thong-ke" },
    { label: SIDEBAR.NAV_SETTINGS, icon: Settings, href: "/admin/cai-dat" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col bg-primary-900 text-parchment-100">
            {/* Brand / admin identity */}
            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brass-50 to-brass-600 ring-2 ring-white/10">
                    {user?.image ? (
                        <Image src={user.image} alt={user.fullName} width={40} height={40} className="h-full w-full object-cover" />
                    ) : (
                        <BookMarked size={18} className="text-ink-950" strokeWidth={2.25} />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold leading-tight text-white" title={user?.fullName || "Quản trị viên"}>
                        {user?.fullName || "Quản trị viên"}
                    </p>
                    <p className="truncate text-xs text-white/50" title={user?.email || "Hệ thống quản lý"}>
                        {user?.email || "Hệ thống quản lý"}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="thin-scroll flex-1 overflow-y-auto px-3 py-5">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">{SIDEBAR.HEADING_NAV}</p>
                <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`focus-ring group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] font-medium transition-colors ${
                                        isActive ? "bg-secondary-300 text-ink-950 shadow-sm" : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                                    }`}
                                >
                                    <item.icon size={18} strokeWidth={2} className={isActive ? "text-ink-950" : "text-white/45 group-hover:text-white/80"} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom actions */}
            <div className="space-y-3 border-t border-white/10 px-4 py-5">
                <button className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg border border-brass-50/40 bg-brass-50/10 px-4 py-2.5 text-[14px] font-semibold text-brass-400 transition-colors hover:bg-brass-500/20">
                    <Plus size={16} strokeWidth={2.5} />
                    {SIDEBAR.ADD_BOOK}
                </button>
                <div className="flex items-center justify-between px-1 pt-1 text-[13px] text-white/45">
                    <button className="focus-ring flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:text-white/80">
                        <HelpCircle size={15} />
                        {SIDEBAR.SUPPORT}
                    </button>
                    <button onClick={() => logout()} className="focus-ring flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:text-white/80">
                        <LogOut size={15} />
                        {SIDEBAR.LOGOUT}
                    </button>
                </div>
            </div>
        </aside>
    );
}
