"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import { useAuth } from "@/providers/auth";
import { UI_TEXT } from "@/constants/ui-text";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-ink-950 dark:text-white transition-colors duration-200">
      {/* Top Navigation Bar */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-grow pt-[80px]">{children}</main>

      <PublicFooter />
    </div>
  );
}
