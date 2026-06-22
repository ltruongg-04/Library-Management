"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import { useAuth } from "@/providers/auth";
import { UI_TEXT } from "@/constants/ui-text";

const NAV_LINKS = [
  { href: "/", label: "Catalog" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/insights", label: "Insights" },
  { href: "/reports", label: "Reports" },
];

const FOOTER_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/lien-he", label: "Contact Support" },
  { href: "/api-docs", label: "API Docs" },
];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-ink-950 dark:text-white transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-ink-100 dark:border-slate-800 shadow-sm transition-all duration-200">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1440px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-sans text-[32px] font-bold text-primary-700 dark:text-white tracking-tight transition-colors duration-200"
            >
              Lumina Library
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 h-full">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col justify-center h-full text-[20px] font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "text-primary-700 dark:text-white border-b-2 border-primary-700 dark:border-primary-100"
                      : "text-ink-500 dark:text-white hover:text-primary-700 dark:hover:text-primary-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

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

            {isAuthenticated && user ? (
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
                          href="/profile"
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

      {/* Main Content */}
      <main className="flex-grow pt-[80px]">{children}</main>

      {/* Footer */}
      <footer className="bg-surface-container-low dark:bg-slate-900 border-t border-outline-variant/50 dark:border-slate-800 w-full py-12 mt-auto transition-colors duration-200">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1440px] mx-auto gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-bold text-primary-700 dark:text-white">
              Lumina Library
            </span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] text-on-surface-variant dark:text-white hover:text-secondary-500 dark:hover:text-secondary-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="text-[14px] text-on-surface-variant dark:text-white text-center md:text-right">
            © 2026 Lumina Library AI. Powered by Illuminated Intelligence.
          </div>
        </div>
      </footer>
    </div>
  );
}
