"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { LibraryBig, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import { formatCurrency } from "@/lib/utils";
import { createAdminStockReceipt } from "@/services/adminStockReceipt";
import { AdminSupplier, createAdminSupplier, getAdminSuppliers } from "@/services/adminSupplier";
import { bookService } from "@/services/book";
import type { BookListItem } from "@/types/book";
import AddBookModal, { InitialBookData } from "./AddBookModal";
import ChooseAddMethodModal from "./ChooseAddMethodModal";

interface CreateReceiptModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface SelectedBook extends BookListItem {
    importQuantity: number;
    importPrice: number;
    publisher?: string;
}

interface SearchBookItem extends BookListItem {
    isExternal?: boolean;
    rawExternalData?: any;
}

export default function CreateReceiptModal({ onClose, onSuccess }: CreateReceiptModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);

    const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
    const [note, setNote] = useState("");

    // Quick Add Supplier
    const [isAddingSupplier, setIsAddingSupplier] = useState(false);
    const [newSupplierName, setNewSupplierName] = useState("");

    // Book Search
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState<SearchBookItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Selected Books Cart
    const [selectedBooks, setSelectedBooks] = useState<SelectedBook[]>([]);

    // Quick Add New Book Modals
    const [isChooseAddMethodOpen, setIsChooseAddMethodOpen] = useState(false);
    const [isAddBookOpen, setIsAddBookOpen] = useState(false);
    const [initialBookData, setInitialBookData] = useState<InitialBookData | null>(null);

    const modalText = UI_TEXT.ADMIN.MODAL.CREATE_RECEIPT;

    const handleBookCreated = (createdBook?: any) => {
        if (!createdBook) return;
        const newBook: SelectedBook = {
            id: createdBook.id,
            title: createdBook.title || modalText.NEW_BOOK_TITLE,
            isbn: createdBook.isbn || "",
            imageUrl: createdBook.imageUrl,
            authors: createdBook.authors || [],
            publisher: createdBook.publisher,
            categories: createdBook.categories || [],
            tags: createdBook.tags || [],
            availableQuantity: 0,
            quantity: 0,
            rating: 0,
            importQuantity: 1,
            importPrice: 0,
        };
        setSelectedBooks((prev) => {
            if (prev.some((b) => b.id === newBook.id)) return prev;
            return [...prev, newBook];
        });
        toast.success(`${modalText.SUCCESS_ADD_PREFIX}${newBook.title}${modalText.SUCCESS_ADD_SUFFIX}`);
    };

    useEffect(() => {
        fetchSuppliers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await getAdminSuppliers();
            if (res.success && res.data) {
                setSuppliers(res.data);
                if (res.data.length > 0) setSelectedSupplierId(res.data[0].id);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_79);
        }
    };

    const handleQuickAddSupplier = async () => {
        if (!newSupplierName.trim()) return;
        try {
            const res = await createAdminSupplier({ name: newSupplierName, phone: "", email: "", address: "", isActive: true });
            if (res.success && res.data) {
                toast.success(UI_TEXT.RECENT.TEXT_78);
                await fetchSuppliers();
                setSelectedSupplierId(res.data.id);
                setIsAddingSupplier(false);
                setNewSupplierName("");
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_77);
        }
    };

    const handleSearchBooks = async (query?: string | React.MouseEvent) => {
        const keyword = (typeof query === "string" ? query : searchKeyword).trim();
        if (!keyword) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            // 1. Tìm trong kho sách của thư viện trước
            const res = await bookService.getAdminBookInventory(0, 10, keyword);
            if (res && res.content && res.content.length > 0) {
                setSearchResults(res.content);
                return;
            }

            // 2. Nếu không có trong kho và từ khóa có dạng ISBN/Mã vạch (8 - 20 số)
            const cleanCode = keyword.replace(/\s+/g, "");
            const isCode = /^[\d-]{8,20}$/.test(cleanCode);

            if (isCode) {
                try {
                    let externalBook: any = null;

                    // Thử tra cứu từ vn-lookup (Tiki trước -> Fahasa sau)
                    const vnRes = await axios.get(`/api/admin/books/vn-lookup?query=${encodeURIComponent(cleanCode)}`);
                    if (vnRes.data?.success && vnRes.data?.data) {
                        externalBook = vnRes.data.data;
                    } else {
                        // Thử Google Books
                        const gRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanCode}`);
                        if (gRes.data?.items?.[0]?.volumeInfo) {
                            const info = gRes.data.items[0].volumeInfo;
                            externalBook = {
                                title: info.title,
                                authors: info.authors || [],
                                publisher: info.publisher,
                                pages: info.pageCount,
                                description: info.description,
                                isbn: cleanCode,
                                imageUrl: info.imageLinks?.thumbnail?.replace("http://", "https://"),
                            };
                        }
                    }

                    if (externalBook && externalBook.title) {
                        setSearchResults([
                            {
                                id: -1,
                                title: externalBook.title,
                                authors: externalBook.authors ? externalBook.authors.map((name: string, idx: number) => ({ id: idx, name })) : [],
                                categories: [{ id: 0, name: modalText.NEW_BOOK_PLACEHOLDER_CAT }],
                                tags: [],
                                imageUrl: externalBook.imageUrl || "",
                                rating: 0,
                                availableQuantity: 0,
                                quantity: 0,
                                isbn: cleanCode,
                                isExternal: true,
                                rawExternalData: externalBook,
                            },
                        ]);
                        return;
                    }
                } catch (lookupErr) {
                    console.warn("Auto external lookup error:", lookupErr);
                }
            }

            setSearchResults([]);
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_76);
        } finally {
            setIsSearching(false);
        }
    };

    // Tự động tìm kiếm sau khi người dùng dừng nhập (Debounce 1000ms = 1 giây)
    useEffect(() => {
        const trimmed = searchKeyword.trim();
        if (!trimmed) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(() => {
            handleSearchBooks(trimmed);
        }, 1000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKeyword]);

    const handleAddBookToReceipt = async (book: SearchBookItem) => {
        // Nếu là sách mới tìm được từ Tiki/Fahasa bên ngoài
        if (book.isExternal && book.rawExternalData) {
            try {
                toast.loading(modalText.QUICK_CREATING, { id: "quick-create-book" });
                const raw = book.rawExternalData;
                const created = await bookService.createBook({
                    title: raw.title,
                    isbn: raw.isbn || book.isbn,
                    publisher: raw.publisher,
                    description: raw.description,
                    imageUrl: raw.imageUrl,
                    pages: raw.pages,
                    publicationDate: raw.publicationDate,
                    authorIds: [],
                    newAuthors: raw.authors || [],
                    categoryIds: [],
                    newCategories: raw.categories && raw.categories.length > 0 ? [raw.categories[0]] : [modalText.FALLBACK_CATEGORY],
                    tagIds: [],
                    newTags: [],
                    initialQuantity: 0,
                });

                toast.success(`${modalText.SUCCESS_CREATE_PREFIX}${created.title}${modalText.SUCCESS_CREATE_SUFFIX}`, { id: "quick-create-book" });
                setSelectedBooks((prev) => [
                    ...prev,
                    {
                        id: created.id,
                        title: created.title,
                        isbn: created.isbn || "",
                        imageUrl: created.imageUrl,
                        authors: created.authors || [],
                        publisher: created.publisher,
                        categories: created.categories || [],
                        tags: created.tags || [],
                        availableQuantity: 0,
                        quantity: 0,
                        rating: 0,
                        importQuantity: 1,
                        importPrice: 0,
                    },
                ]);
                setSearchKeyword("");
                setSearchResults([]);
                return;
            } catch (createErr: any) {
                toast.error(modalText.ERROR_AUTO_CREATE_PREFIX + (createErr.response?.data?.message || createErr.message), { id: "quick-create-book" });
                return;
            }
        }

        if (selectedBooks.find((b) => b.id === book.id)) {
            toast.warning(UI_TEXT.RECENT.TEXT_75);
            return;
        }
        setSelectedBooks([...selectedBooks, { ...book, importQuantity: 1, importPrice: 0 }]);
        setSearchKeyword("");
        setSearchResults([]);
    };

    const handleRemoveBook = (bookId: number) => {
        setSelectedBooks(selectedBooks.filter((b) => b.id !== bookId));
    };

    const handleUpdateBook = (bookId: number, field: "importQuantity" | "importPrice", value: number) => {
        setSelectedBooks(selectedBooks.map((b) => (b.id === bookId ? { ...b, [field]: value } : b)));
    };

    const handleSubmit = async () => {
        if (!selectedSupplierId) {
            toast.error(UI_TEXT.RECENT.TEXT_74);
            return;
        }
        if (selectedBooks.length === 0) {
            toast.error(UI_TEXT.RECENT.TEXT_73);
            return;
        }

        // Validate quantities and prices
        for (const b of selectedBooks) {
            if (b.importQuantity <= 0) {
                toast.error(`Sách "${b.title}" phải có số lượng > 0`);
                return;
            }
            if (b.importPrice < 0) {
                toast.error(`Sách "${b.title}" có giá nhập không hợp lệ`);
                return;
            }
        }

        setIsLoading(true);
        try {
            const details = selectedBooks.map((b) => ({
                bookId: b.id,
                quantity: b.importQuantity,
                unitPrice: b.importPrice,
            }));

            const res = await createAdminStockReceipt({
                supplierId: selectedSupplierId,
                note: note,
                details: details,
            });

            if (res.success) {
                toast.success(UI_TEXT.RECENT.TEXT_72);
                onSuccess();
            } else {
                toast.error(res.message || UI_TEXT.RECENT.TEXT_71);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_70);
        } finally {
            setIsLoading(false);
        }
    };

    const totalAmount = selectedBooks.reduce((sum, b) => sum + b.importQuantity * b.importPrice, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
            <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60">
                    <h2 className="text-xl font-bold text-on-surface dark:text-white">{UI_TEXT.RECENT.TEXT_69}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-on-surface-variant hover:bg-outline-variant/30 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left: Form & Search */}
                    <div className="flex w-1/3 flex-col overflow-y-auto border-r border-outline-variant/30 p-6 dark:border-slate-800">
                        <div className="mb-6 flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_68}</label>
                            {isAddingSupplier ? (
                                <div className="flex gap-2">
                                    <input
                                        autoFocus
                                        placeholder="Tên nhà cung cấp mới..."
                                        className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low p-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={newSupplierName}
                                        onChange={(e) => setNewSupplierName(e.target.value)}
                                    />
                                    <button onClick={handleQuickAddSupplier} className="rounded-lg bg-primary px-3 text-sm text-white hover:bg-primary/90">
                                        {UI_TEXT.RECENT.TEXT_67}
                                    </button>
                                    <button
                                        onClick={() => setIsAddingSupplier(false)}
                                        className="rounded-lg bg-surface-variant px-3 text-sm text-on-surface hover:bg-outline-variant/30 dark:bg-slate-800 dark:text-slate-300"
                                    >
                                        {UI_TEXT.RECENT.TEXT_66}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low p-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={selectedSupplierId}
                                        onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                                    >
                                        <option value={0} disabled>
                                            {UI_TEXT.RECENT.TEXT_65}
                                        </option>
                                        {suppliers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => setIsAddingSupplier(true)}
                                        className="rounded-lg border border-outline-variant px-2 text-on-surface hover:bg-surface-variant dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        title="Thêm NCC mới"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mb-6 flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_64}</label>
                            <textarea
                                rows={2}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                placeholder="Ghi chú thêm..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div className="my-4 h-px w-full bg-outline-variant/30 dark:bg-slate-800"></div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_63}</label>
                                <button
                                    type="button"
                                    onClick={() => setIsChooseAddMethodOpen(true)}
                                    className="dark:text-primary-400 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                >
                                    <Plus size={14} /> {modalText.BTN_ADD_NEW_BOOK}
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        placeholder={modalText.SEARCH_PLACEHOLDER}
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2 pr-9 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearchBooks()}
                                    />
                                    {isSearching && (
                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                            <Loader2 size={16} className="animate-spin text-primary" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleSearchBooks()}
                                    className="rounded-lg bg-surface-variant px-3 text-on-surface hover:bg-outline-variant/30 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                    title={modalText.SEARCH_NOW}
                                >
                                    <Search size={18} />
                                </button>
                            </div>
                            {searchKeyword.trim() && !isSearching && searchResults.length === 0 && (
                                <p className="text-[11px] text-on-surface-variant/70 dark:text-slate-400">{modalText.AUTO_SEARCH_HINT}</p>
                            )}
                        </div>

                        {searchResults.length === 0 &&
                            searchKeyword.trim() &&
                            !isSearching &&
                            (() => {
                                const isLikelyIsbn = /^[\d-]{8,20}$/.test(searchKeyword.trim());
                                return (
                                    <div className="mt-3 flex flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant/60 p-4 text-center dark:border-slate-800">
                                        <p className="text-xs text-on-surface-variant dark:text-slate-400">
                                            {isLikelyIsbn
                                                ? `${modalText.NOT_FOUND_ISBN_PREFIX}${searchKeyword}${modalText.NOT_FOUND_ISBN_SUFFIX}`
                                                : `${modalText.NOT_FOUND_BOOK_PREFIX}${searchKeyword}${modalText.NOT_FOUND_BOOK_SUFFIX}`}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setIsChooseAddMethodOpen(true)}
                                            className="mt-2 flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white dark:bg-primary/20 dark:text-primary-300"
                                        >
                                            <Plus size={14} /> {isLikelyIsbn ? modalText.LOOKUP_ISBN_AND_ADD : modalText.ADD_NEW_BOOK_TO_RECEIPT}
                                        </button>
                                    </div>
                                );
                            })()}

                        {searchResults.length > 0 && (
                            <div className="mt-4 flex max-h-64 flex-col gap-2 overflow-y-auto rounded-lg border border-outline-variant/50 p-2 dark:border-slate-800">
                                {searchResults.map((book) => (
                                    <div
                                        key={book.id === -1 ? book.isbn || book.title : book.id}
                                        className="flex items-center justify-between rounded border-b border-outline-variant/20 p-2 last:border-0 hover:bg-surface-variant/50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {book.imageUrl ? (
                                                <Image
                                                    src={book.imageUrl}
                                                    alt={book.title || "Book"}
                                                    width={32}
                                                    height={40}
                                                    className="h-10 w-8 rounded object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex h-10 w-8 items-center justify-center rounded bg-surface-variant dark:bg-slate-800">
                                                    <LibraryBig size={14} className="text-on-surface-variant dark:text-slate-400" />
                                                </div>
                                            )}
                                            <div className="text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="line-clamp-1 font-semibold text-on-surface dark:text-white">{book.title}</p>
                                                    {book.isExternal && (
                                                        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-500/25 dark:text-amber-400">
                                                            {modalText.BADGE_NEW_ONLINE}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="line-clamp-1 text-on-surface-variant dark:text-slate-400">
                                                    {book.authors?.map((a) => a.name).join(", ") || UI_TEXT.RECENT.TEXT_62}
                                                    {book.isbn ? ` • ISBN: ${book.isbn}` : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleAddBookToReceipt(book)}
                                            className="ml-2 flex-shrink-0 rounded bg-primary/10 p-1.5 text-primary transition-colors hover:bg-primary hover:text-white dark:bg-primary/20 dark:text-primary-300 dark:hover:bg-primary dark:hover:text-white"
                                            title={modalText.TOOLTIP_ADD_TO_RECEIPT}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Selected Books Table */}
                    <div className="flex w-2/3 flex-col bg-surface-container-lowest p-6 dark:bg-slate-900/50">
                        <h3 className="mb-4 font-bold text-on-surface dark:text-white">
                            {UI_TEXT.RECENT.TEXT_61}
                            {selectedBooks.length})
                        </h3>
                        <div className="flex-1 overflow-y-auto rounded-xl border border-outline-variant/30 dark:border-slate-800">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 z-10 bg-surface-container-low text-on-surface-variant shadow-sm dark:bg-slate-800 dark:text-slate-300">
                                    <tr>
                                        <th className="p-3 font-semibold">{UI_TEXT.RECENT.TEXT_60}</th>
                                        <th className="w-24 p-3 text-center font-semibold">SL</th>
                                        <th className="w-32 p-3 text-right font-semibold">{UI_TEXT.RECENT.TEXT_59}</th>
                                        <th className="w-32 p-3 text-right font-semibold">{UI_TEXT.RECENT.TEXT_58}</th>
                                        <th className="w-12 p-3 text-center font-semibold"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBooks.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-on-surface-variant dark:text-slate-400">
                                                {UI_TEXT.RECENT.TEXT_57}
                                            </td>
                                        </tr>
                                    ) : (
                                        selectedBooks.map((book) => (
                                            <tr
                                                key={book.id}
                                                className="border-b border-outline-variant/20 hover:bg-surface-variant/10 dark:border-slate-800 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="p-3">
                                                    <p className="line-clamp-1 font-medium text-on-surface dark:text-white">{book.title}</p>
                                                    <p className="text-xs text-on-surface-variant dark:text-slate-400">ISBN: {book.isbn}</p>
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className="w-full rounded border border-outline-variant bg-surface-container-low p-1.5 text-center text-sm text-on-surface dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                        value={book.importQuantity}
                                                        onChange={(e) => handleUpdateBook(book.id, "importQuantity", Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1000"
                                                        className="w-full rounded border border-outline-variant bg-surface-container-low p-1.5 text-right text-sm text-on-surface dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                        value={book.importPrice}
                                                        onChange={(e) => handleUpdateBook(book.id, "importPrice", Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-3 text-right font-medium text-error">
                                                    {formatCurrency(book.importQuantity * book.importPrice)}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        onClick={() => handleRemoveBook(book.id)}
                                                        className="text-on-surface-variant hover:text-error dark:text-slate-400"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/10">
                            <div>
                                <p className="text-sm text-on-surface-variant dark:text-slate-300">{UI_TEXT.RECENT.TEXT_56}</p>
                                <p className="text-2xl font-bold text-error">{formatCurrency(totalAmount)}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="rounded-lg px-6 py-2.5 font-medium text-on-surface hover:bg-surface-variant dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    {UI_TEXT.RECENT.TEXT_55}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || selectedBooks.length === 0}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white shadow hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                                    {UI_TEXT.RECENT.TEXT_54}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isChooseAddMethodOpen && (
                <ChooseAddMethodModal
                    isOpen={isChooseAddMethodOpen}
                    onClose={() => setIsChooseAddMethodOpen(false)}
                    onSelectManual={() => {
                        setIsChooseAddMethodOpen(false);
                        setInitialBookData(null);
                        setIsAddBookOpen(true);
                    }}
                    onSelectAutofill={(data) => {
                        setIsChooseAddMethodOpen(false);
                        setInitialBookData(data);
                        setIsAddBookOpen(true);
                    }}
                    onManageCopies={() => {
                        setIsChooseAddMethodOpen(false);
                    }}
                    initialIsbn={searchKeyword.trim()}
                />
            )}

            {isAddBookOpen && (
                <AddBookModal
                    isOpen={isAddBookOpen}
                    onClose={() => setIsAddBookOpen(false)}
                    onSuccess={(created) => {
                        setIsAddBookOpen(false);
                        handleBookCreated(created);
                    }}
                    initialData={initialBookData}
                />
            )}
        </div>
    );
}
