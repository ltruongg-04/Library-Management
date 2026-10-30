"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, ExternalLink, FileUp, Globe, Loader2, Save, Search, Sparkles, X } from "lucide-react";
import { getSession } from "next-auth/react";
import Image from "next/image";
import CreatableSelect from "react-select/creatable";
import { UI_TEXT } from "@/constants/ui-text";
import { ADMIN } from "@/constants/ui-text/admin";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import { type AdminMembershipTier, getAdminMembershipTiers } from "@/services/adminMembershipTier";
import { authorService } from "@/services/author";
import { bookService } from "@/services/book";
import { categoryService } from "@/services/category";
import { ebookService } from "@/services/ebook";
import { fileService } from "@/services/file";
import { tagService } from "@/services/tag";
import type { Author } from "@/types/author";
import type { BookCreateRequest } from "@/types/book";
import type { Category } from "@/types/category";
import type { Tag } from "@/types/tag";

export interface MatchedEbookData {
    title: string;
    author: string;
    cover?: string;
    description?: string;
    pages?: number;
    wordCount?: number;
    epubUrl: string;
    pageUrl: string;
    matchScore?: number;
    source?: string;
}

export interface InitialBookData {
    title?: string;
    authors?: string[];
    description?: string;
    publisher?: string;
    publicationDate?: string;
    pages?: number;
    isbn?: string;
    imageUrl?: string;
    categories?: string[];
    tags?: string[];
    matchedEbook?: MatchedEbookData | null;
}

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (createdBook?: any) => void;
    initialData?: InitialBookData | null;
    onManageCopies?: (id: number, title: string) => void;
}

