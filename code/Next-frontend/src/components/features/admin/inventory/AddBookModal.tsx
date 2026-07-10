"use client";
import { useEffect, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import CreatableSelect from "react-select/creatable";
import { UI_TEXT } from "@/constants/ui-text";
import { ADMIN } from "@/constants/ui-text/admin";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import { authorService } from "@/services/author";
import { bookService } from "@/services/book";
import { categoryService } from "@/services/category";
import { fileService } from "@/services/file";
import { tagService } from "@/services/tag";
import type { Author } from "@/types/author";
import type { BookCreateRequest } from "@/types/book";
import type { Category } from "@/types/category";
import type { Tag } from "@/types/tag";

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
}

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: InitialBookData | null;
}

export default function AddBookModal({ isOpen, onClose, onSuccess, initialData }: AddBookModalProps) {
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

    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);

    const textUI = ADMIN.MODAL.ADD_BOOK;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [catData, authData, tagData] = await Promise.all([
                    categoryService.getAllCategories(),
                    authorService.getAllAuthors(),
                    tagService.getAllTags(),
                ]);
                setAvailableCategories(catData);
                setAvailableAuthors(authData);
                setAvailableTags(tagData);
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
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                imageUrl,
                description,
                publisher,
                publicationDate: publicationDate || undefined,
                pages: pages === "" ? undefined : Number(pages),
                depositPrice: depositPrice === "" ? undefined : Number(depositPrice),
                initialQuantity: initialQuantity === "" ? undefined : Number(initialQuantity),
            };

            await bookService.createBook(createData);
            onSuccess();
            onClose();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || textUI.ERROR;
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const authorOptions = availableAuthors.map((a) => ({ value: a.id.toString(), label: a.name }));
    const categoryOptions = availableCategories.map((c) => ({ value: c.id.toString(), label: c.name }));
    const tagOptions = availableTags.map((t) => ({ value: t.id.toString(), label: t.name }));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex shrink-0 items-center justify-between border-b border-surface-container-high px-6 py-4">
                    <h2 className="text-[18px] font-semibold text-ink-950">{textUI.TITLE}</h2>
                    <button onClick={onClose} className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface">
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

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-on-surface-variant">{textUI.TITLE_INPUT}</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
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
                                        onChange={(e) => setIsbn(e.target.value)}
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
                                    {textUI.SUBMIT}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
