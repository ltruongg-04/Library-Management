"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/base/material-icon";
import Breadcrumb from "@/components/features/book-detail/Breadcrumb";
import { UI_TEXT } from "@/constants/ui-text";

// Mock Data
const CATEGORIES = [
    { id: "all", name: UI_TEXT.BOOK_LIST.CATEGORIES.ALL },
    { id: "science", name: UI_TEXT.BOOK_LIST.CATEGORIES.SCIENCE },
    { id: "fiction", name: UI_TEXT.BOOK_LIST.CATEGORIES.FICTION },
    { id: "history", name: UI_TEXT.BOOK_LIST.CATEGORIES.HISTORY },
    { id: "design", name: UI_TEXT.BOOK_LIST.CATEGORIES.DESIGN },
    { id: "business", name: UI_TEXT.BOOK_LIST.CATEGORIES.BUSINESS },
];

const MOCK_BOOKS = [
    {
        id: 1,
        title: "The Algorithmic Mind",
        author: "Dr. Elena Rostova",
        category: UI_TEXT.BOOK_LIST.CATEGORIES.SCIENCE,
        categoryColor: "science",
        rating: 4.9,
        imageSrc:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCMQZBwRZKLiwS6s_Ghy2_0232U4u8yrVt0UoLSfqDN1CsrwPHmS4Kd3UrRaqEu5cFueLAfwFeL3RtxDYO7mBdlOrBmIzg1LAifXS5Ke852HdIZXRvjSe4ILboN6D9bnTPk2oVp8CcdJHT_g9gFy4fKK7fq14vo4smnYqVAjuCZEztGQohjl9HlXhovVOfuT65lwKU7ToahWuCAmutimIZCyfsJRzk_ai_vPVd5iaGoXpNl0KfkXbDYOMAEMBlDryuGgvAuZWKCZdpM",
    },
    {
        id: 2,
        title: "Echoes of Silence",
        author: "Marcus Thorne",
        category: UI_TEXT.BOOK_LIST.CATEGORIES.FICTION,
        categoryColor: "fiction",
        rating: 4.8,
        imageSrc:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCA0ugb2mtgwGdYen2kuKtDcr1SgH90WiQ4t-vHPzsDIm0zDpqfLep6XfQ9Av8c80v2tgU3rhAirV116cp4WU6vxAaqbvxP-LsurS-EuqR5nwMDP0bi-oalR1xxqoIp915o3WniSMrmFkdIpZviFowlkY21DMtY0dWHCZoMw8-Iwu0CwAaEL7Dy47Wx-SwJalcesh2S3c5KnGe6KXqBDuo31QzsGJyd6YIyNeROWuCYvY5TvzGIBKEjA4lTGx4c13ZZ_i20rbfPxd7m",
    },
    {
        id: 3,
        title: "A Brief History of Tomorrow",
        author: "Sarah Jenkins",
        category: UI_TEXT.BOOK_LIST.CATEGORIES.HISTORY,
        categoryColor: "history",
        rating: 4.5,
        placeholderIcon: "history_edu",
        placeholderBg: "bg-primary-container",
        placeholderIconColor: "text-on-primary-container",
    },
    {
        id: 4,
        title: "Design Systems",
        author: "Alex Rivera",
        category: UI_TEXT.BOOK_LIST.CATEGORIES.DESIGN,
        categoryColor: "design",
        rating: 4.7,
        placeholderIcon: "palette",
        placeholderBg: "bg-tertiary-container",
        placeholderIconColor: "text-on-tertiary-container",
    },
    {
        id: 5,
        title: "Sentient Systems",
        author: "Marcus Vance",
        category: UI_TEXT.BOOK_LIST.CATEGORIES.SCIENCE,
        categoryColor: "science",
        rating: 4.6,
        imageSrc:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCMmCiisoJSpv4dvhtaCdcoE1uS_CBtUC8kwsFUNxhgnupzh2gwqkc6Y61JxPoMMe0t1hLC4S9Fc8AOG56NdzVsft_J2ipvPnX6C33CeHDKy52GPyZqEVLz6lu_dZsDLLY2itV8C5MLT15dj45eRZ0J81iwUfWxdKAeiCE-xUwDW8rGHqtvIb08Zg-4B-e_bPNOvXGM_HPoopmXuUMpyNxcCk6oPfjU30Z2uZXIL8IiztciFMYH8PPFcNUkuJG83f6ivzfK5E-N2qRn",
    },
    {
        id: 6,
        title: "Code & Cognition",
        author: "Dr. Sarah Jenkins",
        category: UI_TEXT.BOOK_LIST.CATEGORIES.SCIENCE,
        categoryColor: "science",
        rating: 4.9,
        imageSrc:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBehlRBluY2H86XNuf3iXURag8OtXWdzR6luPuT4-Rz95fi7OdFVShqx6GzXoQL_1TxeQ1eJgUhzMsiMr0qvszKS-w-TRgLwxnEx1m_QW7uo0-Tsc3nx4LKefihl3fK67GYd90rW2TPNHUbOQ76xNdBMxgtPYfYkH37Kh32ujcSJHGthQAh_Yg4MmvfBOaxWRWETJHWKRqOT1CZ8ngmnJSn3tkL5ctkWxrvLIjrphtCon2lbuI_CZrArUWwhI64ltwT-_Z5rq-J0R2x",
    },
    {
        id: 7,
        title: "The Silicon Soul",
        author: "A.J. Thorne",
        category: UI_TEXT.BOOK_LIST.CATEGORIES.SCIENCE,
        categoryColor: "science",
        rating: 4.8,
        imageSrc:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCV7DbciVnkrS3xPbNq6UHVgda6vZZl5njAKfTRjjTA4_tVAYoxD5hVSN6qghwyj6UDqfkCAbldQhcpQQUfTvt0Kj-yXaFnuzdsuRDAymk9draKu64TLo4MUOQDKNr6WAm7dT-cfnzXfsjcHbVLssYz2g8EDY-3rqN3O3vkf8zzSSvcBir9sb4oWihUCvGb8JHIdDJQoBdNN-RVoGOxkeI6_JmWdPugeZD2ahUxc54v9h9weUoW31mHaqCB2O6Vs6OB7PDckAR1aL23",
    },
    {
        id: 8,
        title: "Conversational AI",
        author: "L. Chen",
        category: UI_TEXT.BOOK_LIST.CATEGORIES.SCIENCE,
        categoryColor: "science",
        rating: 4.5,
        imageSrc:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCw80Sw2BU5XvcHA7V09zy6UirEiamVjKAyEZ8laM82itQA-nmvRR5bVmwqL_RncEl3k9MnuPi8hQM1nhdxPaSe8HcpVT50_mAlPN5VIA6iuBd1Fd_wd8pZgE_jTxDq7QZzb4wp-wMQ-swOURcipKmxWZ5CS4ZrMpl2NSgVaxEjJOLq0omNKzLmHZbjjRFGDdZkRe9bZrqfLpnK1Ff3pT2yidmLlg8iK8x4FfTaUtz6x1PQ47VnvDky9wFccasiJAm8rPWq8b_s8Oth",
    },
];

