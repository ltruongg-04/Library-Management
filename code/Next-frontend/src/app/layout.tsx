import type { Metadata } from "next";
import "@/index.css";

export const metadata: Metadata = {
  title: "Lumina Library",
  description: "Hệ thống quản lý thư viện thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col pt-16 bg-background text-on-background font-body-md">
        {/* Navigation Bar Header có thể đặt ở đây trong layout để dùng chung cho mọi trang */}
        <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-200">
          <div className="flex justify-between items-center h-16 px-6 max-w-[1440px] mx-auto">
            <div className="flex items-center gap-8">
              <a className="text-[32px] font-bold text-primary tracking-tight" href="/">Lumina Library</a>
            </div>
          </div>
        </header>

        {children}

        {/* Footer có thể đặt ở đây trong layout để dùng chung cho mọi trang */}
        <footer className="mt-auto bg-surface-container-low border-t border-outline-variant/50 w-full py-12">
          <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1440px] mx-auto gap-4">
            <div className="text-xl font-bold text-primary">Lumina Library</div>
            <div className="text-sm text-on-surface-variant text-center md:text-right">
              © 2024 Lumina Library AI. Powered by Illuminated Intelligence.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
