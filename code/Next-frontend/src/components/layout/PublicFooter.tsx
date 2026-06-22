"use client";

import Link from "next/link";

import { UI_TEXT } from "@/constants/ui-text";

const FOOTER_LINKS = [
  { href: "/terms", label: UI_TEXT.PUBLIC_LAYOUT.FOOTER_LINKS.TERMS },
  { href: "/privacy", label: UI_TEXT.PUBLIC_LAYOUT.FOOTER_LINKS.PRIVACY },
  { href: "/lien-he", label: UI_TEXT.PUBLIC_LAYOUT.FOOTER_LINKS.CONTACT },
  { href: "/api-docs", label: UI_TEXT.PUBLIC_LAYOUT.FOOTER_LINKS.API_DOCS },
];

export function PublicFooter() {
  return (
      <footer className="bg-surface-container-low dark:bg-slate-900 border-t border-outline-variant/50 dark:border-slate-800 w-full py-12 mt-auto transition-colors duration-200 z-50 relative">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1440px] mx-auto gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-bold text-primary-700 dark:text-white">
              {UI_TEXT.PROFILE.LAYOUT.BRAND}
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
            {UI_TEXT.PUBLIC_LAYOUT.FOOTER_LINKS.COPYRIGHT}
          </div>
        </div>
      </footer>
  );
}