const CATEGORY_STYLES: Record<string, string> = {
    science: "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    fiction: "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
    history: "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
    design: "text-tertiary-500 bg-tertiary-500/10 dark:text-white dark:bg-tertiary-500/40",
};

export default function BookListPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBooks = MOCK_BOOKS.filter((book) => {
        const matchesCategory = selectedCategory === "all" || CATEGORIES.find((c) => c.id === selectedCategory)?.name === book.category;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const breadcrumbItems = [{ label: UI_TEXT.BOOK_LIST.BREADCRUMB_HOME, href: "/" }, { label: UI_TEXT.BOOK_LIST.BREADCRUMB_LIST }];

    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 md:px-6">
            {/* Breadcrumb */}
            <div className="py-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Hero Section */}
            <div className="level-2-shadow relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 to-secondary-500 p-8 text-white dark:from-slate-800 dark:to-slate-900 md:p-12">
                <div className="relative z-10">
                    <h1 className="mb-4 font-sans text-[36px] font-bold leading-tight md:text-[48px]">{UI_TEXT.BOOK_LIST.HERO_HEADING}</h1>
                    <p className="mb-8 max-w-2xl font-sans text-[16px] opacity-90 md:text-[20px]">{UI_TEXT.BOOK_LIST.HERO_SUBHEADING}</p>
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder={UI_TEXT.BOOK_LIST.SEARCH_PLACEHOLDER}
                            className="w-full rounded-full border border-white/20 bg-white/10 py-3 pl-12 pr-4 text-white placeholder-white/60 backdrop-blur-sm transition-colors focus:bg-white/20 focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute bottom-0 right-32 h-48 w-48 translate-y-1/2 rounded-full bg-secondary-300/20 blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Sidebar Filters */}
                <div className="space-y-8 lg:col-span-1">
                    <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-6 dark:bg-slate-900">
                        <h3 className="mb-4 flex items-center font-sans text-[20px] font-semibold text-on-surface dark:text-white">
                            <MaterialIcon name="category" className="mr-2 text-primary-700 dark:text-primary-300" />
                            {UI_TEXT.BOOK_LIST.SIDEBAR_CATEGORY}
                        </h3>
                        <ul className="space-y-2">
                            {CATEGORIES.map((category) => (
                                <li key={category.id}>
                                    <button
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-left font-sans text-[16px] transition-colors duration-200 ${
                                            selectedCategory === category.id
                                                ? "bg-primary-700/10 font-medium text-primary-700 dark:bg-primary-700/30 dark:text-primary-300"
                                                : "text-on-surface-variant hover:bg-surface-container-low dark:text-white/80 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        {category.name}
                                        {selectedCategory === category.id && <MaterialIcon name="check" className="text-sm" />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-6 dark:bg-slate-900">
                        <h3 className="mb-4 flex items-center font-sans text-[20px] font-semibold text-on-surface dark:text-white">
                            <MaterialIcon name="tune" className="mr-2 text-primary-700 dark:text-primary-300" />
                            {UI_TEXT.BOOK_LIST.SIDEBAR_FILTER}
                        </h3>
                        {/* Additional filters can go here */}
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-[14px] text-on-surface-variant dark:text-white/70">{UI_TEXT.BOOK_LIST.SORT_LABEL}</label>
                                <select className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-on-surface focus:border-primary-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                    <option>{UI_TEXT.BOOK_LIST.SORT_OPTIONS.NEWEST}</option>
                                    <option>{UI_TEXT.BOOK_LIST.SORT_OPTIONS.TOP_RATED}</option>
                                    <option>{UI_TEXT.BOOK_LIST.SORT_OPTIONS.POPULAR}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Book Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="font-sans text-on-surface-variant dark:text-white/80">
                            {UI_TEXT.BOOK_LIST.RESULTS_COUNT_PRE} <strong>{filteredBooks.length}</strong> {UI_TEXT.BOOK_LIST.RESULTS_COUNT_POST}{" "}
                            {searchQuery && (
                                <span>
                                    {UI_TEXT.BOOK_LIST.RESULTS_FOR} &quot;{searchQuery}&quot;
                                </span>
                            )}
                        </p>
                    </div>

                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {filteredBooks.map((book) => (
                                <Link
                                    key={book.id}
                                    href={`/sach/${book.id}`}
                                    className="level-1-shadow level-2-shadow-hover group flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest transition-all duration-300 dark:bg-slate-900"
                                >
                                    {/* Cover Image */}
                                    <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-surface-container-low p-4 transition-colors duration-200 dark:bg-slate-800">
                                        {book.imageSrc ? (
                                            <Image
                                                src={book.imageSrc}
                                                alt={`${UI_TEXT.BOOK_LIST.IMAGE_ALT} ${book.title}`}
                                                width={128}
                                                height={192}
                                                className="h-full w-auto rounded object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <div
                                                className={`h-40 w-28 ${book.placeholderBg} flex items-center justify-center rounded shadow-md ${book.placeholderIconColor} transition-transform duration-500 group-hover:scale-105`}
                                            >
                                                <MaterialIcon name={book.placeholderIcon!} className="text-[56px]" />
                                            </div>
                                        )}

                                        {/* Rating Badge */}
                                        <div className="absolute right-3 top-3 flex items-center rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-slate-900/90">
                                            <MaterialIcon name="star" className="mr-1 text-sm text-yellow-500" />
                                            <span className="font-mono text-[12px] font-bold text-on-surface dark:text-white">{book.rating}</span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-grow flex-col p-5">
                                        <h3 className="mb-2 line-clamp-2 font-sans text-[18px] font-semibold leading-tight text-on-surface transition-colors duration-200 group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">
                                            {book.title}
                                        </h3>
                                        <p className="mb-4 line-clamp-1 font-sans text-[14px] text-on-surface-variant transition-colors duration-200 dark:text-white/70">
                                            {book.author}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span
                                                className={`font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] ${CATEGORY_STYLES[book.categoryColor] || CATEGORY_STYLES.science} max-w-[120px] truncate rounded px-2 py-1`}
                                                title={book.category}
                                            >
                                                {book.category}
                                            </span>
                                            <button
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-700/5 text-primary-700 transition-colors hover:bg-primary-700 hover:text-white dark:bg-primary-700/20 dark:text-primary-300 dark:hover:bg-primary-700 dark:hover:text-white"
                                                aria-label={`${UI_TEXT.BOOK_LIST.IMAGE_ALT} ${book.title}`}
                                            >
                                                <MaterialIcon name="arrow_forward" className="text-[18px]" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="level-1-shadow rounded-2xl bg-surface-container-lowest p-12 text-center dark:bg-slate-900">
                            <MaterialIcon name="search_off" className="mb-4 text-[64px] text-on-surface-variant/50 dark:text-white/30" />
                            <h3 className="mb-2 text-[20px] font-semibold text-on-surface dark:text-white">{UI_TEXT.BOOK_LIST.NO_RESULTS_HEADING}</h3>
                            <p className="text-on-surface-variant dark:text-white/70">{UI_TEXT.BOOK_LIST.NO_RESULTS_DESC}</p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                }}
                                className="hover:bg-primary-800 mt-6 rounded-lg bg-primary-700 px-6 py-2 text-white transition-colors"
                            >
                                {UI_TEXT.BOOK_LIST.CLEAR_FILTER_BTN}
                            </button>
                        </div>
                    )}

                    {/* Pagination (Mock) */}
                    {filteredBooks.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center space-x-2">
                                <button
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                                    disabled
                                >
                                    <MaterialIcon name="chevron_left" />
                                </button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700 font-medium text-white shadow-md">
                                    1
                                </button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-surface-container-low dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">
                                    2
                                </button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-surface-container-low dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">
                                    3
                                </button>
                                <span className="px-2 text-on-surface-variant dark:text-white/70">...</span>
                                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-surface-container-low dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">
                                    <MaterialIcon name="chevron_right" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
