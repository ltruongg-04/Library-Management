"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check auth status
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Check theme status
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextTheme = !prev;
      if (nextTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return nextTheme;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-lowest dark:bg-slate-950 text-on-surface dark:text-white transition-colors duration-200">
      {/* Top Navigation Bar — Glassmorphism */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-outline-variant/30 dark:border-slate-800 shadow-sm transition-all duration-200">
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
                      : "text-on-surface-variant dark:text-white hover:text-primary-700 dark:hover:text-primary-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant dark:hover:bg-slate-800 transition-colors text-on-surface-variant dark:text-white"
              aria-label="Toggle Theme"
            >
              <span className="material-symbols-outlined">
                {isDarkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>
            {isLoggedIn ? (
              <>
                <button
                  className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant dark:hover:bg-slate-800 transition-colors text-on-surface-variant dark:text-white"
                  aria-label="Notifications"
                >
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 border-2 border-surface-container-lowest dark:border-slate-800 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-all duration-200">
                  <span className="material-symbols-outlined text-primary-700 dark:text-white">
                    person
                  </span>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-primary-700 dark:bg-primary-500 text-on-primary px-6 py-2 rounded-full font-semibold text-[20px] hover:opacity-90 transition-opacity"
              >
                Đăng nhập
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
