'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Shield, Bell, Bot } from 'lucide-react';

export function SettingsSidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Personal Info', href: '/settings/profile', icon: User },
        { name: 'Security', href: '/settings/security', icon: Shield },
        { name: 'Notifications', href: '/settings/notifications', icon: Bell },
        { name: 'AI Configuration', href: '/settings/ai', icon: Bot },
    ];

    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-sidebar-width bg-transparent text-on-surface z-40 hidden md:flex flex-col border-r border-transparent">
            <div className="flex flex-col h-full py-xl">
                <div className="px-lg mb-md">
                    <h3 className="font-title-md text-title-md font-semibold text-on-surface">Settings</h3>
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
                                        ? 'bg-secondary-fixed text-on-secondary-container border-l-4 border-primary rounded-r-lg'
                                        : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface rounded-lg'
                                }`}
                            >
                                <Icon size={20} className={isActive ? 'text-primary' : ''} />
                                <span className={isActive ? 'font-bold' : ''}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
