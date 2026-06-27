import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

function MatchPill({ percentage, className = "" }: { percentage: number; className?: string }) {
    return (
        <div
            className={`z-10 flex items-center rounded-full border border-secondary-300/50 bg-surface-container-lowest px-2 py-1 shadow-sm transition-colors duration-200 dark:bg-slate-800 ${className}`}
        >
            <div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-secondary-300 dark:bg-white" />
            <span className="font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] text-primary-700 dark:text-white">
                {percentage}
                {UI_TEXT.HOME.MATCH_SUFFIX}
            </span>
        </div>
    );
}

export default function CuratedSection() {
    return (
        <section className="mx-auto my-12 max-w-[1440px] rounded-xl bg-surface-container-low px-4 py-12 transition-colors duration-200 dark:bg-slate-900/50 lg:px-6">
            {/* Section Header */}
            <div className="mx-auto mb-6 max-w-2xl text-center">
                <span className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary-300/20 text-secondary-300 dark:bg-white/20 dark:text-white">
                    <MaterialIcon name="psychology" />
                </span>
                <h2 className="mb-1 font-sans text-[32px] font-semibold leading-[40px] tracking-[-0.01em] text-primary-700 transition-colors duration-200 dark:text-white">
                    {UI_TEXT.HOME.CURATED_HEADING}
                </h2>
                <p className="font-sans text-[16px] leading-[24px] text-on-surface-variant transition-colors duration-200 dark:text-white">
                    {UI_TEXT.HOME.CURATED_SUBHEADING}
                </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Large Feature Cell — Philosophy of AI */}
                <div className="level-1-shadow group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-lg border border-transparent bg-surface-container-lowest p-6 transition-colors duration-200 hover:border-secondary-300/30 dark:bg-slate-900 md:col-span-2">
                    {/* Background image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7gTlF9fqWIvWjr9aj8LpUlcjd1ZAFrrwaxYC9ieAqCoAZ5Ik3q82TeqvrlZxHqbvRq_lDJfEapookHAbLE1Vub0NVRCMMyWySPdoOO64EsxX-vuKNuO4UjYdLazwXRCNw6RM3l13Rtw9_5YmOxVZUS_vTp4ta8XbCWxTBUOq2HtMAaX2s2RS0iaNa0Viy2hqO0z-tPjIrfRZVXhcqWV4JUJ3C2cxenRymdfwGmg6Rvvg_1g00ch1Tz4ZBx3RIS3usmXgCtDYlqrtN"
                            alt="Curated book collection"
                            fill
                            className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent transition-colors duration-200 dark:from-slate-900 dark:via-slate-900/80" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full md:w-2/3">
                        <div className="mb-2 inline-block rounded bg-primary-700 px-2 py-1 font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] text-on-primary dark:bg-white/20 dark:text-white">
                            {UI_TEXT.HOME.CURATED_SECTION.DEEP_DIVE}
                        </div>
                        <h3 className="mb-2 font-sans text-[32px] font-semibold leading-[40px] tracking-[-0.01em] text-primary-700 transition-colors duration-200 dark:text-white">
                            {UI_TEXT.HOME.CURATED_SECTION.PHILOSOPHY_AI}
                        </h3>
                        <p className="mb-4 font-sans text-[16px] leading-[24px] text-on-surface-variant transition-colors duration-200 dark:text-white">
                            {UI_TEXT.HOME.CURATED_SECTION.PHILOSOPHY_AI_DESC}
                        </p>
                        <Link
                            href="/sach/1"
                            className="w-fit rounded-lg border border-secondary-500 bg-transparent px-4 py-2 text-[14px] font-semibold text-secondary-500 transition-colors hover:bg-secondary-500/5 dark:border-white dark:text-white dark:hover:bg-white/10"
                        >
                            {UI_TEXT.HOME.EXPLORE_COLLECTION}
                        </Link>
                    </div>

                    {/* Match Pill */}
                    <MatchPill percentage={98} className="absolute right-6 top-6" />
                </div>

                {/* Right Column — Stacked */}
                <div className="flex flex-col gap-4">
                    {/* Hard Sci-Fi Essentials */}
                    <div className="level-1-shadow relative flex flex-1 flex-col rounded-lg border border-transparent bg-surface-container-lowest p-6 transition-colors duration-200 hover:border-secondary-300/30 dark:bg-slate-900">
                        <div className="flex-grow">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-primary-container/20 text-primary-700 dark:bg-white/10 dark:text-white">
                                <MaterialIcon name="science" />
                            </div>
                            <h3 className="mb-1 font-sans text-[20px] font-semibold leading-[28px] text-primary-700 transition-colors duration-200 dark:text-white">
                                {UI_TEXT.HOME.CURATED_SECTION.HARD_SCIFI}
                            </h3>
                            <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant transition-colors duration-200 dark:text-white">
                                {UI_TEXT.HOME.CURATED_SECTION.HARD_SCIFI_DESC}
                            </p>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-sm text-on-surface-variant transition-colors duration-200 dark:text-white">
                                {UI_TEXT.HOME.CURATED_SECTION.BOOKS_12}
                            </span>
                            <button
                                className="text-secondary-500 transition-colors hover:text-primary-700 dark:text-white dark:hover:text-primary-300"
                                aria-label="View Hard Sci-Fi Essentials"
                            >
                                <MaterialIcon name="arrow_forward" />
                            </button>
                        </div>
                        <MatchPill percentage={92} className="absolute right-4 top-4" />
                    </div>

                    {/* World Building Masterclass */}
                    <div className="level-1-shadow relative flex flex-1 flex-col rounded-lg border border-transparent bg-surface-container-lowest p-6 transition-colors duration-200 hover:border-secondary-300/30 dark:bg-slate-900">
                        <div className="flex-grow">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-tertiary-container/20 text-tertiary-500 dark:bg-white/10 dark:text-white">
                                <MaterialIcon name="landscape" />
                            </div>
                            <h3 className="mb-1 font-sans text-[20px] font-semibold leading-[28px] text-primary-700 transition-colors duration-200 dark:text-white">
                                {UI_TEXT.HOME.CURATED_SECTION.WORLD_BUILDING}
                            </h3>
                            <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant transition-colors duration-200 dark:text-white">
                                {UI_TEXT.HOME.CURATED_SECTION.WORLD_BUILDING_DESC}
                            </p>
                        </div>
                        <div className="mt-6 flex -space-x-2">
                            <div className="z-30 h-8 w-8 rounded-full border-2 border-surface-container-lowest bg-surface-variant transition-colors duration-200 dark:border-slate-900 dark:bg-slate-700" />
                            <div className="z-20 h-8 w-8 rounded-full border-2 border-surface-container-lowest bg-surface-dim transition-colors duration-200 dark:border-slate-900 dark:bg-slate-600" />
                            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-outline-variant font-mono text-xs text-on-surface transition-colors duration-200 dark:border-slate-900 dark:bg-slate-800 dark:text-white">
                                +4
                            </div>
                        </div>
                        <MatchPill percentage={85} className="absolute right-4 top-4" />
                    </div>
                </div>
            </div>
        </section>
    );
}
