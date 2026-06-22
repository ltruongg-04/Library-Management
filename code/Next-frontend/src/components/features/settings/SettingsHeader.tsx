'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, UserCircle } from 'lucide-react';

export function SettingsHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-sm h-16 px-lg w-full flex justify-between items-center border-b border-surface-variant">
            <div className="flex items-center gap-md md:hidden">
                <button className="text-primary hover:bg-surface-variant/50 p-2 rounded-full transition-colors">
                    <Menu size={24} />
                </button>
            </div>
            <div className="flex items-center gap-md">
                <Link href="/" className="font-headline-lg text-headline-lg font-black text-primary">
                    Lumina Library
                </Link>
            </div>
            <nav className="hidden md:flex items-center gap-lg">
                <Link href="/catalog" className="text-on-surface-variant hover:text-primary hover:text-secondary-container transition-all font-body-md text-body-md">Catalog</Link>
                <Link href="/collections" className="text-on-surface-variant hover:text-primary hover:text-secondary-container transition-all font-body-md text-body-md">Collections</Link>
                <Link href="/branches" className="text-on-surface-variant hover:text-primary hover:text-secondary-container transition-all font-body-md text-body-md">Branches</Link>
            </nav>
            <div className="flex items-center gap-md">
                <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-variant/50">
                    <Bell size={24} />
                </button>
                <button className="text-on-surface-variant hover:text-primary transition-colors md:block hidden p-2 rounded-full hover:bg-surface-variant/50">
                    <UserCircle size={24} />
                </button>
                <img 
                    alt="User Avatar" 
                    className="w-8 h-8 rounded-full md:hidden object-cover border border-surface-variant" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5bBAoQO56BJP3isPb04fkfCc65eAwo8VWUooeZuz0bomeeB9K2bEpi1ObDtOgjg9RGSKOKq6tehZLWelRl1e10Vjb3VMfpnWOV87ggJOQGaOlUN56FfmcX3fF3nBXkygLebQVcyrh4uM88i7LQKgUwNTDCF-VcCKxIFYrb28zksXRE8EJES5aoa2cX5yzQC-uH9iRSkge0munCPN6ylMzHhs8pPVoWxsHGZ-v_zHcDqYxSfNk640d3S2OKSp62wJo6d1krUma8fdS" 
                />
            </div>
        </header>
    );
}
