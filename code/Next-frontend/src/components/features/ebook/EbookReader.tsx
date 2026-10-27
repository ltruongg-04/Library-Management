"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { ebookService } from "@/services/ebook";
import type { EbookInfo } from "@/types/ebook";

interface EbookReaderProps {
    bookId: number;
    initialEbookInfo?: EbookInfo | null;
}

type ReaderTheme = "light" | "sepia" | "dark";

export default function EbookReader({ bookId, initialEbookInfo }: EbookReaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [ebookInfo, setEbookInfo] = useState<EbookInfo | null>(initialEbookInfo || null);
    const [loadingInfo, setLoadingInfo] = useState(!initialEbookInfo);
    const [loadingPdf, setLoadingPdf] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.2);
    const [theme, setTheme] = useState<ReaderTheme>("light");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [jumpInput, setJumpInput] = useState("1");

    const renderTaskRef = useRef<any>(null);

    // 1. Fetch Ebook metadata and permission
    useEffect(() => {
        let isMounted = true;
        const fetchInfo = async () => {
            try {
                setLoadingInfo(true);
                const info = await ebookService.getEbookInfo(bookId);
                if (isMounted) {
                    setEbookInfo(info);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.response?.data?.message || UI_TEXT.EBOOK_READER.ERROR_STATE.SUBTITLE);
                }
            } finally {
                if (isMounted) {
                    setLoadingInfo(false);
                }
            }
        };

        if (!initialEbookInfo) {
            fetchInfo();
        }
        return () => {
            isMounted = false;
        };
    }, [bookId, initialEbookInfo]);

    // 2. Load PDF document using pdfjs-dist
    useEffect(() => {
        if (!ebookInfo) return;

        let isMounted = true;
        const loadPdf = async () => {
            try {
                setLoadingPdf(true);
                setError(null);

                // Dynamically import pdfjs-dist in browser
                const pdfjsLib = await import("pdfjs-dist");
                // Worker configuration
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

                const streamUrl = ebookService.getEbookStreamUrl(bookId);
                const loadingTask = pdfjsLib.getDocument({
                    url: streamUrl,
                    withCredentials: true,
                });

                const doc = await loadingTask.promise;
                if (isMounted) {
                    setPdfDoc(doc);
                    setCurrentPage(1);
                    setJumpInput("1");
                }
            } catch (err: any) {
                console.error("PDF load error:", err);
                if (isMounted) {
                    setError(UI_TEXT.EBOOK_READER.ERROR_STATE.SUBTITLE);
                }
            } finally {
                if (isMounted) {
                    setLoadingPdf(false);
                }
            }
        };

        loadPdf();

        return () => {
            isMounted = false;
        };
    }, [bookId, ebookInfo]);

    // 3. Render current page on Canvas
    const renderPage = useCallback(
        async (pageNum: number) => {
            if (!pdfDoc || !canvasRef.current || !ebookInfo) return;

            // Check preview limits
            const maxAllowed = ebookInfo.allowedPages || 5;
            if (pageNum > maxAllowed) {
                setShowPaywall(true);
                return;
            } else {
                setShowPaywall(false);
            }

            try {
                const page = await pdfDoc.getPage(pageNum);
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                if (!context) return;

                // Cancel previous render task if active
                if (renderTaskRef.current) {
                    renderTaskRef.current.cancel();
                }

                const viewport = page.getViewport({ scale });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                const renderTask = page.render(renderContext);
                renderTaskRef.current = renderTask;
                await renderTask.promise;
            } catch (err: any) {
                if (err?.name !== "RenderingCancelledException") {
                    console.error("Page render error:", err);
                }
            }
        },
        [pdfDoc, scale, ebookInfo],
    );

    useEffect(() => {
        if (pdfDoc && currentPage) {
            renderPage(currentPage);
        }
    }, [pdfDoc, currentPage, scale, renderPage]);

    // Page navigation handlers
    const maxAllowed = ebookInfo?.allowedPages || 1;
    const totalBookPages = ebookInfo?.totalPages || pdfDoc?.numPages || 1;

    const handleNextPage = useCallback(() => {
        if (!ebookInfo) return;
        if (currentPage < maxAllowed) {
            const next = currentPage + 1;
            setCurrentPage(next);
            setJumpInput(String(next));
        } else if (ebookInfo.previewOnly) {
            setShowPaywall(true);
        }
    }, [currentPage, maxAllowed, ebookInfo]);

    const handlePrevPage = useCallback(() => {
        if (showPaywall) {
            setShowPaywall(false);
            return;
        }
        if (currentPage > 1) {
            const prev = currentPage - 1;
            setCurrentPage(prev);
            setJumpInput(String(prev));
        }
    }, [showPaywall, currentPage]);

    // 4. Anti-tampering / Anti-print event listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Block Print shortcut Ctrl+P / Cmd+P
            if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
                e.preventDefault();
                return;
            }
            // Page navigation
            if (e.key === "ArrowRight") {
                handleNextPage();
            } else if (e.key === "ArrowLeft") {
                handlePrevPage();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleNextPage, handlePrevPage]);

    const handleJumpPage = (e: React.FormEvent) => {
        e.preventDefault();
        const pageNum = parseInt(jumpInput, 10);
        if (isNaN(pageNum)) return;

        if (pageNum >= 1 && pageNum <= maxAllowed) {
            setCurrentPage(pageNum);
            setShowPaywall(false);
        } else if (pageNum > maxAllowed && ebookInfo?.previewOnly) {
            setCurrentPage(maxAllowed);
            setShowPaywall(true);
        }
    };

    // Zoom handlers
    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));
    const handleResetZoom = () => setScale(1.2);

    // Fullscreen toggle
    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    // Theme background styles
    const getThemeContainerClass = () => {
        switch (theme) {
            case "dark":
                return "bg-slate-950 text-slate-100";
            case "sepia":
                return "bg-[#f4ecd8] text-[#5b4636]";
            case "light":
            default:
                return "bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100";
        }
    };

    const getThemeCanvasClass = () => {
        switch (theme) {
            case "dark":
                return "filter invert hue-rotate-180 brightness-95 contrast-90 shadow-2xl rounded-sm";
            case "sepia":
                return "sepia-[0.35] brightness-95 shadow-xl rounded-sm";
            case "light":
            default:
                return "shadow-xl rounded-sm bg-white";
        }
    };

    // Loading State
    if (loadingInfo || loadingPdf) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 bg-surface dark:bg-slate-950">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="font-sans text-[16px] text-on-surface-variant dark:text-slate-300">{UI_TEXT.EBOOK_READER.HEADER.LOADING}</p>
            </div>
        );
    }

    // Error State
    if (error || !ebookInfo) {
        return (
            <div className="mx-auto flex h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                    <MaterialIcon name="menu_book" className="text-[32px]" />
                </div>
                <h3 className="mb-2 text-[20px] font-semibold text-slate-900 dark:text-white">{UI_TEXT.EBOOK_READER.ERROR_STATE.TITLE}</h3>
                <p className="mb-6 text-[14px] text-slate-600 dark:text-slate-400">{error || UI_TEXT.EBOOK_READER.ERROR_STATE.SUBTITLE}</p>
                <div className="flex gap-3">
                    <Link
                        href={`/sach/${bookId}`}
                        className="hover:bg-primary-600 rounded-lg bg-primary px-4 py-2 text-[14px] font-medium text-white transition dark:bg-primary-500"
                    >
                        {UI_TEXT.EBOOK_READER.HEADER.BACK_TO_DETAIL}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`flex min-h-[90vh] flex-col transition-colors duration-200 ${getThemeContainerClass()} select-none`}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Top Toolbar */}
            <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 bg-white/95 px-4 py-2.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
                {/* Left: Back & Title */}
                <div className="flex items-center gap-3">
                    <Link
                        href={`/sach/${bookId}`}
                        className="flex items-center gap-1 rounded-md p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        title={UI_TEXT.EBOOK_READER.HEADER.BACK_TO_DETAIL}
                    >
                        <MaterialIcon name="arrow_back" className="text-[20px]" />
                        <span className="hidden text-[13px] font-medium sm:inline">{UI_TEXT.EBOOK_READER.HEADER.BACK_TO_DETAIL}</span>
                    </Link>

                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

                    <div className="flex items-center gap-2">
                        <span className="max-w-[200px] truncate text-[14px] font-semibold text-slate-900 dark:text-white sm:max-w-[320px]">
                            {ebookInfo.bookTitle}
                        </span>

                        {ebookInfo.previewOnly ? (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                                <MaterialIcon name="visibility" className="mr-1 text-[13px]" />
                                {UI_TEXT.EBOOK_READER.HEADER.PREVIEW_BADGE} ({ebookInfo.allowedPages}/{ebookInfo.totalPages} tr.)
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                                <MaterialIcon name="verified" className="mr-1 text-[13px]" />
                                {UI_TEXT.EBOOK_READER.HEADER.FULL_BADGE}
                            </span>
                        )}
                    </div>
                </div>

                {/* Center: Page Controls */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1 && !showPaywall}
                        className="rounded p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                        title={UI_TEXT.EBOOK_READER.NAVIGATION.PREV_PAGE}
                    >
                        <MaterialIcon name="chevron_left" className="text-[22px]" />
                    </button>

                    <form onSubmit={handleJumpPage} className="flex items-center gap-1">
                        <input
                            type="text"
                            value={jumpInput}
                            onChange={(e) => setJumpInput(e.target.value)}
                            className="h-7 w-12 rounded border border-slate-300 bg-white text-center text-[13px] font-medium text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <span className="text-[13px] text-slate-500 dark:text-slate-400">/ {totalBookPages}</span>
                    </form>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage >= maxAllowed && !ebookInfo.previewOnly}
                        className="rounded p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                        title={UI_TEXT.EBOOK_READER.NAVIGATION.NEXT_PAGE}
                    >
                        <MaterialIcon name="chevron_right" className="text-[22px]" />
                    </button>
                </div>

                {/* Right: Zoom & Theme & Fullscreen */}
                <div className="flex items-center gap-1">
                    {/* Zoom Out */}
                    <button
                        onClick={handleZoomOut}
                        className="rounded p-1.5 text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        title={UI_TEXT.EBOOK_READER.HEADER.ZOOM_OUT}
                    >
                        <MaterialIcon name="zoom_out" className="text-[20px]" />
                    </button>

                    <button
                        onClick={handleResetZoom}
                        className="px-1 text-[12px] font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        {Math.round(scale * 100)}%
                    </button>

                    {/* Zoom In */}
                    <button
                        onClick={handleZoomIn}
                        className="rounded p-1.5 text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        title={UI_TEXT.EBOOK_READER.HEADER.ZOOM_IN}
                    >
                        <MaterialIcon name="zoom_in" className="text-[20px]" />
                    </button>

                    <div className="mx-1 h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

                    {/* Theme switches */}
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
                        <button
                            onClick={() => setTheme("light")}
                            className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${theme === "light" ? "shadow-xs bg-white text-slate-900 dark:bg-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}
                            title={UI_TEXT.EBOOK_READER.HEADER.THEME_LIGHT}
                        >
                            {UI_TEXT.EBOOK_READER.HEADER.THEME_LIGHT_LABEL}
                        </button>
                        <button
                            onClick={() => setTheme("sepia")}
                            className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${theme === "sepia" ? "shadow-xs bg-[#f4ecd8] text-[#5b4636]" : "text-slate-600 dark:text-slate-400"}`}
                            title={UI_TEXT.EBOOK_READER.HEADER.THEME_SEPIA}
                        >
                            {UI_TEXT.EBOOK_READER.HEADER.THEME_SEPIA_LABEL}
                        </button>
                        <button
                            onClick={() => setTheme("dark")}
                            className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${theme === "dark" ? "shadow-xs bg-slate-900 text-white" : "text-slate-600 dark:text-slate-400"}`}
                            title={UI_TEXT.EBOOK_READER.HEADER.THEME_DARK}
                        >
                            {UI_TEXT.EBOOK_READER.HEADER.THEME_DARK_LABEL}
                        </button>
                    </div>

                    <div className="mx-1 h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

                    {/* Fullscreen */}
                    <button
                        onClick={toggleFullscreen}
                        className="rounded p-1.5 text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        title={isFullscreen ? UI_TEXT.EBOOK_READER.HEADER.FULLSCREEN_EXIT : UI_TEXT.EBOOK_READER.HEADER.FULLSCREEN_ENTER}
                    >
                        <MaterialIcon name={isFullscreen ? "fullscreen_exit" : "fullscreen"} className="text-[20px]" />
                    </button>
                </div>
            </header>

            {/* Reading Viewport */}
            <main className="relative flex flex-1 items-center justify-center overflow-auto p-4 md:p-8">
                {/* Watermark Protection Overlay */}
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-[0.035] dark:opacity-[0.06]">
                    <span className="rotate-[-25deg] text-[48px] font-bold uppercase tracking-widest md:text-[72px]">{UI_TEXT.EBOOK_READER.WATERMARK}</span>
                </div>

                {/* Paywall Overlay (When preview limit reached) */}
                {showPaywall ? (
                    <div className="z-20 my-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                            <MaterialIcon name="lock" className="text-[32px]" />
                        </div>

                        <h3 className="mb-2 text-[20px] font-bold text-slate-900 dark:text-white">{UI_TEXT.EBOOK_READER.PAYWALL.TITLE}</h3>

                        <p className="mb-2 text-[14px] text-slate-600 dark:text-slate-300">
                            {UI_TEXT.EBOOK_READER.PAYWALL.SUBTITLE.replace("{current}", String(maxAllowed)).replace("{allowed}", String(maxAllowed))}
                        </p>

                        <p className="mb-6 text-[13px] text-slate-500 dark:text-slate-400">
                            {ebookInfo.accessReason === "PREVIEW_GUEST"
                                ? UI_TEXT.EBOOK_READER.PAYWALL.REASON_LOGIN
                                : UI_TEXT.EBOOK_READER.PAYWALL.REASON_TIER.replace("{tier}", ebookInfo.minMembershipTierName || "VIP")}
                        </p>

                        <div className="flex w-full flex-col gap-2.5">
                            {ebookInfo.accessReason === "PREVIEW_GUEST" ? (
                                <Link
                                    href={`/dang-nhap?callbackUrl=/sach/${bookId}/doc`}
                                    className="hover:bg-primary-600 active:scale-98 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-[14px] font-semibold text-white shadow-sm transition dark:bg-primary-500"
                                >
                                    <MaterialIcon name="login" className="text-[18px]" />
                                    {UI_TEXT.EBOOK_READER.PAYWALL.LOGIN_BTN}
                                </Link>
                            ) : (
                                <Link
                                    href="/profile"
                                    className="hover:bg-primary-600 active:scale-98 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-[14px] font-semibold text-white shadow-sm transition dark:bg-primary-500"
                                >
                                    <MaterialIcon name="stars" className="text-[18px]" />
                                    {UI_TEXT.EBOOK_READER.PAYWALL.UPGRADE_TIER_BTN}
                                </Link>
                            )}

                            <Link
                                href={`/sach/${bookId}/muon`}
                                className="active:scale-98 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                <MaterialIcon name="book" className="text-[18px]" />
                                {UI_TEXT.EBOOK_READER.PAYWALL.BORROW_PHYSICAL_BTN}
                            </Link>

                            <button
                                onClick={() => {
                                    setShowPaywall(false);
                                    setCurrentPage(maxAllowed);
                                }}
                                className="mt-1 text-[13px] text-slate-500 hover:underline dark:text-slate-400"
                            >
                                {UI_TEXT.EBOOK_READER.NAVIGATION.PREV_PAGE} ({maxAllowed})
                            </button>
                        </div>
                    </div>
                ) : (
                    /* PDF Canvas Render */
                    <div className="relative inline-block transition-transform duration-200">
                        <canvas ref={canvasRef} className={getThemeCanvasClass()} />
                    </div>
                )}
            </main>

            {/* Bottom Floating Navigation on Mobile */}
            <div className="sticky bottom-3 mx-auto mb-2 flex items-center gap-4 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 md:hidden">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1 && !showPaywall}
                    className="p-1 text-slate-700 disabled:opacity-30 dark:text-slate-200"
                >
                    <MaterialIcon name="arrow_back_ios" className="text-[18px]" />
                </button>
                <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200">
                    {currentPage} / {totalBookPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= maxAllowed && !ebookInfo.previewOnly}
                    className="p-1 text-slate-700 disabled:opacity-30 dark:text-slate-200"
                >
                    <MaterialIcon name="arrow_forward_ios" className="text-[18px]" />
                </button>
            </div>
        </div>
    );
}
