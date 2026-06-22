import React from 'react';
import { SettingsHeader } from '@/components/features/settings/SettingsHeader';
import { SettingsSidebar } from '@/components/features/settings/SettingsSidebar';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row">
            <SettingsHeader />
            <SettingsSidebar />
            <div className="flex-1 md:ml-sidebar-width flex flex-col min-h-screen pt-16">
                <main className="flex-1 p-lg md:p-xl w-full flex justify-center">
                    {children}
                </main>
            </div>
        </div>
    );
}
