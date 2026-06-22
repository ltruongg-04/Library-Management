"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Personal Info",
    href: "/profile",
  },
  {
    label: "Security",
    href: "/profile/security",
  },
  {
    label: "Notifications",
    href: "/profile/notifications",
  },
  {
    label: "AI Configuration",
    href: "/profile/ai-configuration",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white border rounded-xl p-4 h-fit shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Settings</h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}