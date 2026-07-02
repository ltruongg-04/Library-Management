import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/providers/Providers";
import "../index.css";

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    weight: ["400", "500", "600"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Athenaeum — Library",
    description: "Hệ thống quản lý thư viện",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body
                className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} bg-background font-sans text-ink-950 antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-white`}
            >
                <Providers>
                    {children}
                    <Toaster position="bottom-right" richColors />
                </Providers>
            </body>
        </html>
    );
}
