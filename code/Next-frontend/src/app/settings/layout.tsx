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
        <div className="flex min-h-screen flex-col bg-white text-ink-950 transition-colors duration-200 dark:bg-slate-950 dark:text-white">
            <PublicHeader />
            <div className="flex flex-1 bg-surface-container-low pt-[72px] transition-colors duration-200 dark:bg-black">
                <SettingsSidebar />
                <main className="flex min-h-[calc(100vh-72px)] w-full flex-1 justify-center px-4 py-8 md:justify-start md:px-6 lg:px-12 lg:py-14">
                    <div className="w-full max-w-[980px] md:ml-4 lg:ml-8 xl:ml-12">
                        {children}
                    </div>
                </main>
            </div>
            <PublicFooter />
        </div>
    );
}
