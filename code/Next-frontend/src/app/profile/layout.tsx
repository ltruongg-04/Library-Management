import type { ReactNode } from "react";
import Sidebar from "@/components/features/profile/Sidebar1";

export default function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f9]">
      {/* Top bar */}
      <header className="h-14 border-b bg-white px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1d1d8f]">Lumina Library</h1>

        <div className="flex items-center gap-4 text-gray-500">
          <button className="text-sm hover:text-black">🔔</button>
          <button className="text-sm hover:text-black">👤</button>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-[240px_1fr] gap-6">
          <Sidebar />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}