export default function AddBookModal({ isOpen, onClose, onSuccess, initialData, onManageCopies }: AddBookModalProps) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);
    const [isbn, setIsbn] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);

    const [authorInputValue, setAuthorInputValue] = useState("");
    const [categoryInputValue, setCategoryInputValue] = useState("");
    const [tagInputValue, setTagInputValue] = useState("");

    const [shelfLocation, setShelfLocation] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [externalImageUrl, setExternalImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [publisher, setPublisher] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    const [pages, setPages] = useState<number | "">("");
    const [depositPrice, setDepositPrice] = useState<number | "">("");
    const [initialQuantity, setInitialQuantity] = useState<number | "">("");

    // Duplicate check
    const [existingBook, setExistingBook] = useState<{ bookId: number; title: string; duplicateBy?: "isbn" | "title" } | null>(null);

    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);
    const [availableTiers, setAvailableTiers] = useState<AdminMembershipTier[]>([]);

    // Ebook setup states
    const [enableEbook, setEnableEbook] = useState<boolean>(true);
    const [ebookMode, setEbookMode] = useState<"matched" | "sample" | "upload">("sample");
    const [matchedEbook, setMatchedEbook] = useState<MatchedEbookData | null>(null);
    const [isSearchingEbook, setIsSearchingEbook] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [ebookFile, setEbookFile] = useState<File | null>(null);
    const [ebookPreviewPages, setEbookPreviewPages] = useState<number>(5);
    const [ebookIsFree, setEbookIsFree] = useState<boolean>(false);
    const [ebookMinTierId, setEbookMinTierId] = useState<number | "none">("none");

    const textUI = ADMIN.MODAL.ADD_BOOK;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [catData, authData, tagData, tiersRes] = await Promise.all([
                    categoryService.getAllCategories(),
                    authorService.getAllAuthors(),
                    tagService.getAllTags(),
                    getAdminMembershipTiers(),
                ]);
                setAvailableCategories(catData);
                setAvailableAuthors(authData);
                setAvailableTags(tagData);
                if (tiersRes.success && tiersRes.data) {
                    setAvailableTiers(tiersRes.data);
                }
            } catch (err) {
                console.error("Failed to load reference data:", err);
                setError(API_ERRORS.FETCH_CATEGORIES_ERROR);
            } finally {
                setLoading(false);
            }
        };
        if (isOpen) {
            loadData();
            // Reset or preset form
            setTitle(initialData?.title || "");
            setIsbn(initialData?.isbn || "");
            setDescription(initialData?.description || "");
            setPublisher(initialData?.publisher || "");
            setPublicationDate(initialData?.publicationDate || "");
            setPages(initialData?.pages || "");
            setImageUrl(initialData?.imageUrl || "");
            setEnableEbook(true);
            if (initialData?.matchedEbook) {
                setMatchedEbook(initialData.matchedEbook);
                setEbookMode("matched");
                setSearchQuery(initialData.matchedEbook.title || initialData.title || "");
            } else {
                setMatchedEbook(null);
                setEbookMode("sample");
                setSearchQuery(initialData?.title || "");
            }
            setEbookFile(null);
            setEbookPreviewPages(5);
            setEbookIsFree(false);
            setEbookMinTierId("none");

            // For authors, we create __isNew__ labels if they don't exist yet
            if (initialData?.authors && initialData.authors.length > 0) {
                const initAuthors = initialData.authors.map((a) => ({ label: a, value: a, __isNew__: true }));
                setSelectedAuthors(initAuthors);
            } else {
                setSelectedAuthors([]);
            }

            // For categories, we also create __isNew__ labels
            if (initialData?.categories && initialData.categories.length > 0) {
                const initCategories = initialData.categories.map((c) => ({ label: c, value: c, __isNew__: true }));
                setSelectedCategories(initCategories);
            } else {
                setSelectedCategories([]);
            }

            if (initialData?.tags && initialData.tags.length > 0) {
                const initTags = initialData.tags.map((t) => ({ label: t, value: t, __isNew__: true }));
                setSelectedTags(initTags);
            } else {
                setSelectedTags([]);
            }

            setShelfLocation("");
            setDepositPrice("");
            setInitialQuantity("");
            setError(null);

            // External API cover URLs are sent to the backend and stored through the configured object storage.
            if (initialData?.imageUrl && initialData.imageUrl.startsWith("http")) {
                setExternalImageUrl(initialData.imageUrl);
            } else {
                setExternalImageUrl("");
            }

            // Auto check duplicate for autofilled data
            if (initialData?.isbn || initialData?.title) {
                bookService.checkDuplicate(initialData.isbn?.trim() || "", initialData.title?.trim() || "").then((result) => {
                    if (result.exists && result.bookId && result.title) {
                        setExistingBook({ bookId: result.bookId, title: result.title, duplicateBy: result.duplicateBy });
                    }
                });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final check before submit
        let isDuplicate = !!existingBook;
        if (!existingBook && (isbn.trim() || title.trim())) {
            const checkResult = await bookService.checkDuplicate(isbn.trim(), title.trim());
            if (checkResult.exists && checkResult.bookId && checkResult.title) {
                setExistingBook({ bookId: checkResult.bookId, title: checkResult.title, duplicateBy: checkResult.duplicateBy });
                isDuplicate = true;
            }
        }

        if (isDuplicate) {
            setError(textUI.DUPLICATE_ERROR_MSG);
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const authorIds = selectedAuthors.filter((a) => !a.__isNew__).map((a) => Number(a.value));
            const newAuthors = selectedAuthors.filter((a) => a.__isNew__).map((a) => a.label);

            const categoryIds = selectedCategories.filter((c) => !c.__isNew__).map((c) => Number(c.value));
            const newCategories = selectedCategories.filter((c) => c.__isNew__).map((c) => c.label);

            const tagIds = selectedTags.filter((t) => !t.__isNew__).map((t) => Number(t.value));
            const newTags = selectedTags.filter((t) => t.__isNew__).map((t) => t.label);

            const createData: BookCreateRequest = {
                title,
                authorIds,
                newAuthors,
                isbn,
                categoryIds,
                newCategories,
                tagIds,
                newTags,
                shelfLocation,
                imageUrl: (imageUrl || externalImageUrl || "").trim() || undefined,
                description,
                publisher,
                publicationDate: publicationDate || undefined,
                pages: pages === "" ? undefined : Number(pages),
                depositPrice: depositPrice === "" ? undefined : Number(depositPrice),
                initialQuantity: initialQuantity === "" ? undefined : Number(initialQuantity),
            };

            const created = await bookService.createBook(createData);

            // Tự động thiết lập Sách mềm nếu được kích hoạt
            if (enableEbook && created?.id) {
                try {
                    if (ebookMode === "matched" && matchedEbook) {
                        const session = await getSession();
                        const token = session?.backendToken;
                        await axios.post(
                            "/api/admin/books/standard-ebooks/import",
                            {
                                bookId: created.id,
                                url: matchedEbook.pageUrl,
                                previewPages: ebookPreviewPages,
                                isFree: ebookIsFree,
                                minMembershipTierId: ebookMinTierId !== "none" ? Number(ebookMinTierId) : undefined,
                            },
                            {
                                headers: token ? { Authorization: `Bearer ${token}` } : {},
                            },
                        );
                    } else if (ebookMode === "upload" && ebookFile) {
                        const formData = new FormData();
                        formData.append("file", ebookFile);
                        formData.append("previewPages", ebookPreviewPages.toString());
                        formData.append("isFree", ebookIsFree.toString());
                        if (ebookMinTierId !== "none") {
                            formData.append("minMembershipTierId", ebookMinTierId.toString());
                        }
                        if (pages !== "") {
                            formData.append("totalPages", pages.toString());
                        }
                        await ebookService.uploadEbook(created.id, formData);
                    } else if (ebookMode === "sample") {
                        await ebookService.createSampleEbook(created.id, {
                            previewPages: ebookPreviewPages,
                            isFree: ebookIsFree,
                            minMembershipTierId: ebookMinTierId !== "none" ? Number(ebookMinTierId) : undefined,
                        });
                    }
                } catch (ebookErr) {
                    console.error("Failed to setup ebook for new book:", ebookErr);
                }
            }

            onSuccess(created);
            onClose();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || textUI.ERROR;
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleSearchMatchedEbook = async () => {
        const query = searchQuery.trim() || title.trim();
        if (!query) return;
        setIsSearchingEbook(true);
        try {
            const firstAuthor = selectedAuthors[0]?.label || selectedAuthors[0]?.name || "";
            const res = await axios.get("/api/admin/books/standard-ebooks/search", {
                params: {
                    title: query,
                    author: firstAuthor,
                },
                timeout: 12000,
            });
            if (res.data?.found && res.data?.data) {
                setMatchedEbook(res.data.data);
                setEbookMode("matched");
            } else {
                setMatchedEbook(null);
                setEbookMode("sample");
            }
        } catch (err) {
            console.warn("Failed to search matched ebook:", err);
        } finally {
            setIsSearchingEbook(false);
        }
    };

    const handleDuplicateCheck = async () => {
        if (!isbn.trim() && !title.trim()) {
            setExistingBook(null);
            return;
        }
        const result = await bookService.checkDuplicate(isbn.trim(), title.trim());
        if (result.exists && result.bookId && result.title) {
            setExistingBook({ bookId: result.bookId, title: result.title, duplicateBy: result.duplicateBy });
        } else {
            setExistingBook(null);
        }
    };

    const authorOptions = availableAuthors.map((a) => ({ value: a.id.toString(), label: a.name }));
    const categoryOptions = availableCategories.map((c) => ({ value: c.id.toString(), label: c.name }));
    const tagOptions = availableTags.map((t) => ({ value: t.id.toString(), label: t.name }));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900">
                <div className="flex shrink-0 items-center justify-between border-b border-surface-container-high px-6 py-4 dark:border-slate-800">
                    <h2 className="text-[18px] font-semibold text-ink-950 dark:text-white">{textUI.TITLE}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-12 text-outline">
                            <Loader2 size={32} className="animate-spin text-primary-500" />
                            <p>{UI_TEXT.COMMON.LOADING_DATA}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && <div className="rounded-lg bg-error-50 p-3 text-[14px] text-error">{error}</div>}

                            {existingBook && (
                                <div className="rounded-lg border border-warning-200 bg-warning-50 p-4 shadow-sm">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-[13.5px] leading-relaxed text-warning-800">
                                            {textUI.EXISTING_BOOK_WARNING_PREFIX}
                                            <strong>{existingBook.title}</strong>
                                            {textUI.EXISTING_BOOK_WARNING_MIDDLE}
                                            {existingBook.duplicateBy === "title" ? textUI.EXISTING_BOOK_TYPE_TITLE : textUI.EXISTING_BOOK_TYPE_ISBN}
                                            {textUI.EXISTING_BOOK_WARNING_SUFFIX}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => onManageCopies?.(existingBook.bookId, existingBook.title)}
                                            className="focus-ring shrink-0 rounded-lg bg-warning-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-warning-700"
                                        >
                                            {textUI.MANAGE_COPIES_BTN}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.TITLE_INPUT}</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            if (existingBook?.duplicateBy === "title") setExistingBook(null);
                                        }}
                                        onBlur={handleDuplicateCheck}
                                        className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.AUTHOR_INPUT}</label>
                                    <CreatableSelect
                                        isMulti
                                        options={authorOptions}
                                        value={selectedAuthors}
                                        inputValue={authorInputValue}
                                        onInputChange={(newValue: any) => setAuthorInputValue(newValue)}
                                        onChange={(newValue: any) => setSelectedAuthors(newValue as any[])}
                                        onBlur={() => {
                                            if (authorInputValue.trim()) {
                                                setSelectedAuthors([
                                                    ...selectedAuthors,
                                                    { label: authorInputValue.trim(), value: authorInputValue.trim(), __isNew__: true },
                                                ]);
                                                setAuthorInputValue("");
                                            }
                                        }}
                                        placeholder={textUI.SELECT_AUTHOR_PLACEHOLDER}
                                        formatCreateLabel={(inputValue: string) => `${textUI.CREATE_AUTHOR} "${inputValue}"`}
                                        noOptionsMessage={() => textUI.NO_AUTHOR_FOUND}
                                        className="text-[14px]"
                                        styles={{
                                            control: (base: any) => ({
                                                ...base,
                                                borderRadius: "0.5rem",
                                                borderColor: "#E2E8F0",
                                                padding: "2px",
                                                boxShadow: "none",
                                                "&:hover": { borderColor: "#16a34a" },
                                            }),
                                            option: (base: any) => ({ ...base, fontSize: "13px" }),
                                            multiValue: (base: any) => ({ ...base, backgroundColor: "#f1f5f9", borderRadius: "4px" }),
                                        }}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.ISBN_INPUT}</label>
                                    <input
                                        type="text"
                                        value={isbn}
                                        onChange={(e) => {
                                            setIsbn(e.target.value);
                                            if (existingBook?.duplicateBy === "isbn") setExistingBook(null);
                                        }}
                                        onBlur={handleDuplicateCheck}
                                        className="w-full rounded-lg border border-surface-container-high px-3 py-2 font-mono text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.CATEGORY_INPUT}</label>
                                    <CreatableSelect
                                        isMulti
                                        options={categoryOptions}
                                        value={selectedCategories}
                                        inputValue={categoryInputValue}
                                        onInputChange={(newValue: any) => setCategoryInputValue(newValue)}
                                        onChange={(newValue: any) => setSelectedCategories(newValue as any[])}
                                        onBlur={() => {
                                            if (categoryInputValue.trim()) {
                                                setSelectedCategories([
                                                    ...selectedCategories,
                                                    { label: categoryInputValue.trim(), value: categoryInputValue.trim(), __isNew__: true },
                                                ]);
                                                setCategoryInputValue("");
                                            }
                                        }}
                                        placeholder={textUI.SELECT_CATEGORY_PLACEHOLDER}
                                        formatCreateLabel={(inputValue: string) => `${textUI.CREATE_CATEGORY} "${inputValue}"`}
                                        noOptionsMessage={() => textUI.NO_CATEGORY_FOUND}
                                        className="text-[14px]"
                                        styles={{
                                            control: (base: any) => ({
                                                ...base,
                                                borderRadius: "0.5rem",
                                                borderColor: "#E2E8F0",
                                                padding: "2px",
                                                boxShadow: "none",
                                                "&:hover": { borderColor: "#16a34a" },
                                            }),
                                            option: (base: any) => ({ ...base, fontSize: "13px" }),
                                            multiValue: (base: any) => ({ ...base, backgroundColor: "#f1f5f9", borderRadius: "4px" }),
                                        }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.TAG_INPUT}</label>
                                    <CreatableSelect
                                        isMulti
                                        options={tagOptions}
                                        value={selectedTags}
                                        inputValue={tagInputValue}
                                        onInputChange={(newValue: any) => setTagInputValue(newValue)}
                                        onChange={(newValue: any) => setSelectedTags(newValue as any[])}
                                        onBlur={() => {
                                            if (tagInputValue.trim()) {
                                                setSelectedTags([
                                                    ...selectedTags,
                                                    { label: tagInputValue.trim(), value: tagInputValue.trim(), __isNew__: true },
                                                ]);
                                                setTagInputValue("");
                                            }
                                        }}
                                        placeholder={textUI.SELECT_TAG_PLACEHOLDER}
                                        formatCreateLabel={(inputValue: string) => `${textUI.CREATE_TAG} "${inputValue}"`}
                                        noOptionsMessage={() => textUI.NO_TAG_FOUND}
                                        className="text-[14px]"
                                        styles={{
                                            control: (base: any) => ({
                                                ...base,
                                                borderRadius: "0.5rem",
                                                borderColor: "#E2E8F0",
                                                padding: "2px",
                                                boxShadow: "none",
                                                "&:hover": { borderColor: "#16a34a" },
                                            }),
                                            option: (base: any) => ({ ...base, fontSize: "13px" }),
                                            multiValue: (base: any) => ({ ...base, backgroundColor: "#f1f5f9", borderRadius: "4px" }),
                                        }}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.PUBLISHER_INPUT}</label>
                                    <input
                                        type="text"
                                        value={publisher}
                                        onChange={(e) => setPublisher(e.target.value)}
                                        className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.PUBLICATION_DATE_INPUT}</label>
                                    <input
                                        type="date"
                                        value={publicationDate}
                                        onChange={(e) => setPublicationDate(e.target.value)}
                                        className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.PAGES_INPUT}</label>
                                    <input
                                        type="number"
                                        value={pages}
                                        onChange={(e) => setPages(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.DEPOSIT_PRICE_INPUT}</label>
                                    <input
                                        type="number"
                                        value={depositPrice}
                                        onChange={(e) => setDepositPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.INITIAL_QUANTITY_INPUT}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={initialQuantity}
                                        onChange={(e) => setInitialQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.SHELF_LOCATION_INPUT}</label>
                                    <input
                                        type="text"
                                        value={shelfLocation}
                                        onChange={(e) => setShelfLocation(e.target.value)}
                                        className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 space-y-1.5 border-t border-surface-container-high pt-5">
                                <label className="text-[13px] font-medium text-on-surface-variant">{textUI.DESCRIPTION_INPUT}</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[80px] w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                            </div>

                            <div className="space-y-1.5 border-t border-surface-container-high pt-5">
                                <label className="text-[13px] font-medium text-on-surface-variant">{textUI.IMAGE_URL_INPUT}</label>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder={textUI.OR_ENTER_URL}
                                            value={externalImageUrl}
                                            onChange={(e) => setExternalImageUrl(e.target.value)}
                                            className="flex-1 rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                        <button
                                            type="button"
                                            disabled={!externalImageUrl || uploadingImage}
                                            onClick={async () => {
                                                try {
                                                    setUploadingImage(true);
                                                    const url = await fileService.uploadFileFromUrl(externalImageUrl);
                                                    setImageUrl(url);
                                                    setExternalImageUrl("");
                                                } catch (err) {
                                                    console.error("Failed to fetch image from URL", err);
                                                } finally {
                                                    setUploadingImage(false);
                                                }
                                            }}
                                            className="rounded-lg bg-surface-container-high px-4 py-2 text-[13px] font-medium text-on-surface hover:bg-surface-container-highest disabled:opacity-50"
                                        >
                                            {textUI.PULL_FROM_URL}
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            try {
                                                setUploadingImage(true);
                                                const url = await fileService.uploadFile(file);
                                                setImageUrl(url);
                                            } catch (err) {
                                                console.error("Failed to upload image", err);
                                            } finally {
                                                setUploadingImage(false);
                                            }
                                        }}
                                        className="w-full text-[14px] file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                                    />
                                    {uploadingImage && <div className="text-[13px] text-primary-500">{textUI.UPLOADING_IMAGE}</div>}
                                    {imageUrl && (
                                        <div className="relative h-32 w-24 overflow-hidden rounded-md border border-surface-container-high">
                                            <Image src={imageUrl} alt="Cover preview" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thiết lập Sách mềm (E-book) trực tuyến */}
                            <div className="border-primary-200/80 dark:bg-primary-950/20 space-y-4 rounded-xl border bg-primary-50/40 p-4 dark:border-primary-900/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="bg-primary-600 flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm dark:bg-primary-500">
                                            <BookOpen size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-[14px] font-semibold text-ink-950 dark:text-white">
                                                {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.SECTION_TITLE}
                                            </h3>
                                            <p className="text-[12px] text-slate-500 dark:text-slate-400">{UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.ENABLE_HINT}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={enableEbook}
                                            onChange={(e) => setEnableEbook(e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <div className="peer-checked:bg-primary-600 peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-slate-700 dark:peer-checked:bg-primary-500" />
                                    </label>
                                </div>

                                {enableEbook && (
                                    <div className="space-y-3.5 pt-1">
                                        {/* Banner bản số hóa tìm thấy */}
                                        {matchedEbook ? (
                                            <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-3.5 shadow-sm dark:border-emerald-800/80 dark:bg-emerald-950/30">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                                            <Globe size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200">
                                                                    {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MATCHED_FOUND_BADGE}
                                                                </span>
                                                                {matchedEbook.matchScore && (
                                                                    <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                                                                        {Math.round(matchedEbook.matchScore * 100)}
                                                                        {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MATCHED_SCORE_SUFFIX}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 className="mt-1 text-[13.5px] font-semibold text-emerald-950 dark:text-emerald-100">
                                                                {matchedEbook.title}
                                                            </h4>
                                                            <p className="text-[12px] text-emerald-800 dark:text-emerald-300">
                                                                {matchedEbook.author}
                                                                {matchedEbook.wordCount
                                                                    ? ` • ${matchedEbook.wordCount.toLocaleString()} ${UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MATCHED_WORDS}`
                                                                    : ""}
                                                                {matchedEbook.pages
                                                                    ? ` • ~${matchedEbook.pages} ${UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MATCHED_ESTIMATED_PAGES}`
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {matchedEbook.pageUrl && (
                                                        <a
                                                            href={matchedEbook.pageUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="shadow-xs flex shrink-0 items-center gap-1 rounded-md bg-white/80 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-white dark:bg-slate-900/80 dark:text-emerald-300 dark:hover:bg-slate-900"
                                                        >
                                                            {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MATCHED_VIEW_SOURCE}
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            /* Thanh tìm kiếm bản số hóa nếu chưa tìm thấy */
                                            <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                                                <p className="text-[12px] text-slate-600 dark:text-slate-400">
                                                    {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MATCHED_NOT_FOUND}
                                                </p>
                                                <div className="mt-2 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder={UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.SEARCH_AGAIN_PLACEHOLDER}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                handleSearchMatchedEbook();
                                                            }
                                                        }}
                                                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] text-ink-950 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={isSearchingEbook || !searchQuery.trim()}
                                                        onClick={handleSearchMatchedEbook}
                                                        className="shadow-xs flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                                    >
                                                        {isSearchingEbook ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                                                        {isSearchingEbook
                                                            ? UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.SEARCHING_EBOOK
                                                            : UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.SEARCH_AGAIN_BTN}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Chọn chế độ: Bản khớp (nếu có), Bản mẫu, hoặc Upload */}
                                        <div className="space-y-1.5">
                                            <label className="text-[12.5px] font-medium text-slate-700 dark:text-slate-300">
                                                {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MODE_LABEL}
                                            </label>
                                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                                                {matchedEbook && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setEbookMode("matched")}
                                                        className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition-all ${
                                                            ebookMode === "matched"
                                                                ? "border-emerald-500 bg-white shadow-sm ring-1 ring-emerald-500/20 dark:border-emerald-500 dark:bg-slate-900"
                                                                : "border-slate-200 bg-white/60 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900"
                                                        }`}
                                                    >
                                                        <Sparkles size={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                        <div>
                                                            <div className="text-[13px] font-semibold text-ink-950 dark:text-white">
                                                                {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MODE_MATCHED}
                                                            </div>
                                                            <div className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                                {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MODE_MATCHED_DESC}
                                                            </div>
                                                        </div>
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => setEbookMode("sample")}
                                                    className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition-all ${
                                                        ebookMode === "sample"
                                                            ? "border-primary-500 bg-white shadow-sm ring-1 ring-primary-500/20 dark:border-primary-500 dark:bg-slate-900"
                                                            : "border-slate-200 bg-white/60 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900"
                                                    }`}
                                                >
                                                    <BookOpen size={18} className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400" />
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-ink-950 dark:text-white">
                                                            {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MODE_SAMPLE}
                                                        </div>
                                                        <div className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                            {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MODE_SAMPLE_DESC}
                                                        </div>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setEbookMode("upload")}
                                                    className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition-all ${
                                                        ebookMode === "upload"
                                                            ? "border-primary-500 bg-white shadow-sm ring-1 ring-primary-500/20 dark:border-primary-500 dark:bg-slate-900"
                                                            : "border-slate-200 bg-white/60 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900"
                                                    }`}
                                                >
                                                    <FileUp size={18} className="text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-ink-950 dark:text-white">
                                                            {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MODE_UPLOAD}
                                                        </div>
                                                        <div className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                            {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.MODE_UPLOAD_DESC}
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Upload file nếu chọn upload */}
                                        {ebookMode === "upload" && (
                                            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                                                <label className="mb-1 block text-[12.5px] font-medium text-slate-700 dark:text-slate-300">
                                                    {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.SELECT_PDF}
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setEbookFile(file);
                                                    }}
                                                    className="file:text-primary-800 hover:file:bg-primary-200 w-full text-[13px] text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold dark:text-slate-300 dark:file:bg-primary-900/40 dark:file:text-primary-300"
                                                />
                                                {ebookFile && (
                                                    <p className="mt-1.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                                                        {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.PDF_SELECTED} {ebookFile.name} (
                                                        {(ebookFile.size / 1024 / 1024).toFixed(2)} MB)
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Cấu hình quyền đọc */}
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="space-y-1">
                                                <label className="text-[12.5px] font-medium text-slate-700 dark:text-slate-300">
                                                    {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.PREVIEW_LABEL}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="999"
                                                    value={ebookPreviewPages}
                                                    onChange={(e) => setEbookPreviewPages(Math.max(1, Number(e.target.value)))}
                                                    disabled={ebookIsFree}
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13.5px] text-ink-950 focus:border-primary-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                />
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.PREVIEW_HINT}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[12.5px] font-medium text-slate-700 dark:text-slate-300">
                                                    {UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.TIER_LABEL}
                                                </label>
                                                <select
                                                    value={ebookMinTierId}
                                                    onChange={(e) => setEbookMinTierId(e.target.value === "none" ? "none" : Number(e.target.value))}
                                                    disabled={ebookIsFree}
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-ink-950 focus:border-primary-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                >
                                                    <option value="none">{UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.TIER_OPTION_NONE}</option>
                                                    {availableTiers.map((t) => (
                                                        <option key={t.id} value={t.id}>
                                                            {t.name} ({t.minPoints} {UI_TEXT.EBOOK_READER.ADMIN_MODAL.TIER_OPTION_POINTS})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/70 p-2 text-[13px] text-slate-700 transition hover:bg-white dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={ebookIsFree}
                                                        onChange={(e) => setEbookIsFree(e.target.checked)}
                                                        className="text-primary-600 h-4 w-4 rounded border-slate-300 focus:ring-primary-500 dark:border-slate-700"
                                                    />
                                                    <span>{UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.FREE_CHECKBOX}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg px-4 py-2.5 text-[14px] font-medium text-on-surface-variant transition-colors hover:bg-surface"
                                >
                                    {textUI.CANCEL}
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="focus-ring flex items-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-70"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {saving
                                        ? enableEbook && ebookMode === "matched"
                                            ? UI_TEXT.EBOOK_READER.ADD_BOOK_EBOOK.AUTO_IMPORTING_EBOOK
                                            : textUI.LOADING
                                        : textUI.SUBMIT}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
