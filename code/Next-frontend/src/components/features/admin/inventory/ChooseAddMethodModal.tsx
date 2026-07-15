"use client";
import { useState } from "react";
import axios from "axios";
import { FileEdit, Loader2, Search, X } from "lucide-react";
import { ADMIN } from "@/constants/ui-text/admin";
import { InitialBookData } from "./AddBookModal";

interface ChooseAddMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectManual: () => void;
    onSelectAutofill: (data: InitialBookData) => void;
}

export default function ChooseAddMethodModal({ isOpen, onClose, onSelectManual, onSelectAutofill }: ChooseAddMethodModalProps) {
    const [isbn, setIsbn] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const textUI = ADMIN.MODAL.CHOOSE_ADD_METHOD;

    const cleanDescription = (desc?: string) => {
        if (!desc) return "";
        let cleaned = desc;

        // 1. Cắt bỏ mọi thứ từ đường gạch ngang hoặc "See also:" (thường nằm ở cuối tóm tắt)
        const separatorIndex = cleaned.indexOf("----------");
        if (separatorIndex !== -1) cleaned = cleaned.substring(0, separatorIndex);

        const seeAlsoIndex = cleaned.toLowerCase().indexOf("see also:");
        if (seeAlsoIndex !== -1) cleaned = cleaned.substring(0, seeAlsoIndex);

        // 2. Cắt bỏ cụm trích dẫn nguồn ở cuối đoạn văn, ví dụ: ([source][1]) hoặc (Source: abc)
        const sourceIndex1 = cleaned.toLowerCase().lastIndexOf("([source");
        if (sourceIndex1 !== -1 && sourceIndex1 > cleaned.length - 100) {
            cleaned = cleaned.substring(0, sourceIndex1);
        }
        const sourceIndex2 = cleaned.toLowerCase().lastIndexOf("(source");
        if (sourceIndex2 !== -1 && sourceIndex2 > cleaned.length - 100) {
            cleaned = cleaned.substring(0, sourceIndex2);
        }

        // 3. Xóa các markdown link còn sót lại [Text](http...)
        cleaned = cleaned.replace(/\[([^\]]*)\]\([^\)]+\)/g, "");

        return cleaned.trim();
    };

    const parseDateToYMD = (dateStr?: string) => {
        if (!dateStr) return undefined;
        // Google Books: "YYYY" or "YYYY-MM"
        if (dateStr.match(/^\d{4}$/)) return `${dateStr}-01-01`;
        if (dateStr.match(/^\d{4}-\d{2}$/)) return `${dateStr}-01`;

        // OpenLibrary could be "August 12, 2008" or "2008"
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split("T")[0];
        }
        return undefined;
    };

    const CATEGORY_MAPPING = [
        {
            name: textUI.CATEGORIES.FICTION,
            keywords: [
                "fiction",
                "fantasy",
                "magic",
                "ghost",
                "monster",
                "novel",
                "literature",
                "story",
                "stories",
                "vampire",
                "sci-fi",
                "thriller",
                "mystery",
            ],
        },
        {
            name: textUI.CATEGORIES.SCIENCE,
            keywords: ["science", "computer", "programming", "mathematics", "physics", "technology", "engineering", "java", "python", "software", "data"],
        },
        { name: textUI.CATEGORIES.BUSINESS, keywords: ["business", "economics", "management", "finance", "marketing", "investing", "leadership", "money"] },
        { name: textUI.CATEGORIES.HISTORY, keywords: ["history", "biography", "war", "historical", "memoir", "politics"] },
        { name: textUI.CATEGORIES.PSYCHOLOGY, keywords: ["psychology", "self-help", "motivation", "health", "mind", "wellness", "philosophy"] },
        { name: textUI.CATEGORIES.CHILDREN, keywords: ["children", "juvenile", "kids", "picture books", "school"] },
        { name: textUI.CATEGORIES.ART, keywords: ["art", "architecture", "design", "music", "photography"] },
    ];

    const parseCategoriesAndTags = (rawCategories?: string[] | any[]) => {
        if (!rawCategories || !Array.isArray(rawCategories)) return { categories: [], tags: [] };

        const tags = new Map<string, string>();
        const parsedCategories = new Set<string>();

        const addUnique = (target: Map<string, string>, value: string) => {
            const normalized = value.trim().replace(/\s+/g, " ");
            if (!normalized) return;
            const key = normalized.toLowerCase();
            if (!target.has(key)) target.set(key, normalized);
        };

        rawCategories.forEach((cat) => {
            if (typeof cat !== "string") return;
            const parts = cat
                .split(/[\/,;]/)
                .map((part) => part.trim())
                .filter(Boolean);
            if (parts.length === 0) return;

            // 1. Lưu tất cả rác/từ khóa gốc vào Tags
            parts.forEach((part) => addUnique(tags, part));

            // 2. Map từ khóa thành Thể loại chuẩn
            const catLower = cat.toLowerCase();
            for (const mapItem of CATEGORY_MAPPING) {
                if (mapItem.keywords.some((kw) => catLower.includes(kw))) {
                    parsedCategories.add(mapItem.name);
                }
            }
        });

        // Lọc thẻ (Tags): Loại bỏ thẻ quá dài (>25 ký tự) hoặc nhiều hơn 3 từ
        let filteredTags = Array.from(tags.values()).filter((tag) => {
            const wordCount = tag.split(" ").length;
            return tag.length <= 25 && wordCount <= 3;
        });

        // Ưu tiên các thẻ ngắn gọn lên đầu
        filteredTags.sort((a, b) => a.length - b.length);

        // Nếu không map được thể loại nào, gán mặc định là "Khác"
        if (parsedCategories.size === 0) {
            parsedCategories.add(textUI.OTHER_CATEGORY);
        }

        return {
            categories: Array.from(parsedCategories).slice(0, 2), // Lấy tối đa 2 thể loại chuẩn
            tags: filteredTags.slice(0, 5), // Lấy tối đa 5 thẻ ngắn gọn nhất
        };
    };

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (!isbn.trim()) return;
        setLoading(true);
        setError(null);

        try {
            let bookData: InitialBookData | null = null;

            // 1. Try Google Books API
            try {
                const googleRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn.trim()}`);
                if (googleRes.data && googleRes.data.items && googleRes.data.items.length > 0) {
                    const info = googleRes.data.items[0].volumeInfo;
                    bookData = {
                        title: info.title,
                        authors: info.authors || [],
                        description: info.description,
                        publisher: info.publisher,
                        publicationDate: parseDateToYMD(info.publishedDate),
                        pages: info.pageCount,
                        ...parseCategoriesAndTags(info.categories),
                        isbn: isbn.trim(),
                        imageUrl: info.imageLinks?.thumbnail?.replace("http://", "https://") || undefined,
                    };
                }
            } catch (googleErr) {
                console.warn("Google Books API failed or rate limited:", googleErr);
            }

            // 2. Fallback to OpenLibrary API if not found or missing fields
            if (!bookData || !bookData.imageUrl || !bookData.description || !bookData.pages) {
                try {
                    const openLibraryRes = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn.trim()}&format=json&jscmd=data`);
                    const key = `ISBN:${isbn.trim()}`;
                    if (openLibraryRes.data && openLibraryRes.data[key]) {
                        const info = openLibraryRes.data[key];
                        const olData = {
                            title: info.title,
                            authors: info.authors ? info.authors.map((a: any) => a.name) : [],
                            description: info.subtitle || "",
                            publisher: info.publishers ? info.publishers.map((p: any) => p.name).join(", ") : undefined,
                            publicationDate: parseDateToYMD(info.publish_date),
                            pages: info.number_of_pages || parseInt(info.pagination) || undefined,
                            ...parseCategoriesAndTags(info.subjects ? info.subjects.map((s: any) => s.name) : []),
                            isbn: isbn.trim(),
                            imageUrl: info.cover?.large || info.cover?.medium || info.cover?.small || undefined,
                        };

                        if (!bookData) {
                            bookData = olData;
                        } else {
                            if (!bookData.description) bookData.description = olData.description;
                            if (!bookData.pages) bookData.pages = olData.pages;
                            if (!bookData.imageUrl) bookData.imageUrl = olData.imageUrl;
                            if (!bookData.categories || bookData.categories.length === 0) bookData.categories = olData.categories;
                            if (!bookData.tags || bookData.tags.length === 0) bookData.tags = olData.tags;
                            if (!bookData.publisher) bookData.publisher = olData.publisher;
                        }
                    }
                } catch (openLibErr) {
                    console.warn("OpenLibrary API failed:", openLibErr);
                }
            }

            // 3. Fallback for description from OpenLibrary Work if still missing
            if (bookData && !bookData.description) {
                try {
                    const detailsRes = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn.trim()}&format=json&jscmd=details`);
                    const key = `ISBN:${isbn.trim()}`;
                    if (
                        detailsRes.data &&
                        detailsRes.data[key] &&
                        detailsRes.data[key].details &&
                        detailsRes.data[key].details.works &&
                        detailsRes.data[key].details.works.length > 0
                    ) {
                        const workKey = detailsRes.data[key].details.works[0].key;
                        const workRes = await axios.get(`https://openlibrary.org${workKey}.json`);
                        if (workRes.data && workRes.data.description) {
                            if (typeof workRes.data.description === "string") {
                                bookData.description = cleanDescription(workRes.data.description);
                            } else if (workRes.data.description.value) {
                                bookData.description = cleanDescription(workRes.data.description.value);
                            }
                        }
                    }
                } catch (workErr) {
                    console.warn("Failed to fetch OpenLibrary Work description:", workErr);
                }
            }

            if (bookData) {
                onSelectAutofill(bookData);
            } else {
                setError(textUI.NOT_FOUND);
            }
        } catch (err) {
            console.error("Failed to fetch book from API", err);
            setError(textUI.ERROR);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
            <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex shrink-0 items-center justify-between border-b border-surface-container-high px-6 py-4">
                    <h2 className="text-[18px] font-semibold text-ink-950">{textUI.TITLE}</h2>
                    <button onClick={onClose} className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Autofill Section */}
                    <div className="border-primary-200 mb-6 rounded-xl border bg-primary-50 p-5">
                        <div className="mb-3 flex items-start gap-3">
                            <div className="text-primary-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
                                <Search size={20} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-ink-950">{textUI.AUTOFILL_TITLE}</h3>
                                <p className="mt-1 text-[13px] text-on-surface-variant">{textUI.AUTOFILL_DESC}</p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder={textUI.ISBN_PLACEHOLDER}
                                value={isbn}
                                onChange={(e) => setIsbn(e.target.value)}
                                className="w-full rounded-lg border border-surface-container-high px-3 py-2.5 font-mono text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch();
                                }}
                            />
                            {error && <div className="text-[13px] text-error">{error}</div>}
                            <button
                                type="button"
                                disabled={!isbn.trim() || loading}
                                onClick={handleSearch}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-900 disabled:opacity-50"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                {loading ? textUI.SEARCHING : textUI.SEARCH_BTN}
                            </button>
                        </div>
                    </div>

                    <div className="relative mb-6 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-surface-container-high"></div>
                        </div>
                        <div className="relative bg-white px-4 text-[13px] text-on-surface-variant">{textUI.OR_TEXT}</div>
                    </div>

                    {/* Manual Section */}
                    <div className="rounded-xl border border-surface-container-high bg-surface p-5 text-center">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-600 shadow-sm">
                            <FileEdit size={20} />
                        </div>
                        <h3 className="text-[15px] font-semibold text-ink-950">{textUI.MANUAL_TITLE}</h3>
                        <p className="mt-1 text-[13px] text-on-surface-variant">{textUI.MANUAL_DESC}</p>
                        <button
                            type="button"
                            onClick={onSelectManual}
                            className="mt-4 flex w-full justify-center rounded-lg border border-surface-container-high bg-white px-4 py-2.5 text-[14px] font-semibold text-ink-950 transition-colors hover:bg-surface-container-lowest"
                        >
                            {textUI.MANUAL_BTN}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
