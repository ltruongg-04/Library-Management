"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import { useAuth } from "@/providers/auth";
import { UI_TEXT } from "@/constants/ui-text";

const NAV_LINKS = [
  { href: "/", label: UI_TEXT.PUBLIC_LAYOUT.NAV_LINKS.HOME },
  { href: "/gioi-thieu", label: UI_TEXT.PUBLIC_LAYOUT.NAV_LINKS.ABOUT },
  { href: "/lien-he", label: UI_TEXT.PUBLIC_LAYOUT.NAV_LINKS.CONTACT },
];

export function PublicHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isSettingsRoute = pathname.startsWith("/settings");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
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
    await logout();
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ink-100 bg-white shadow-sm backdrop-blur-md transition-all duration-200 dark:border-slate-800 dark:bg-slate-900/90">
      <div className={`mx-auto flex items-center justify-between px-6 ${isSettingsRoute ? "h-[72px] max-w-none lg:px-14" : "h-16 max-w-[1440px]"}`}>
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`font-sans font-bold text-primary-700 transition-colors duration-200 dark:text-white ${isSettingsRoute ? "text-[24px]" : "text-[32px] tracking-tight"}`}
          >
            {UI_TEXT.PROFILE.LAYOUT.BRAND}
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isSettingsRoute && <nav className="hidden h-full gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col justify-center h-full text-[20px] font-semibold transition-all duration-200 active:scale-95 ${isActive
                  ? "text-primary-700 dark:text-white border-b-2 border-primary-700 dark:border-primary-100"
                  : "text-ink-500 dark:text-white hover:text-primary-700 dark:hover:text-primary-100"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>}

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-ink-100 dark:hover:bg-slate-800 transition-colors text-ink-500 dark:text-white cursor-pointer"
            aria-label="Toggle Theme"
          >
            <MaterialIcon name={isDarkMode ? "light_mode" : "dark_mode"} />
          </button>

          {isSettingsRoute ? (
            <>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 dark:text-white dark:hover:bg-slate-800"
                aria-label="Notifications"
              >
                <MaterialIcon name="notifications" />
              </button>
              <Link
                href="/settings/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 dark:text-white dark:hover:bg-slate-800"
                aria-label="Profile"
              >
                <MaterialIcon name="account_circle" />
              </Link>
            </>
          ) : isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-ink-100 dark:hover:bg-slate-800 transition-colors text-ink-500 dark:text-white"
                aria-label="Notifications"
              >
                <MaterialIcon name="notifications" />
              </button>

              {/* Avatar + Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  id="user-avatar-btn"
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className="w-10 h-10 rounded-full border-2 border-primary-300 dark:border-primary-600 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="User menu"
                  aria-expanded={isMenuOpen}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.fullName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <MaterialIcon name="person" className="text-primary-700 dark:text-white" />
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-ink-100 dark:border-slate-700 overflow-hidden animate-slide-up z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-ink-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-ink-950 dark:text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-ink-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href="/settings/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-ink-700 dark:text-slate-200 hover:bg-ink-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <MaterialIcon name="manage_accounts" className="text-[18px]" />
                        {UI_TEXT.PUBLIC_LAYOUT.MY_ACCOUNT}
                      </Link>
                      <Link
                        href="/my-books"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-ink-700 dark:text-slate-200 hover:bg-ink-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <MaterialIcon name="book" className="text-[18px]" />
                        {UI_TEXT.PUBLIC_LAYOUT.MY_BOOKS}
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-ink-100 dark:border-slate-700 py-1">
                      <button
                        id="btn-logout"
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
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
              className="bg-primary-700 dark:bg-primary-500 text-on-primary px-6 py-2 rounded-full font-semibold text-[20px] hover:opacity-90 transition-opacity"
            >
              {UI_TEXT.PUBLIC_LAYOUT.LOGIN}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
