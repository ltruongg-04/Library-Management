'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Bot, ShieldCheck, User } from 'lucide-react';
import { UI_TEXT } from '@/constants/ui-text';

export function SettingsSidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: UI_TEXT.SETTINGS_SIDEBAR.MENU.PERSONAL_INFO, href: '/settings/profile', icon: User },
        { name: UI_TEXT.SETTINGS_SIDEBAR.MENU.SECURITY, href: '/settings/security', icon: ShieldCheck },
        { name: UI_TEXT.SETTINGS_SIDEBAR.MENU.NOTIFICATIONS, href: '/settings/notifications', icon: Bell },
        { name: UI_TEXT.SETTINGS_SIDEBAR.MENU.AI_CONFIG, href: '/settings/ai', icon: Bot },
    ];

    return (
        <aside className="hidden w-sidebar-width shrink-0 bg-surface-container-low text-on-surface transition-colors duration-200 dark:bg-black dark:text-white md:flex">
            <div className="flex w-full flex-col px-6 py-14">
                <div className="mb-8">
                    <h3 className="text-title-md font-semibold text-on-surface dark:text-white">{UI_TEXT.SETTINGS_SIDEBAR.HEADING}</h3>
                </div>
                <nav className="flex flex-1 flex-col gap-sm">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                            <Link 
                                key={item.name}
                                href={item.href}
                                className={`flex h-12 items-center gap-md rounded-lg px-md text-body-md transition-colors duration-200 ${
                                    isActive 
                                        ? 'border-l-4 border-secondary-300 bg-secondary-fixed text-primary-700 shadow-[0_4px_12px_rgba(45,188,254,0.16)] dark:border-secondary-300 dark:bg-primary-900 dark:text-secondary-50'
                                        : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <Icon size={20} strokeWidth={1.8} className={isActive ? 'text-primary-700 dark:text-secondary-300' : ''} />
                                <span className={isActive ? 'font-medium' : ''}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
