"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import type { EbookInfo, WebReaderPackage } from "@/types/ebook";

interface StandardWebReaderProps {
    bookId: number;
    ebookInfo: EbookInfo;
    streamUrl: string;
}

type ThemeType = "ivory" | "sepia" | "charcoal" | "black";
type FontFamilyType = "serif" | "sans" | "mono";
type LineHeightType = "compact" | "normal" | "relaxed";
type ReaderWidthType = "narrow" | "medium" | "wide";

const THEME_STYLES: Record<ThemeType, { bg: string; text: string; headerBg: string; border: string; accent: string; cardBg: string }> = {
    ivory: {
        bg: "bg-[#fbf9f5]",
        text: "text-[#24211d]",
        headerBg: "bg-[#f5efe4]/90 backdrop-blur-md",
        border: "border-[#e5dcce]",
        accent: "text-amber-700 hover:text-amber-800",
        cardBg: "bg-[#f5efe4]",
    },
    sepia: {
        bg: "bg-[#f4ecd8]",
        text: "text-[#4a3b2c]",
        headerBg: "bg-[#ebe0c7]/90 backdrop-blur-md",
        border: "border-[#dcceb2]",
        accent: "text-[#7a4c28] hover:text-[#5a361a]",
        cardBg: "bg-[#ebe0c7]",
    },
    charcoal: {
        bg: "bg-[#181a1d]",
        text: "text-[#d1d5db]",
        headerBg: "bg-[#212429]/90 backdrop-blur-md",
        border: "border-[#2c3038]",
        accent: "text-amber-400 hover:text-amber-300",
        cardBg: "bg-[#212429]",
    },
    black: {
        bg: "bg-[#0b0c0e]",
        text: "text-[#b0b3b8]",
        headerBg: "bg-[#14161a]/90 backdrop-blur-md",
        border: "border-[#22252a]",
        accent: "text-amber-400 hover:text-amber-300",
        cardBg: "bg-[#14161a]",
    },
};

const WIDTH_CLASSES: Record<ReaderWidthType, string> = {
    narrow: "max-w-[640px]",
    medium: "max-w-[760px]",
    wide: "max-w-[940px]",
};

const FONT_FAMILY_CLASSES: Record<FontFamilyType, string> = {
    serif: "font-serif",
    sans: "font-sans",
    mono: "font-mono",
};

const LINE_HEIGHT_CLASSES: Record<LineHeightType, string> = {
    compact: "leading-[1.6]",
    normal: "leading-[1.85]",
    relaxed: "leading-[2.15]",
};

