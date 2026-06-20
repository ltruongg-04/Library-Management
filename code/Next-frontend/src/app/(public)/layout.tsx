"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar — Glassmorphism */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-200">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1440px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-sans text-[32px] font-bold text-primary-700 tracking-tight"
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
                      ? "text-primary-700 border-b-2 border-primary-700"
                      : "text-on-surface-variant hover:text-primary-700"
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
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <Link
              href="/login"
              className="bg-primary-700 text-on-primary px-6 py-2 rounded-full font-semibold text-[20px] hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
            <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-surface-container-lowest flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-primary-700">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[80px]">{children}</main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant/50 w-full py-12 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1440px] mx-auto gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-bold text-primary-700">
              Lumina Library
            </span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] text-on-surface-variant hover:text-secondary-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="text-[14px] text-on-surface-variant text-center md:text-right">
            © 2026 Lumina Library AI. Powered by Illuminated Intelligence.
          </div>
        </div>
      </footer>
    </div>
  );
}
