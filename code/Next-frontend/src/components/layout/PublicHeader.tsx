"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import NotificationDropdown from "@/components/features/notifications/NotificationDropdown";
import { UI_TEXT } from "@/constants/ui-text";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/providers/auth";
import { DEFAULT_PROFILE_AVATAR_URL, PROFILE_UPDATED_EVENT, StoredProfileData, getProfileStorageKey, readStoredProfile } from "@/utils/profile-storage";

const NAV_LINKS = [
    { href: "/", label: UI_TEXT.PUBLIC_LAYOUT.NAV_LINKS.HOME },
    { href: "/sach", label: UI_TEXT.PUBLIC_LAYOUT.NAV_LINKS.BOOK },
    { href: "/tra-cuu", label: UI_TEXT.PUBLIC_LAYOUT.NAV_LINKS.LOOKUP },
    { href: "/gioi-thieu", label: UI_TEXT.PUBLIC_LAYOUT.NAV_LINKS.ABOUT },
    { href: "/lien-he", label: UI_TEXT.PUBLIC_LAYOUT.NAV_LINKS.CONTACT },
];

export function PublicHeader() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [storedProfile, setStoredProfile] = useState<StoredProfileData | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const notificationState = useNotifications();

    const isSettingsRoute = pathname?.startsWith("/settings");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }
    }, []);

    useEffect(() => {
        setIsNotificationOpen(false);
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const syncStoredProfile = () => {
            setStoredProfile(readStoredProfile(user));
        };

        const handleStorage = (event: StorageEvent) => {
            if (event.key === getProfileStorageKey(user)) {
                syncStoredProfile();
            }
        };

        syncStoredProfile();
        window.addEventListener(PROFILE_UPDATED_EVENT, syncStoredProfile);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(PROFILE_UPDATED_EVENT, syncStoredProfile);
            window.removeEventListener("storage", handleStorage);
        };
    }, [user]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }

            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTheme = () => {
        const htmlEl = document.documentElement;
        const isCurrentlyDark = htmlEl.classList.contains("dark");

        if (isCurrentlyDark) {
            htmlEl.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            htmlEl.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    const handleLogout = async () => {
        setIsMenuOpen(false);
        setIsNotificationOpen(false);
        await logout();
    };

    const storedAvatarUrl = storedProfile?.avatarUrl;
    const headerAvatarUrl = storedAvatarUrl && storedAvatarUrl !== DEFAULT_PROFILE_AVATAR_URL ? storedAvatarUrl : user?.image;
    const headerFullName = storedProfile?.fullName || user?.fullName || "";
    const headerEmail = user?.email || "";

    const renderNotificationButton = () => (
        <div className="relative" ref={notificationRef}>
            <button
                type="button"
                onClick={() => setIsNotificationOpen((value) => !value)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 dark:text-white dark:hover:bg-slate-800"
                aria-label={UI_TEXT.PUBLIC_LAYOUT.ARIA.NOTIFICATIONS}
                aria-expanded={isNotificationOpen}
            >
                <MaterialIcon name="notifications" />
                {notificationState.unreadCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />}
            </button>

            {isNotificationOpen && (
                <NotificationDropdown
                    notifications={notificationState.items}
                    markAsRead={notificationState.markAsRead}
                    onClose={() => setIsNotificationOpen(false)}
                />
            )}
        </div>
    );

    return (
        <header className="fixed top-0 z-50 w-full border-b border-ink-100 bg-white shadow-sm backdrop-blur-md transition-all duration-200 dark:border-slate-800 dark:bg-slate-900/90">
            <div className={`mx-auto flex items-center justify-between px-6 ${isSettingsRoute ? "h-[72px] max-w-none lg:px-14" : "h-16 max-w-[1440px]"}`}>
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className={`font-sans font-bold text-primary-700 transition-colors duration-200 dark:text-white ${
                            isSettingsRoute ? "text-[24px]" : "text-[32px] tracking-tight"
                        }`}
                    >
                        {UI_TEXT.PROFILE.LAYOUT.BRAND}
                    </Link>
                </div>

                <nav className="hidden h-full gap-6 md:flex">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex h-full flex-col justify-center text-[20px] font-semibold transition-all duration-200 active:scale-95 ${
                                    isActive
                                        ? "border-b-2 border-primary-700 text-primary-700 dark:border-primary-100 dark:text-white"
                                        : "text-ink-500 hover:text-primary-700 dark:text-white dark:hover:text-primary-100"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 dark:text-white dark:hover:bg-slate-800"
                        aria-label={UI_TEXT.PUBLIC_LAYOUT.ARIA.TOGGLE_THEME}
                    >
                        <MaterialIcon name={isDarkMode ? "light_mode" : "dark_mode"} />
                    </button>

                    {isAuthenticated && user ? (
                        <>
                            {renderNotificationButton()}

                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    id="user-avatar-btn"
                                    onClick={() => setIsMenuOpen((value) => !value)}
                                    className="dark:border-primary-600 flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-primary-300 transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                    aria-label={UI_TEXT.PUBLIC_LAYOUT.ARIA.USER_MENU}
                                    aria-expanded={isMenuOpen}
                                >
                                    {headerAvatarUrl ? (
                                        <Image src={headerAvatarUrl} alt={headerFullName} width={40} height={40} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-primary-100 dark:bg-primary-900">
                                            <MaterialIcon name="person" className="text-primary-700 dark:text-white" />
                                        </div>
                                    )}
                                </button>

                                {isMenuOpen && (
                                    <div className="animate-slide-up absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                                        <div className="border-b border-ink-100 px-4 py-3 dark:border-slate-700">
                                            <p className="truncate text-sm font-semibold text-ink-950 dark:text-white">{headerFullName}</p>
                                            <p className="truncate text-xs text-ink-500 dark:text-slate-400">{headerEmail}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/settings/profile"
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                                                    isSettingsRoute
                                                        ? "bg-ink-50 font-medium text-primary-700 dark:bg-slate-700 dark:text-white"
                                                        : "text-ink-700 hover:bg-ink-50 dark:text-slate-200 dark:hover:bg-slate-700"
                                                }`}
                                            >
                                                <MaterialIcon name="manage_accounts" className="text-[18px]" />
                                                {UI_TEXT.PUBLIC_LAYOUT.MY_ACCOUNT}
                                            </Link>
                                            <Link
                                                href="/sach-cua-toi"
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                                                    pathname?.startsWith("/sach-cua-toi")
                                                        ? "bg-ink-50 font-medium text-primary-700 dark:bg-slate-700 dark:text-white"
                                                        : "text-ink-700 hover:bg-ink-50 dark:text-slate-200 dark:hover:bg-slate-700"
                                                }`}
                                            >
                                                <MaterialIcon name="book" className="text-[18px]" />
                                                {UI_TEXT.PUBLIC_LAYOUT.MY_BOOKS_PAGE}
                                            </Link>
                                            <Link
                                                href="/lich-su"
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                                                    pathname?.startsWith("/lich-su")
                                                        ? "bg-ink-50 font-medium text-primary-700 dark:bg-slate-700 dark:text-white"
                                                        : "text-ink-700 hover:bg-ink-50 dark:text-slate-200 dark:hover:bg-slate-700"
                                                }`}
                                            >
                                                <MaterialIcon name="history" className="text-[18px]" />
                                                {UI_TEXT.PUBLIC_LAYOUT.MY_HISTORY}
                                            </Link>
                                        </div>

                                        <div className="border-t border-ink-100 py-1 dark:border-slate-700">
                                            <button
                                                type="button"
                                                id="btn-logout"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                            >
                                                <MaterialIcon name="logout" className="text-[18px]" />
                                                {UI_TEXT.PUBLIC_LAYOUT.LOGOUT}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full bg-primary-700 px-6 py-2 text-[20px] font-semibold text-on-primary transition-opacity hover:opacity-90 dark:bg-primary-500"
                        >
                            {UI_TEXT.PUBLIC_LAYOUT.LOGIN}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
