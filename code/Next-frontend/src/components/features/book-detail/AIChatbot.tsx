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

    const quickActions = ["Summarize chapters", "Find similar books", "Reading level"];

    return (
        <div className="glass-panel ai-glow sticky top-24 flex h-[500px] flex-col rounded-xl transition-colors duration-200 dark:bg-slate-900/50">
            {/* Chat Header */}
            <div className="flex items-center gap-2 rounded-t-xl border-b border-outline-variant/20 bg-surface-container-lowest/50 p-4 transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900/50">
                <div className="ai-gradient-bg flex h-8 w-8 items-center justify-center rounded-full text-on-primary shadow-sm">
                    <MaterialIcon name="robot_2" className="text-[18px]" />
                </div>
                <div>
                    <h4 className="font-title-md text-body-md font-semibold leading-tight text-on-surface transition-colors duration-200 dark:text-white">
                        {UI_TEXT.BOOK_DETAIL.AI_CHATBOT.TITLE}
                    </h4>
                    <span className="font-body-sm text-[12px] text-secondary transition-colors duration-200 dark:text-secondary-300">
                        {UI_TEXT.BOOK_DETAIL.AI_CHATBOT.SUBTITLE}
                    </span>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex flex-grow flex-col gap-4 overflow-y-auto p-4">
                {messages.map((msg, index) =>
                    msg.role === "ai" ? (
                        <div key={index} className="flex gap-2">
                            <div className="ai-gradient-bg mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-on-primary">
                                <MaterialIcon name="auto_awesome" className="text-[14px]" />
                            </div>
                            <div className="rounded-2xl rounded-tl-none bg-primary-container p-4 font-body-md text-body-md text-on-primary-container shadow-sm transition-colors duration-200 dark:bg-primary-700 dark:text-white">
                                {msg.content}
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="flex justify-end gap-2">
                            <div className="rounded-2xl rounded-tr-none bg-secondary-container p-4 font-body-md text-body-md text-on-secondary-container shadow-sm transition-colors duration-200 dark:bg-slate-800 dark:text-white">
                                {msg.content}
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
            <div className="rounded-b-xl border-t border-outline-variant/20 bg-surface-container-lowest/80 p-2 transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900/80">
                {/* Quick Actions */}
                <div className="mb-2 flex flex-wrap gap-1 px-1">
                    {quickActions.map((action) => (
                        <button
                            key={action}
                            className="cursor-pointer rounded-full border border-outline-variant/20 bg-surface-container-low px-2 py-1 font-label-caps text-[10px] text-on-surface-variant transition-colors hover:bg-surface-container-high dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                            {action}
                        </button>
                    ))}
                </div>

                {/* Input Field */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Ask about this book..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full rounded-full border-none bg-surface-container-low py-2 pl-4 pr-10 font-body-sm text-body-sm text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-slate-900"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer text-secondary transition-colors hover:text-primary dark:text-secondary-300 dark:hover:text-primary-300">
                        <MaterialIcon name="send" />
                    </button>
                </div>
            </div>
        </div>
    );
}
