"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/base/material-icon";

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

  const quickActions = [
    "Summarize chapters",
    "Find similar books",
    "Reading level",
  ];

  return (
    <div className="glass-panel dark:bg-slate-900/50 rounded-xl ai-glow h-[500px] flex flex-col sticky top-24 transition-colors duration-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-outline-variant/20 dark:border-slate-700 flex items-center gap-2 bg-surface-container-lowest/50 dark:bg-slate-900/50 rounded-t-xl transition-colors duration-200">
        <div className="w-8 h-8 rounded-full ai-gradient-bg flex items-center justify-center text-on-primary shadow-sm">
          <MaterialIcon name="robot_2" className="text-[18px]" />
        </div>
        <div>
          <h4 className="font-title-md text-body-md font-semibold text-on-surface dark:text-white leading-tight transition-colors duration-200">
            Lumina AI
          </h4>
          <span className="font-body-sm text-[12px] text-secondary dark:text-secondary-300 transition-colors duration-200">
            Book Summary &amp; Reading Path
          </span>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg, index) =>
          msg.role === "ai" ? (
            <div key={index} className="flex gap-2">
              <div className="w-6 h-6 rounded-full ai-gradient-bg flex-shrink-0 flex items-center justify-center text-on-primary mt-1">
                <MaterialIcon name="auto_awesome" className="text-[14px]" />
              </div>
              <div className="bg-primary-container dark:bg-primary-700 text-on-primary-container dark:text-white p-4 rounded-2xl rounded-tl-none shadow-sm font-body-md text-body-md transition-colors duration-200">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={index} className="flex gap-2 justify-end">
              <div className="bg-secondary-container dark:bg-slate-800 text-on-secondary-container dark:text-white p-4 rounded-2xl rounded-tr-none shadow-sm font-body-md text-body-md transition-colors duration-200">
                {msg.content}
              </div>
            </div>
          )
        )}

        {/* AI Loading State */}
        {isAnalyzing && (
          <div className="flex gap-2 items-center text-on-surface-variant dark:text-slate-400 opacity-70 transition-colors duration-200">
            <div className="flex items-center gap-2 animate-pulse text-secondary dark:text-secondary-300">
              <MaterialIcon name="auto_awesome" className="text-[18px]" />
              <span className="font-label-caps text-[12px] tracking-wider">
                Lumina is analyzing...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-2 bg-surface-container-lowest/80 dark:bg-slate-900/80 rounded-b-xl border-t border-outline-variant/20 dark:border-slate-700 transition-colors duration-200">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-1 mb-2 px-1">
          {quickActions.map((action) => (
            <button
              key={action}
              className="px-2 py-1 bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface-variant dark:text-white rounded-full text-[10px] font-label-caps transition-colors border border-outline-variant/20 dark:border-slate-700 cursor-pointer"
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
            className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-full py-2 pl-4 pr-10 font-body-sm text-body-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/50 dark:placeholder:text-slate-400 focus:ring-1 focus:ring-secondary focus:bg-surface-container-lowest dark:focus:bg-slate-900 transition-colors"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary dark:text-secondary-300 hover:text-primary dark:hover:text-primary-300 transition-colors cursor-pointer">
            <MaterialIcon name="send" />
          </button>
        </div>
      </div>
    </div>
  );
}
