import { CalendarDays, LogIn } from "lucide-react";
import Link from "next/link";
import { UI_TEXT } from "@/constants/ui-text";

type BookVisitSidebarProps = {
    currentPath: string;
    isAuthenticated: boolean;
};

export function BookVisitSidebar({ currentPath, isAuthenticated }: BookVisitSidebarProps) {
    const navItems = [{ name: UI_TEXT.BOOK_VISIT.SIDEBAR.MENU.BOOK_VISIT, href: currentPath || "/", icon: CalendarDays, active: true }];

    return (
        <aside className="hidden w-sidebar-width shrink-0 bg-surface-container-low text-on-surface transition-colors duration-200 dark:bg-black dark:text-white md:flex">
            <div className="flex w-full flex-col px-6 py-8 lg:py-10">
                <div className="mb-8">
                    <h2 className="text-title-md font-semibold text-on-surface dark:text-white">{UI_TEXT.BOOK_VISIT.SIDEBAR.HEADING}</h2>
                </div>
                <nav className="flex flex-1 flex-col gap-sm">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex h-12 items-center gap-md rounded-lg px-md text-body-md transition-colors duration-200 ${
                                    item.active
                                        ? "border-l-4 border-secondary-300 bg-secondary-fixed text-primary-700 shadow-[0_4px_12px_rgba(45,188,254,0.16)] dark:border-secondary-300 dark:bg-primary-900 dark:text-secondary-50"
                                        : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                                }`}
                            >
                                <Icon size={20} strokeWidth={1.8} className={item.active ? "text-primary-700 dark:text-secondary-300" : ""} />
                                <span className={item.active ? "font-medium" : ""}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {!isAuthenticated && (
                    <Link
                        href="/login"
                        className="mt-8 flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-container text-body-sm font-medium text-on-primary transition-colors hover:bg-primary dark:bg-primary-900 dark:text-white"
                    >
                        <LogIn size={18} />
                        {UI_TEXT.BOOK_VISIT.ACTIONS.MEMBER_LOGIN}
                    </Link>
                )}
            </div>
        </aside>
    );
}
