import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { SettingsSidebar } from '@/components/features/settings/SettingsSidebar';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-ink-950 dark:text-white transition-colors duration-200">
            <PublicHeader />
            <div className="flex flex-1 pt-[64px]">
                <SettingsSidebar />
                <main className="flex-1 md:ml-sidebar-width p-lg md:p-xl w-full flex justify-center">
                    {children}
                </main>
            </div>
            <PublicFooter />
        </div>
    );
}
