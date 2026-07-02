"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

interface AIChatbotProps {
    bookTitle: string;
}

interface ChatMessage {
    role: "ai" | "user";
    content: string;
}

export default function AIChatbot({ bookTitle }: AIChatbotProps) {
    const [messages] = useState<ChatMessage[]>([
        {
            role: "ai",
            content: `Hello! I can help you explore "${bookTitle}". Would you like a brief summary of the core concepts, or are you looking for specific chapters on neural networks?`,
        },
        {
            role: "user",
            content: "What are the core concepts covered in the first three chapters?",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isAnalyzing] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const quickActions = ["Summarize chapters", "Find similar books", "Reading level"];

    return (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[999] flex flex-col items-end">
            <div className="pointer-events-auto flex flex-col items-end">
                {isOpen && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 mb-4 flex w-[360px] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-outline-variant/30 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:border-slate-700 dark:bg-slate-900 sm:w-[400px]">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between border-b border-outline-variant/20 bg-white p-4 pl-5 transition-colors duration-200 dark:border-slate-700/50 dark:bg-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-white">
                                    <MaterialIcon name="smart_toy" className="text-[22px]" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-white">
                                        {UI_TEXT.BOOK_DETAIL.AI_CHATBOT.TITLE}
                                    </h3>
                                    <span className="dark:text-primary-400 text-[12px] text-primary-700">{UI_TEXT.BOOK_DETAIL.AI_CHATBOT.SUBTITLE}</span>
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
                        <div className="flex flex-grow flex-col gap-4 overflow-y-auto bg-white p-4 dark:bg-slate-900">
                            {messages.map((msg, index) =>
                                msg.role === "ai" ? (
                                    <div key={index} className="flex gap-3">
                                        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-white shadow-sm">
                                            <MaterialIcon name="auto_awesome" className="text-[16px]" />
                                        </div>
                                        <div className="flex w-full flex-col gap-1">
                                            <div className="rounded-2xl rounded-tl-sm bg-[#2d3282] px-4 py-3 text-[14px] leading-relaxed text-white shadow-sm transition-colors duration-200">
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={index} className="flex justify-end gap-3">
                                        <div className="flex w-[85%] flex-col items-end gap-1">
                                            <div className="rounded-2xl rounded-tr-sm bg-[#2cb2ff] px-4 py-3 text-[14px] leading-relaxed text-slate-900 shadow-sm transition-colors duration-200">
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}

                            {/* AI Loading State */}
                            {isAnalyzing && (
                                <div className="flex items-center gap-2 text-on-surface-variant opacity-70 transition-colors duration-200 dark:text-slate-400">
                                    <div className="flex animate-pulse items-center gap-2 text-secondary dark:text-secondary-300">
                                        <MaterialIcon name="auto_awesome" className="text-[18px]" />
                                        <span className="font-label-caps text-[12px] tracking-wider">Lumina is analyzing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="rounded-b-xl border-t border-outline-variant/20 bg-white p-4 transition-colors duration-200 dark:border-slate-700/50 dark:bg-slate-900">
                            {/* Quick Actions */}
                            <div className="mb-3 flex flex-wrap gap-2 px-1">
                                {quickActions.map((action) => (
                                    <button
                                        key={action}
                                        className="cursor-pointer rounded-full border border-outline-variant/30 bg-surface-container-lowest px-3 py-1 font-label-caps text-[11px] text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container-high dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>

                            {/* Input Field */}
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Ask about this book..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="dark:focus:border-primary-400 dark:focus:ring-primary-400 w-full rounded-full border border-outline-variant/50 bg-white py-3 pl-5 pr-12 text-[14px] text-on-surface shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <button className="dark:text-primary-400 absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-primary-700 transition-colors hover:bg-surface-container dark:hover:bg-slate-700">
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
