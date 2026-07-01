import { BookOpen, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { UI_TEXT } from "@/constants/ui-text";

type MobileVisitNavProps = {
    currentPath: string;
};

export function MobileVisitNav({ currentPath }: MobileVisitNavProps) {
    const items = [
        { name: UI_TEXT.BOOK_VISIT.SIDEBAR.MENU.BOOK_VISIT, href: currentPath || "/", icon: CalendarDays },
        { name: UI_TEXT.BOOK_VISIT.SIDEBAR.MENU.RESOURCES, href: "/sach", icon: BookOpen },
        { name: UI_TEXT.BOOK_VISIT.SIDEBAR.MENU.CONTACT, href: "/lien-he", icon: MapPin },
    ];

    return (
        <nav className="mb-6 grid grid-cols-3 gap-2 md:hidden">
            {items.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === 0;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-center text-[12px] transition-colors ${
                            isActive
                                ? "border-l-4 border-secondary-300 bg-secondary-fixed font-medium text-primary-700 dark:bg-primary-900 dark:text-secondary-50"
                                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container dark:bg-slate-900 dark:text-slate-300"
                        }`}
                    >
                        <Icon size={18} />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
