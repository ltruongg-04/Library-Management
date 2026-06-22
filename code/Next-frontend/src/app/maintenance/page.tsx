import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Headphones } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
  title: UI_TEXT.MAINTENANCE.PAGE_TITLE,
  description: UI_TEXT.MAINTENANCE.PAGE_DESC,
};

export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f8f9fa] px-6 text-center">
      {/* Decorative AI ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10%] -top-[10%] h-[40vw] w-[40vw] rounded-full bg-primary-500/5 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[50vw] w-[50vw] rounded-full bg-secondary-300/10 blur-[150px]"
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        {/* Illustration container with AI glow */}
        <div className="mb-12 h-64 w-64 overflow-hidden rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.10),0_0_40px_rgba(45,188,254,0.20)] md:h-80 md:w-80">
          <Image
            src="/images/maintenance-illustration.png"
            alt={UI_TEXT.MAINTENANCE.IMG_ALT}
            width={320}
            height={320}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        {/* Heading — display-lg on desktop, headline-lg-mobile on mobile */}
        <h1 className="mb-4 text-[24px] font-semibold leading-[32px] text-primary-700 md:text-[48px] md:font-bold md:leading-[56px] md:tracking-[-0.02em]">
          {UI_TEXT.MAINTENANCE.HEADING}
        </h1>

        {/* Body text — body-md */}
        <p className="mx-auto mb-12 max-w-lg text-[16px] leading-[24px] text-[#464652]">
          {UI_TEXT.MAINTENANCE.SUBHEADING}
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center">
          {/* Primary button — Solid Deep Indigo for Gmail Web Compose */}
          <Link
            id="maintenance-support-btn"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=support@lumina.edu&su=Hỗ trợ trong thời gian bảo trì"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 text-[16px] font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-colors duration-150 ease-in-out hover:bg-primary-700 active:bg-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Headphones size={20} aria-hidden="true" />
            {UI_TEXT.MAINTENANCE.CONTACT_BTN}
          </Link>
        </div>
      </div>
    </main>
  );
}
