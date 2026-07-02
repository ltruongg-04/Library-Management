"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

export default function SupportChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[999] flex flex-col items-end">
            <div className="pointer-events-auto flex flex-col items-end">
                {isOpen && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 mb-4 flex w-[360px] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-outline-variant/30 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:border-slate-700 dark:bg-slate-900 sm:w-[400px]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-outline-variant/20 p-4 pl-5 dark:border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-white">
                                    <MaterialIcon name="smart_toy" className="text-[22px]" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-white">
                                        {UI_TEXT.BORROW.SUPPORT_CHAT.TITLE}
                                    </h3>
                                    <span className="dark:text-primary-400 text-[12px] text-primary-700">{UI_TEXT.BORROW.SUPPORT_CHAT.SUBTITLE}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-on-surface-variant dark:text-slate-400">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-surface-container-low hover:text-on-surface"
                                >
                                    <MaterialIcon name="close" className="text-[22px]" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex h-[320px] flex-col overflow-y-auto bg-white p-6 dark:bg-slate-900">
                            <div className="flex gap-3">
                                {/* Avatar */}
                                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-white shadow-sm">
                                    <MaterialIcon name="auto_awesome" className="text-[16px]" />
                                </div>
                                {/* Message Bubble */}
                                <div className="flex w-full flex-col gap-1">
                                    <div className="rounded-2xl rounded-tl-sm bg-[#2d3282] px-4 py-3 text-[14px] leading-relaxed text-white">
                                        {UI_TEXT.BORROW.SUPPORT_CHAT.GREETING_PREFIX}
                                        <strong>{UI_TEXT.BORROW.SUPPORT_CHAT.ASSISTANT_NAME}</strong>
                                        {UI_TEXT.BORROW.SUPPORT_CHAT.GREETING_SUFFIX}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-outline-variant/20 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-900">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder={UI_TEXT.BORROW.SUPPORT_CHAT.PLACEHOLDER}
                                    className="dark:focus:border-primary-400 dark:focus:ring-primary-400 w-full rounded-full border border-outline-variant/50 bg-white py-3 pl-5 pr-12 text-[14px] text-on-surface shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <button className="hover:text-primary-600 absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-primary-300">
                                    <MaterialIcon name="send" className="text-[18px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform hover:scale-105 dark:bg-slate-800"
                >
                    {/* Badge */}
                    {!isOpen && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-error text-[10px] font-bold text-white dark:border-slate-800">
                            1
                        </span>
                    )}

                    <div className="relative flex items-center justify-center text-primary-700">
                        <MaterialIcon name="smart_toy" className="text-[28px] text-primary-700" />
                        <MaterialIcon name="auto_awesome" className="absolute -left-2 -top-1 text-[14px] text-yellow-400" />
                        <MaterialIcon name="auto_awesome" className="absolute -bottom-1 -right-1 text-[12px] text-yellow-400" />
                    </div>
                </button>
            </div>
        </div>
    );
}
