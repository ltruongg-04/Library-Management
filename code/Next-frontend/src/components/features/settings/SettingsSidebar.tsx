'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Shield, Bell, Bot } from 'lucide-react';
import { UI_TEXT } from '@/constants/ui-text';

export function SettingsSidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: UI_TEXT.SETTINGS_SIDEBAR.MENU.PERSONAL_INFO, href: '/settings/profile', icon: User },
        { name: UI_TEXT.SETTINGS_SIDEBAR.MENU.SECURITY, href: '/settings/security', icon: Shield },
        { name: UI_TEXT.SETTINGS_SIDEBAR.MENU.NOTIFICATIONS, href: '/settings/notifications', icon: Bell },
        { name: UI_TEXT.SETTINGS_SIDEBAR.MENU.AI_CONFIG, href: '/settings/ai', icon: Bot },
    ];

    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-sidebar-width bg-white dark:bg-slate-950 text-ink-950 dark:text-white z-40 hidden md:flex flex-col border-r border-ink-100 dark:border-slate-800 transition-colors duration-200">
            <div className="flex flex-col h-full py-xl">
                <div className="px-lg mb-md">
                    <h3 className="font-title-md text-title-md font-semibold text-ink-950 dark:text-white">{UI_TEXT.SETTINGS_SIDEBAR.HEADING}</h3>
                </div>
                <nav className="flex-1 flex flex-col gap-xs px-md">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                            <Link 
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-md px-md py-sm transition-colors duration-200 ${
                                    isActive 
                                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-700 dark:border-primary-400 rounded-r-lg'
                                        : 'text-ink-600 dark:text-slate-300 hover:bg-ink-50 dark:hover:bg-slate-800 hover:text-ink-900 dark:hover:text-white rounded-lg'
                                }`}
                            >
                                <Icon size={20} className={isActive ? 'text-primary-700 dark:text-primary-400' : ''} />
                                <span className={isActive ? 'font-bold' : ''}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
