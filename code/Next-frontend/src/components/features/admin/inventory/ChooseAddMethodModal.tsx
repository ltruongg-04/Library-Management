"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FileEdit, Loader2, QrCode, Search, X } from "lucide-react";
import { ADMIN } from "@/constants/ui-text/admin";
import { bookService } from "@/services/book";
import { InitialBookData } from "./AddBookModal";
import BookScannerModal from "./BookScannerModal";

interface ChooseAddMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectManual: () => void;
    onSelectAutofill: (data: InitialBookData) => void;
    onManageCopies: (id: number, title: string) => void;
    initialIsbn?: string;
    autoSearch?: boolean;
    onSuccess?: (createdBook?: any) => void;
}

export default function ChooseAddMethodModal({
    isOpen,
    onClose,
    onSelectManual,
    onSelectAutofill,
    onManageCopies,
    initialIsbn,
    autoSearch,
}: ChooseAddMethodModalProps) {
    const [isbn, setIsbn] = useState(initialIsbn || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingBook, setExistingBook] = useState<{ bookId: number; title: string; duplicateBy?: "isbn" | "title" } | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const handleSearchRef = useRef<((targetIsbn?: string) => Promise<void>) | null>(null);

    useEffect(() => {
        if (initialIsbn) {
            setIsbn(initialIsbn);
            if (autoSearch) {
                handleSearchRef.current?.(initialIsbn);
            }
        }
    }, [initialIsbn, autoSearch]);

    const textUI = ADMIN.MODAL.CHOOSE_ADD_METHOD;

    const cleanDescription = (desc?: string) => {
        if (!desc) return "";
        let cleaned = desc;

        // 1. Giải mã các thực thể HTML phổ biến (&quot;, &amp;, &lt;, &gt;, &nbsp;, &#39;, v.v.)
        cleaned = cleaned
            .replace(/&nbsp;/gi, " ")
            .replace(/&quot;/gi, '"')
            .replace(/&apos;|&#39;/gi, "'")
            .replace(/&amp;/gi, "&")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")
            .replace(/&hellip;/gi, "...")
            .replace(/&ndash;|&mdash;/gi, "-");

        // 2. Chuyển đổi các thẻ ngắt dòng HTML <br>, </p>, </div> thành xuống dòng
        cleaned = cleaned
            .replace(/<br\s*[\/]?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<\/div>/gi, "\n");

        // 3. Loại bỏ toàn bộ các thẻ HTML còn lại (<b>, <i>, <span>, <div>, <p>...)
        cleaned = cleaned.replace(/<[^>]+>/g, "");

        // 4. Loại bỏ các đoạn boilerplate thương mại điện tử (Tiki, Fahasa)
        cleaned = cleaned.replace(/Giá sản phẩm trên Tiki[\s\S]*/i, "");
        cleaned = cleaned.replace(/\bThông tin chung:[\s\S]*/i, "");

        // 5. Cắt bỏ mọi thứ từ đường gạch ngang hoặc "See also:" (thường nằm ở cuối tóm tắt OpenLibrary)
        const separatorIndex = cleaned.indexOf("----------");
        if (separatorIndex !== -1) cleaned = cleaned.substring(0, separatorIndex);

        const seeAlsoIndex = cleaned.toLowerCase().indexOf("see also:");
        if (seeAlsoIndex !== -1) cleaned = cleaned.substring(0, seeAlsoIndex);

        // 6. Cắt bỏ cụm trích dẫn nguồn ở cuối đoạn văn, ví dụ: ([source][1]) hoặc (Source: abc)
        const sourceIndex1 = cleaned.toLowerCase().lastIndexOf("([source");
        if (sourceIndex1 !== -1 && sourceIndex1 > cleaned.length - 100) {
            cleaned = cleaned.substring(0, sourceIndex1);
        }
        const sourceIndex2 = cleaned.toLowerCase().lastIndexOf("(source");
        if (sourceIndex2 !== -1 && sourceIndex2 > cleaned.length - 100) {
            cleaned = cleaned.substring(0, sourceIndex2);
        }

        // 7. Xóa các markdown link còn sót lại [Text](http...)
        cleaned = cleaned.replace(/\[([^\]]*)\]\([^\)]+\)/g, "$1");

        // 8. Chuẩn hóa khoảng trắng và dòng trống
        cleaned = cleaned.replace(/[ \t]+/g, " ");
        cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, "\n\n");

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

    const handleSearch = async (targetIsbn?: string) => {
        const queryIsbn = (targetIsbn !== undefined ? targetIsbn : isbn).trim();
        if (!queryIsbn) return;
        setLoading(true);
        setError(null);
        setExistingBook(null);

        try {
            // 0. Kiểm tra xem sách đã tồn tại trong DB chưa
            const checkResult = await bookService.checkDuplicate(queryIsbn);
            if (checkResult.exists && checkResult.bookId && checkResult.title) {
                setExistingBook({ bookId: checkResult.bookId, title: checkResult.title, duplicateBy: checkResult.duplicateBy });
                setLoading(false);
                return;
            }

            let bookData: InitialBookData | null = null;

            // 1. Try Google Books API
            try {
                const googleRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${queryIsbn}`);
                if (googleRes.data && googleRes.data.items && googleRes.data.items.length > 0) {
                    const info = googleRes.data.items[0].volumeInfo;
                    bookData = {
                        title: info.title,
                        authors: info.authors || [],
                        description: cleanDescription(info.description),
                        publisher: info.publisher,
                        publicationDate: parseDateToYMD(info.publishedDate),
                        pages: info.pageCount,
                        ...parseCategoriesAndTags(info.categories),
                        isbn: queryIsbn,
                        imageUrl: info.imageLinks?.thumbnail?.replace("http://", "https://") || undefined,
                    };
                }
            } catch (googleErr) {
                console.warn("Google Books API failed or rate limited:", googleErr);
            }

            // 2. Fallback to OpenLibrary API if not found or missing fields
            if (!bookData || !bookData.imageUrl || !bookData.description || !bookData.pages) {
                try {
                    const openLibraryRes = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${queryIsbn}&format=json&jscmd=data`);
                    const key = `ISBN:${queryIsbn}`;
                    if (openLibraryRes.data && openLibraryRes.data[key]) {
                        const info = openLibraryRes.data[key];
                        const olData = {
                            title: info.title,
                            authors: info.authors ? info.authors.map((a: any) => a.name) : [],
                            description: "",
                            publisher: info.publishers ? info.publishers.map((p: any) => p.name).join(", ") : undefined,
                            publicationDate: parseDateToYMD(info.publish_date),
                            pages: info.number_of_pages || parseInt(info.pagination) || undefined,
                            ...parseCategoriesAndTags(info.subjects ? info.subjects.map((s: any) => s.name) : []),
                            isbn: queryIsbn,
                            imageUrl: info.cover?.large || info.cover?.medium || info.cover?.small || undefined,
                        };

                        if (!bookData) {
                            bookData = olData;
                        } else {
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
                    const detailsRes = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${queryIsbn}&format=json&jscmd=details`);
                    const key = `ISBN:${queryIsbn}`;
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

            // 4. Fallback tra cứu sách tiếng Việt (Tiki trước -> Fahasa sau)
            // Nếu chưa có sách hoặc mô tả bị thiếu / quá ngắn (< 40 ký tự) hoặc thiếu ảnh
            if (!bookData || !bookData.title || !bookData.description || bookData.description.trim().length < 40 || !bookData.imageUrl) {
                try {
                    const vnRes = await axios.get(`/api/admin/books/vn-lookup?query=${encodeURIComponent(queryIsbn)}`);
                    if (vnRes.data && vnRes.data.success && vnRes.data.data) {
                        const vnBook = vnRes.data.data;
                        const cleanedVnDesc = cleanDescription(vnBook.description || "");

                        if (!bookData) {
                            bookData = {
                                title: vnBook.title,
                                authors: vnBook.authors || [],
                                description: cleanedVnDesc,
                                publisher: vnBook.publisher,
                                publicationDate: parseDateToYMD(vnBook.publicationDate),
                                pages: vnBook.pages,
                                ...parseCategoriesAndTags(vnBook.categories),
                                isbn: queryIsbn,
                                imageUrl: vnBook.imageUrl || undefined,
                            };
                        } else {
                            if (!bookData.description || bookData.description.trim().length < 40) {
                                bookData.description = cleanedVnDesc;
                            }
                            if (!bookData.imageUrl && vnBook.imageUrl) {
                                bookData.imageUrl = vnBook.imageUrl;
                            }
                            if (!bookData.publisher && vnBook.publisher) {
                                bookData.publisher = vnBook.publisher;
                            }
                            if (!bookData.pages && vnBook.pages) {
                                bookData.pages = vnBook.pages;
                            }
                            if (!bookData.publicationDate && vnBook.publicationDate) {
                                bookData.publicationDate = parseDateToYMD(vnBook.publicationDate);
                            }
                            if (!bookData.categories || bookData.categories.length === 0) {
                                const parsed = parseCategoriesAndTags(vnBook.categories);
                                bookData.categories = parsed.categories;
                                if (!bookData.tags || bookData.tags.length === 0) bookData.tags = parsed.tags;
                            }
                        }
                    }
                } catch (vnErr) {
                    console.warn("VN Book Lookup (Tiki -> Fahasa) failed:", vnErr);
                }
            }

            if (bookData) {
                // Tự động tìm kiếm sách mềm trên Standard Ebooks dựa vào tên sách và tác giả
                try {
                    const searchRes = await axios.get("/api/admin/books/standard-ebooks/search", {
                        params: {
                            title: bookData.title,
                            author: bookData.authors?.[0] || "",
                        },
                        timeout: 12000,
                    });
                    if (searchRes.data?.found && searchRes.data?.data) {
                        bookData.matchedEbook = searchRes.data.data;
                    }
                } catch (searchEbookErr) {
                    console.warn("Background standard-ebooks search failed:", searchEbookErr);
                }

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
    handleSearchRef.current = handleSearch;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
            <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex shrink-0 items-center justify-between border-b border-surface-container-high px-5 py-3.5 dark:border-slate-800">
                    <h2 className="text-[17px] font-semibold text-ink-950 dark:text-white">{textUI.TITLE}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5">
                    {/* Autofill Section */}
                    <div className="border-primary-200 dark:bg-primary-950/20 mb-5 rounded-xl border bg-primary-50/60 p-4 dark:border-primary-900/50">
                        <div className="mb-2.5 flex items-start gap-3">
                            <div className="text-primary-600 dark:text-primary-400 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                                <Search size={16} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-ink-950 dark:text-white">{textUI.AUTOFILL_TITLE}</h3>
                                <p className="mt-1 text-[13px] text-on-surface-variant dark:text-slate-400">{textUI.AUTOFILL_DESC}</p>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-2.5">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder={textUI.ISBN_PLACEHOLDER}
                                    value={isbn}
                                    onChange={(e) => setIsbn(e.target.value)}
                                    className="dark:focus:border-primary-400 w-full rounded-lg border border-surface-container-high bg-white py-2 pl-3 pr-10 font-mono text-[14px] text-ink-950 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSearch();
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsScannerOpen(true)}
                                    title={textUI.SCAN_BTN}
                                    className="dark:hover:text-primary-400 absolute right-2 rounded-md p-1.5 text-on-surface-variant transition-colors hover:bg-surface hover:text-primary-700 dark:text-slate-400 dark:hover:bg-slate-700"
                                >
                                    <QrCode size={18} />
                                </button>
                            </div>
                            {error && <div className="text-[13px] text-error">{error}</div>}

                            {existingBook ? (
                                <div className="mt-1 flex flex-col gap-2.5">
                                    <div className="dark:bg-warning-950/30 rounded-lg border border-warning-200 bg-warning-50 p-3 dark:border-warning-900/50">
                                        <p className="text-[12.5px] leading-snug text-warning-800 dark:text-warning-300">
                                            {textUI.EXISTING_BOOK_WARNING_PREFIX}
                                            <strong>{existingBook.title}</strong>
                                            {textUI.EXISTING_BOOK_WARNING_MIDDLE}
                                            {existingBook.duplicateBy === "title" ? textUI.EXISTING_BOOK_TYPE_TITLE : textUI.EXISTING_BOOK_TYPE_ISBN}
                                            {textUI.EXISTING_BOOK_WARNING_SUFFIX}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                            onManageCopies(existingBook.bookId, existingBook.title);
                                        }}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-warning-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-warning-700"
                                    >
                                        {textUI.MANAGE_COPIES_BTN}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        disabled={!isbn.trim() || loading}
                                        onClick={() => handleSearch()}
                                        className="hover:bg-primary-800 dark:bg-primary-600 flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors disabled:opacity-50 dark:hover:bg-primary-700"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                        {loading ? textUI.SEARCHING : textUI.SEARCH_BTN}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsScannerOpen(true)}
                                        className="dark:border-primary-800 dark:hover:bg-primary-950/40 flex items-center justify-center gap-1.5 rounded-lg border border-primary-300 bg-white px-3.5 py-2 text-[13px] font-semibold text-primary-700 shadow-sm transition-colors hover:bg-primary-50 dark:bg-slate-800 dark:text-primary-300"
                                    >
                                        <QrCode size={16} />
                                        {textUI.SCAN_BTN}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative mb-5 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-surface-container-high dark:border-slate-800"></div>
                        </div>
                        <div className="relative bg-white px-3 text-[12.5px] text-on-surface-variant dark:bg-slate-900 dark:text-slate-400">
                            {textUI.OR_TEXT}
                        </div>
                    </div>

                    {/* Manual Section */}
                    <div className="rounded-xl border border-surface-container-high bg-surface p-4 text-center dark:border-slate-800 dark:bg-slate-800/40">
                        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                            <FileEdit size={16} />
                        </div>
                        <h3 className="text-[14.5px] font-semibold text-ink-950 dark:text-white">{textUI.MANUAL_TITLE}</h3>
                        <p className="mt-1 text-[12.5px] text-on-surface-variant dark:text-slate-400">{textUI.MANUAL_DESC}</p>
                        <button
                            type="button"
                            onClick={onSelectManual}
                            className="mt-3 flex w-full justify-center rounded-lg border border-surface-container-high bg-white px-4 py-2 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-surface-container-lowest dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                            {textUI.MANUAL_BTN}
                        </button>
                    </div>
                </div>
            </div>

            {isScannerOpen && (
                <BookScannerModal
                    isOpen={isScannerOpen}
                    onClose={() => setIsScannerOpen(false)}
                    onScanSuccess={(scannedIsbn) => {
                        setIsScannerOpen(false);
                        setIsbn(scannedIsbn);
                        handleSearch(scannedIsbn);
                    }}
                />
            )}
        </div>
    );
}