export default function StandardWebReader({ bookId, ebookInfo, streamUrl }: StandardWebReaderProps) {
    const readerContainerRef = useRef<HTMLDivElement>(null);
    const contentTopRef = useRef<HTMLDivElement>(null);

    // Data states
    const [webPackage, setWebPackage] = useState<WebReaderPackage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Reading preferences states (persisted in localStorage)
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [fontSize, setFontSize] = useState(18);
    const [fontFamily, setFontFamily] = useState<FontFamilyType>("serif");
    const [theme, setTheme] = useState<ThemeType>("ivory");
    const [lineHeight, setLineHeight] = useState<LineHeightType>("normal");
    const [readerWidth, setReaderWidth] = useState<ReaderWidthType>("medium");

    // UI overlays
    const [showTocDrawer, setShowTocDrawer] = useState(false);
    const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tocSearch, setTocSearch] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // 1. Load preferences from localStorage on mount
    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem("library_web_reader_settings");
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                if (parsed.fontSize) setFontSize(parsed.fontSize);
                if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
                if (parsed.theme) setTheme(parsed.theme);
                if (parsed.lineHeight) setLineHeight(parsed.lineHeight);
                if (parsed.readerWidth) setReaderWidth(parsed.readerWidth);
            }
        } catch {
            // ignore
        }
    }, []);

    // 2. Persist preferences
    useEffect(() => {
        try {
            localStorage.setItem("library_web_reader_settings", JSON.stringify({ fontSize, fontFamily, theme, lineHeight, readerWidth }));
        } catch {
            // ignore
        }
    }, [fontSize, fontFamily, theme, lineHeight, readerWidth]);

    // 3. Fetch Web Reader JSON package from backend stream endpoint
    useEffect(() => {
        let isMounted = true;
        const fetchPackage = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(streamUrl, {
                    credentials: "include",
                });
                if (!res.ok) {
                    throw new Error(UI_TEXT.EBOOK_READER.ERROR_STATE.SUBTITLE);
                }
                const data: WebReaderPackage = await res.json();
                if (isMounted) {
                    setWebPackage(data);

                    // Check last read chapter from localStorage
                    const savedChapter = localStorage.getItem(`library_book_${bookId}_chapter`);
                    if (savedChapter) {
                        const targetIdx = parseInt(savedChapter, 10);
                        if (!isNaN(targetIdx) && targetIdx >= 0 && targetIdx < data.chapters.length) {
                            if (ebookInfo.previewOnly && targetIdx >= (ebookInfo.allowedPages || 5)) {
                                setCurrentChapterIndex(0);
                            } else {
                                setCurrentChapterIndex(targetIdx);
                                setToastMessage(UI_TEXT.EBOOK_READER.WEB_READER.LAST_READ_RESTORED);
                                setTimeout(() => setToastMessage(null), 3500);
                            }
                        }
                    }
                }
            } catch (err: any) {
                console.error("Failed to load web reader package:", err);
                if (isMounted) {
                    setError(err.message || UI_TEXT.EBOOK_READER.ERROR_STATE.SUBTITLE);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPackage();
        return () => {
            isMounted = false;
        };
    }, [bookId, ebookInfo.allowedPages, ebookInfo.previewOnly, streamUrl]);

    // 4. Save current reading progress to localStorage
    useEffect(() => {
        if (webPackage && currentChapterIndex >= 0) {
            localStorage.setItem(`library_book_${bookId}_chapter`, String(currentChapterIndex));
        }
    }, [bookId, currentChapterIndex, webPackage]);

    // 5. Navigate chapter with scroll to top
    const goToChapter = useCallback(
        (index: number) => {
            if (!webPackage) return;
            const target = Math.max(0, Math.min(index, webPackage.chapters.length - 1));
            setCurrentChapterIndex(target);
            setShowTocDrawer(false);
            if (contentTopRef.current) {
                contentTopRef.current.scrollIntoView({ behavior: "smooth" });
            } else if (readerContainerRef.current) {
                readerContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }
        },
        [webPackage],
    );

    // 6. Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === "k") {
                if (webPackage && currentChapterIndex < webPackage.chapters.length - 1) {
                    goToChapter(currentChapterIndex + 1);
                }
            } else if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "j") {
                if (currentChapterIndex > 0) {
                    goToChapter(currentChapterIndex - 1);
                }
            } else if (e.key === "t" || e.key === "T") {
                setShowTocDrawer((prev) => !prev);
            } else if (e.key === "Escape") {
                setShowTocDrawer(false);
                setShowSettingsDrawer(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentChapterIndex, goToChapter, webPackage]);

    // Fullscreen handler
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            readerContainerRef.current?.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    // Filter TOC list
    const filteredToc = useMemo(() => {
        if (!webPackage) return [];
        if (!tocSearch.trim()) return webPackage.toc;
        const q = tocSearch.toLowerCase();
        return webPackage.toc.filter((item) => item.title.toLowerCase().includes(q));
    }, [webPackage, tocSearch]);

    // Current theme colors
    const currentThemeStyle = THEME_STYLES[theme];

    // Check paywall gate for current chapter
    const isPaywalled = useMemo(() => {
        if (!ebookInfo.previewOnly) return false;
        const allowedLimit = ebookInfo.allowedPages || 5;
        return currentChapterIndex >= allowedLimit;
    }, [currentChapterIndex, ebookInfo.allowedPages, ebookInfo.previewOnly]);

    const currentChapter = webPackage?.chapters[currentChapterIndex] || null;
    const progressPercent = webPackage ? Math.round(((currentChapterIndex + 1) / webPackage.chapters.length) * 100) : 0;

    if (loading) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-[#fbf9f5] text-[#24211d]">
                <div className="relative mb-6 h-16 w-16">
                    <div className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-20" />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-800 shadow-sm">
                        <MaterialIcon name="auto_stories" className="animate-pulse text-3xl" />
                    </div>
                </div>
                <h3 className="font-serif text-xl font-medium tracking-wide">{UI_TEXT.EBOOK_READER.HEADER.LOADING}</h3>
                <p className="mt-2 font-sans text-sm text-stone-500">{UI_TEXT.EBOOK_READER.WEB_READER.TITLE_HEADER}</p>
            </div>
        );
    }

    if (error || !webPackage) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-stone-50 p-6 text-stone-800">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <MaterialIcon name="error_outline" className="text-3xl" />
                </div>
                <h3 className="text-xl font-semibold">{UI_TEXT.EBOOK_READER.ERROR_STATE.TITLE}</h3>
                <p className="mt-2 max-w-md text-center text-sm text-stone-600">{error}</p>
                <Link
                    href={`/sach/${bookId}`}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-800"
                >
                    <MaterialIcon name="arrow_back" className="text-lg" />
                    {UI_TEXT.EBOOK_READER.HEADER.BACK_TO_DETAIL}
                </Link>
            </div>
        );
    }

    return (
        <div
            ref={readerContainerRef}
            className={`relative min-h-screen w-full ${currentThemeStyle.bg} ${currentThemeStyle.text} select-text transition-colors duration-200`}
        >
            {/* Top Reading Progress Line */}
            <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-stone-200/40 dark:bg-stone-800/40">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="animate-fade-in fixed left-1/2 top-16 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-stone-900/90 px-5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md">
                    <MaterialIcon name="history" className="text-base text-amber-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* 1. Header Toolbar */}
            <header
                className={`sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b px-4 sm:px-8 ${currentThemeStyle.headerBg} ${currentThemeStyle.border} transition-colors`}
            >
                {/* Left: Back button + Title */}
                <div className="flex items-center gap-3 overflow-hidden">
                    <Link
                        href={`/sach/${bookId}`}
                        title={UI_TEXT.EBOOK_READER.HEADER.BACK_TO_DETAIL}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${currentThemeStyle.border} transition-colors hover:bg-black/5 dark:hover:bg-white/5`}
                    >
                        <MaterialIcon name="arrow_back" className="text-lg" />
                    </Link>
                    <div className="truncate">
                        <h1 className="truncate font-serif text-sm font-semibold tracking-wide sm:text-base">{webPackage.title}</h1>
                        <p className="truncate text-xs opacity-70">
                            {webPackage.author} •{" "}
                            {UI_TEXT.EBOOK_READER.WEB_READER.CHAPTER_OF.replace("{current}", String(currentChapterIndex + 1)).replace(
                                "{total}",
                                String(webPackage.chapters.length),
                            )}
                        </p>
                    </div>
                </div>

                {/* Right: Actions (TOC, Settings, Fullscreen) */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Badge Preview / Full */}
                    <span
                        className={`hidden items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium sm:inline-flex ${
                            ebookInfo.previewOnly
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                        <MaterialIcon name={ebookInfo.previewOnly ? "visibility" : "verified"} className="text-xs" />
                        {ebookInfo.previewOnly ? UI_TEXT.EBOOK_READER.HEADER.PREVIEW_BADGE : UI_TEXT.EBOOK_READER.HEADER.FULL_BADGE}
                    </span>

                    {/* TOC Drawer Toggle */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowTocDrawer(true);
                            setShowSettingsDrawer(false);
                        }}
                        title={UI_TEXT.EBOOK_READER.WEB_READER.TOC_DRAWER_TITLE}
                        className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium sm:text-sm ${currentThemeStyle.border} transition-colors hover:bg-black/5 dark:hover:bg-white/5`}
                    >
                        <MaterialIcon name="menu_book" className="text-base" />
                        <span className="hidden md:inline">{UI_TEXT.EBOOK_READER.WEB_READER.TOC_DRAWER_TITLE}</span>
                    </button>

                    {/* Settings Popover Toggle */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowSettingsDrawer(true);
                            setShowTocDrawer(false);
                        }}
                        title={UI_TEXT.EBOOK_READER.WEB_READER.SETTINGS_DRAWER_TITLE}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${currentThemeStyle.border} transition-colors hover:bg-black/5 dark:hover:bg-white/5`}
                    >
                        <MaterialIcon name="text_fields" className="text-base" />
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        title={isFullscreen ? UI_TEXT.EBOOK_READER.HEADER.FULLSCREEN_EXIT : UI_TEXT.EBOOK_READER.HEADER.FULLSCREEN_ENTER}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${currentThemeStyle.border} transition-colors hover:bg-black/5 dark:hover:bg-white/5`}
                    >
                        <MaterialIcon name={isFullscreen ? "fullscreen_exit" : "fullscreen"} className="text-base" />
                    </button>
                </div>
            </header>

            {/* 2. Reading Canvas & Chapter Content */}
            <main className="relative flex justify-center px-4 py-8 sm:px-6 sm:py-16">
                <div ref={contentTopRef} className="absolute -top-16" />

                <div className={`w-full ${WIDTH_CLASSES[readerWidth]} transition-all duration-300`}>
                    {/* Chapter Header Info */}
                    {currentChapter && !isPaywalled && (
                        <div className="border-current/10 mb-8 border-b pb-4 text-center opacity-75">
                            <span className="font-sans text-xs font-medium uppercase tracking-widest">
                                {UI_TEXT.EBOOK_READER.WEB_READER.CHAPTER_OF.replace("{current}", String(currentChapterIndex + 1)).replace(
                                    "{total}",
                                    String(webPackage.chapters.length),
                                )}
                            </span>
                            <h2 className="mt-1 font-serif text-2xl font-medium tracking-tight sm:text-3xl">{currentChapter.title}</h2>
                        </div>
                    )}

                    {/* Paywall Banner or Reflowable Content */}
                    {isPaywalled ? (
                        <div className={`rounded-3xl border p-8 text-center shadow-lg sm:p-12 ${currentThemeStyle.cardBg} ${currentThemeStyle.border}`}>
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                <MaterialIcon name="lock" className="text-3xl" />
                            </div>
                            <h3 className="font-serif text-2xl font-semibold tracking-wide">{UI_TEXT.EBOOK_READER.WEB_READER.PAYWALL_TITLE}</h3>
                            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed opacity-85 sm:text-base">
                                {UI_TEXT.EBOOK_READER.WEB_READER.PAYWALL_DESC.replace("{allowed}", String(ebookInfo.allowedPages || 5))}
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href="/dang-nhap"
                                    className="flex items-center gap-2 rounded-xl bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-amber-800"
                                >
                                    <MaterialIcon name="login" className="text-base" />
                                    {UI_TEXT.EBOOK_READER.WEB_READER.BTN_LOGIN}
                                </Link>
                                <Link
                                    href="/nang-cap"
                                    className={`flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold ${currentThemeStyle.border} transition-colors hover:bg-black/5 dark:hover:bg-white/5`}
                                >
                                    <MaterialIcon name="workspace_premium" className="text-base text-amber-500" />
                                    {UI_TEXT.EBOOK_READER.WEB_READER.BTN_UPGRADE}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <article
                            className={`web-reader-content ${FONT_FAMILY_CLASSES[fontFamily]} ${LINE_HEIGHT_CLASSES[lineHeight]}`}
                            style={{ fontSize: `${fontSize}px` }}
                            dangerouslySetInnerHTML={{
                                __html: currentChapter?.html || `<p>${UI_TEXT.EBOOK_READER.WEB_READER.EMPTY_CHAPTER}</p>`,
                            }}
                        />
                    )}

                    {/* Chapter Bottom Divider Fleuron */}
                    {!isPaywalled && (
                        <div className="my-14 flex items-center justify-center opacity-40">
                            <span className="font-serif text-2xl">❦ • • • ❦</span>
                        </div>
                    )}

                    {/* 3. Bottom Navigation Controls (Prev / Next Chapter) */}
                    <nav className={`mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row ${currentThemeStyle.border}`}>
                        <button
                            type="button"
                            disabled={currentChapterIndex <= 0}
                            onClick={() => goToChapter(currentChapterIndex - 1)}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-colors sm:w-auto ${
                                currentChapterIndex <= 0
                                    ? "border-current/10 cursor-not-allowed opacity-30"
                                    : `${currentThemeStyle.border} hover:bg-black/5 dark:hover:bg-white/5`
                            }`}
                        >
                            <MaterialIcon name="arrow_back_ios" className="text-sm" />
                            <span>{UI_TEXT.EBOOK_READER.WEB_READER.PREV_CHAPTER}</span>
                        </button>

                        <div className="text-center font-sans text-xs opacity-75">
                            {UI_TEXT.EBOOK_READER.WEB_READER.CHAPTER_OF.replace("{current}", String(currentChapterIndex + 1)).replace(
                                "{total}",
                                String(webPackage.chapters.length),
                            )}
                            <span className="mx-2">•</span>
                            {UI_TEXT.EBOOK_READER.WEB_READER.CHAPTER_PROGRESS.replace("{percent}", String(progressPercent))}
                        </div>

                        <button
                            type="button"
                            disabled={currentChapterIndex >= webPackage.chapters.length - 1}
                            onClick={() => goToChapter(currentChapterIndex + 1)}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-colors sm:w-auto ${
                                currentChapterIndex >= webPackage.chapters.length - 1
                                    ? "border-current/10 cursor-not-allowed opacity-30"
                                    : `${currentThemeStyle.border} hover:bg-black/5 dark:hover:bg-white/5`
                            }`}
                        >
                            <span>{UI_TEXT.EBOOK_READER.WEB_READER.NEXT_CHAPTER}</span>
                            <MaterialIcon name="arrow_forward_ios" className="text-sm" />
                        </button>
                    </nav>
                </div>
            </main>

            {/* 4. Table of Contents Slide-over Drawer */}
            {showTocDrawer && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
                    <div className="fixed inset-0" onClick={() => setShowTocDrawer(false)} />
                    <aside
                        className={`relative z-10 flex h-full w-full max-w-md flex-col border-l shadow-2xl ${currentThemeStyle.cardBg} ${currentThemeStyle.border} ${currentThemeStyle.text} animate-slide-left`}
                    >
                        {/* Drawer Header */}
                        <div className={`flex items-center justify-between border-b p-5 ${currentThemeStyle.border}`}>
                            <div>
                                <h3 className="font-serif text-lg font-bold tracking-wide">{UI_TEXT.EBOOK_READER.WEB_READER.TOC_DRAWER_TITLE}</h3>
                                <p className="mt-0.5 font-sans text-xs opacity-70">
                                    {UI_TEXT.EBOOK_READER.WEB_READER.TOC_DRAWER_SUBTITLE.replace("{total}", String(webPackage.chapters.length))
                                        .replace("{words}", String(webPackage.totalWords.toLocaleString()))
                                        .replace("{minutes}", String(webPackage.estimatedReadingMinutes))}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowTocDrawer(false)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border ${currentThemeStyle.border} transition-colors hover:bg-black/5 dark:hover:bg-white/5`}
                            >
                                <MaterialIcon name="close" className="text-lg" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="border-current/10 border-b p-4">
                            <div className="relative">
                                <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-50" />
                                <input
                                    type="text"
                                    value={tocSearch}
                                    onChange={(e) => setTocSearch(e.target.value)}
                                    placeholder={UI_TEXT.EBOOK_READER.NAVIGATION.PAGE_INPUT_PLACEHOLDER}
                                    className={`w-full rounded-xl border bg-transparent py-2 pl-9 pr-3 text-xs sm:text-sm ${currentThemeStyle.border} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                                />
                            </div>
                        </div>

                        {/* Chapters List */}
                        <div className="flex-1 space-y-1 overflow-y-auto p-3">
                            {filteredToc.map((item) => {
                                const isCurrent = item.index === currentChapterIndex;
                                const isLocked = ebookInfo.previewOnly && item.index >= (ebookInfo.allowedPages || 5);
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => goToChapter(item.index)}
                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all ${
                                            isCurrent ? "bg-amber-600 font-medium text-white shadow-sm" : "hover:bg-black/5 dark:hover:bg-white/5"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 truncate">
                                            <span className={`text-xs ${isCurrent ? "text-amber-100" : "opacity-50"}`}>
                                                {String(item.index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="truncate">{item.title}</span>
                                        </div>
                                        {isLocked && !isCurrent && <MaterialIcon name="lock" className="text-xs text-amber-500 opacity-80" />}
                                    </button>
                                );
                            })}
                        </div>
                    </aside>
                </div>
            )}

            {/* 5. Reading Settings Slide-over Drawer */}
            {showSettingsDrawer && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
                    <div className="fixed inset-0" onClick={() => setShowSettingsDrawer(false)} />
                    <aside
                        className={`relative z-10 flex h-full w-full max-w-sm flex-col border-l shadow-2xl ${currentThemeStyle.cardBg} ${currentThemeStyle.border} ${currentThemeStyle.text} animate-slide-left`}
                    >
                        {/* Drawer Header */}
                        <div className={`flex items-center justify-between border-b p-5 ${currentThemeStyle.border}`}>
                            <h3 className="font-serif text-lg font-bold tracking-wide">{UI_TEXT.EBOOK_READER.WEB_READER.SETTINGS_DRAWER_TITLE}</h3>
                            <button
                                type="button"
                                onClick={() => setShowSettingsDrawer(false)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border ${currentThemeStyle.border} transition-colors hover:bg-black/5 dark:hover:bg-white/5`}
                            >
                                <MaterialIcon name="close" className="text-lg" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm">
                            {/* Color Themes */}
                            <div>
                                <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider opacity-70">
                                    {UI_TEXT.EBOOK_READER.WEB_READER.THEME_LABEL}
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setTheme("ivory")}
                                        className={`flex items-center gap-2.5 rounded-xl border bg-[#fbf9f5] p-2.5 text-xs font-medium text-[#24211d] ${
                                            theme === "ivory" ? "border-amber-600 font-bold ring-2 ring-amber-600" : "border-[#e5dcce]"
                                        }`}
                                    >
                                        <div className="h-4 w-4 rounded-full border border-stone-300 bg-[#fbf9f5]" />
                                        <span>{UI_TEXT.EBOOK_READER.WEB_READER.THEME_IVORY}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTheme("sepia")}
                                        className={`flex items-center gap-2.5 rounded-xl border bg-[#f4ecd8] p-2.5 text-xs font-medium text-[#4a3b2c] ${
                                            theme === "sepia" ? "border-amber-600 font-bold ring-2 ring-amber-600" : "border-[#dcceb2]"
                                        }`}
                                    >
                                        <div className="h-4 w-4 rounded-full border border-[#d6be96] bg-[#f4ecd8]" />
                                        <span>{UI_TEXT.EBOOK_READER.WEB_READER.THEME_SEPIA}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTheme("charcoal")}
                                        className={`flex items-center gap-2.5 rounded-xl border bg-[#181a1d] p-2.5 text-xs font-medium text-[#d1d5db] ${
                                            theme === "charcoal" ? "border-amber-400 font-bold ring-2 ring-amber-400" : "border-[#2c3038]"
                                        }`}
                                    >
                                        <div className="h-4 w-4 rounded-full border border-stone-600 bg-[#181a1d]" />
                                        <span>{UI_TEXT.EBOOK_READER.WEB_READER.THEME_CHARCOAL}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTheme("black")}
                                        className={`flex items-center gap-2.5 rounded-xl border bg-[#0b0c0e] p-2.5 text-xs font-medium text-[#b0b3b8] ${
                                            theme === "black" ? "border-amber-400 font-bold ring-2 ring-amber-400" : "border-[#22252a]"
                                        }`}
                                    >
                                        <div className="h-4 w-4 rounded-full border border-stone-700 bg-[#0b0c0e]" />
                                        <span>{UI_TEXT.EBOOK_READER.WEB_READER.THEME_BLACK}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Font Family */}
                            <div>
                                <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider opacity-70">
                                    {UI_TEXT.EBOOK_READER.WEB_READER.FONT_FAMILY_LABEL}
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFontFamily("serif")}
                                        className={`rounded-xl border py-2.5 font-serif text-xs font-medium ${
                                            fontFamily === "serif"
                                                ? "border-amber-600 bg-amber-600 text-white"
                                                : `${currentThemeStyle.border} hover:bg-black/5 dark:hover:bg-white/5`
                                        }`}
                                    >
                                        {UI_TEXT.EBOOK_READER.WEB_READER.FONT_SERIF}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFontFamily("sans")}
                                        className={`rounded-xl border py-2.5 font-sans text-xs font-medium ${
                                            fontFamily === "sans"
                                                ? "border-amber-600 bg-amber-600 text-white"
                                                : `${currentThemeStyle.border} hover:bg-black/5 dark:hover:bg-white/5`
                                        }`}
                                    >
                                        {UI_TEXT.EBOOK_READER.WEB_READER.FONT_SANS}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFontFamily("mono")}
                                        className={`rounded-xl border py-2.5 font-mono text-xs font-medium ${
                                            fontFamily === "mono"
                                                ? "border-amber-600 bg-amber-600 text-white"
                                                : `${currentThemeStyle.border} hover:bg-black/5 dark:hover:bg-white/5`
                                        }`}
                                    >
                                        {UI_TEXT.EBOOK_READER.WEB_READER.FONT_MONO}
                                    </button>
                                </div>
                            </div>

                            {/* Font Size */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                                        {UI_TEXT.EBOOK_READER.WEB_READER.FONT_SIZE_LABEL}
                                    </label>
                                    <span className="font-mono text-xs font-medium">{fontSize}px</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        disabled={fontSize <= 14}
                                        onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                                        className={`flex h-10 flex-1 items-center justify-center rounded-xl border text-sm font-semibold ${currentThemeStyle.border} hover:bg-black/5 dark:hover:bg-white/5`}
                                    >
                                        A-
                                    </button>
                                    <button
                                        type="button"
                                        disabled={fontSize >= 26}
                                        onClick={() => setFontSize((s) => Math.min(26, s + 2))}
                                        className={`flex h-10 flex-1 items-center justify-center rounded-xl border text-sm font-semibold ${currentThemeStyle.border} hover:bg-black/5 dark:hover:bg-white/5`}
                                    >
                                        A+
                                    </button>
                                </div>
                            </div>

                            {/* Line Height */}
                            <div>
                                <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider opacity-70">
                                    {UI_TEXT.EBOOK_READER.WEB_READER.LINE_HEIGHT_LABEL}
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["compact", "normal", "relaxed"] as LineHeightType[]).map((lh) => (
                                        <button
                                            key={lh}
                                            type="button"
                                            onClick={() => setLineHeight(lh)}
                                            className={`rounded-xl border py-2 text-xs font-medium capitalize ${
                                                lineHeight === lh
                                                    ? "border-amber-600 bg-amber-600 text-white"
                                                    : `${currentThemeStyle.border} hover:bg-black/5 dark:hover:bg-white/5`
                                            }`}
                                        >
                                            {lh === "compact"
                                                ? UI_TEXT.EBOOK_READER.WEB_READER.LINE_COMPACT
                                                : lh === "normal"
                                                  ? UI_TEXT.EBOOK_READER.WEB_READER.LINE_NORMAL
                                                  : UI_TEXT.EBOOK_READER.WEB_READER.LINE_RELAXED}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reader Width */}
                            <div>
                                <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider opacity-70">
                                    {UI_TEXT.EBOOK_READER.WEB_READER.READER_WIDTH_LABEL}
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["narrow", "medium", "wide"] as ReaderWidthType[]).map((w) => (
                                        <button
                                            key={w}
                                            type="button"
                                            onClick={() => setReaderWidth(w)}
                                            className={`rounded-xl border py-2 text-xs font-medium ${
                                                readerWidth === w
                                                    ? "border-amber-600 bg-amber-600 text-white"
                                                    : `${currentThemeStyle.border} hover:bg-black/5 dark:hover:bg-white/5`
                                            }`}
                                        >
                                            {w === "narrow"
                                                ? UI_TEXT.EBOOK_READER.WEB_READER.WIDTH_NARROW
                                                : w === "medium"
                                                  ? UI_TEXT.EBOOK_READER.WEB_READER.WIDTH_MEDIUM
                                                  : UI_TEXT.EBOOK_READER.WEB_READER.WIDTH_WIDE}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* Injected Bookish Typographic Styles */}
            <style jsx global>{`
                .web-reader-content {
                    text-rendering: optimizeLegibility;
                    font-feature-settings:
                        "kern" 1,
                        "liga" 1;
                    word-break: break-word;
                }
                .web-reader-content p {
                    text-indent: 1.5em;
                    margin-top: 0;
                    margin-bottom: 0.35em;
                    text-align: justify;
                }
                .web-reader-content p:first-of-type,
                .web-reader-content header + p,
                .web-reader-content h1 + p,
                .web-reader-content h2 + p,
                .web-reader-content h3 + p,
                .web-reader-content hr + p {
                    text-indent: 0;
                }
                .web-reader-content h1,
                .web-reader-content h2,
                .web-reader-content h3,
                .web-reader-content h4 {
                    font-variant: small-caps;
                    text-align: center;
                    margin-top: 2.5em;
                    margin-bottom: 1.5em;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                }
                .web-reader-content hr {
                    border: none;
                    border-top: 1px solid currentColor;
                    opacity: 0.25;
                    width: 25%;
                    margin: 2.5em auto;
                }
                .web-reader-content blockquote {
                    margin: 1.5em 2em;
                    padding-left: 1em;
                    border-left: 2px solid currentColor;
                    opacity: 0.9;
                    font-style: italic;
                }
                .web-reader-content img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 2em auto;
                    border-radius: 6px;
                }
                .web-reader-content header,
                .web-reader-content nav {
                    margin-bottom: 2em;
                }
                .web-reader-content [epub\\:type~="footnote"],
                .web-reader-content aside {
                    font-size: 0.85em;
                    opacity: 0.8;
                    margin-top: 2em;
                    padding-top: 1em;
                    border-top: 1px dashed currentColor;
                }
            `}</style>
        </div>
    );
}
