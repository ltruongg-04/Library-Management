"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UI_TEXT } from "@/constants/ui-text";
import { AdminBanner, getPublicBanners } from "@/services/adminBanner";

export default function BannerSlider() {
    const [banners, setBanners] = useState<AdminBanner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await getPublicBanners();
                if (res.success && res.data && res.data.length > 0) {
                    setBanners(res.data);
                }
            } catch {
                // Silently fallback if banners fail or none exists
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Auto rotate every 6 seconds
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [banners.length]);

    if (isLoading || banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    return (
        <section className="mx-auto my-8 max-w-[1440px] px-4 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface shadow-md dark:border-slate-800 dark:bg-slate-900">
                {/* Banner Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-surface-variant dark:bg-slate-800 sm:h-80 md:h-96">
                    <Image
                        src={currentBanner.imageUrl}
                        alt={currentBanner.title || "Banner"}
                        fill
                        className="object-cover transition-all duration-700"
                        priority
                        unoptimized
                    />
                    {/* Gradient Overlay for Readable Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Banner Info */}
                    <div className="absolute bottom-6 left-6 right-6 text-white md:bottom-10 md:left-10 md:max-w-2xl">
                        <span className="mb-2 inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                            {UI_TEXT.HOME.BANNER.SECTION_TITLE}
                        </span>
                        <h2 className="line-clamp-2 text-2xl font-bold md:text-3xl lg:text-4xl">{currentBanner.title}</h2>
                        {currentBanner.description && <p className="mt-2 line-clamp-2 text-sm text-white/80 md:text-base">{currentBanner.description}</p>}
                        {currentBanner.linkUrl && (
                            <Link
                                href={currentBanner.linkUrl}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-white/90"
                            >
                                {UI_TEXT.HOME.BANNER.READ_MORE}
                            </Link>
                        )}
                    </div>

                    {/* Controls */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                aria-label={UI_TEXT.HOME.BANNER.PREV_BTN}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition-all hover:bg-black/70"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                aria-label={UI_TEXT.HOME.BANNER.NEXT_BTN}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition-all hover:bg-black/70"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-4 right-6 flex gap-1.5 md:bottom-8 md:right-10">
                                {banners.map((b, idx) => (
                                    <button
                                        key={b.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        aria-label={`Slide ${idx + 1}`}
                                        className={`h-2 rounded-full transition-all ${
                                            idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
