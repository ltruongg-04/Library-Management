"use client";

import { useEffect, useState } from "react";
import { LibraryBig, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import { formatCurrency } from "@/lib/utils";
import { createAdminStockReceipt } from "@/services/adminStockReceipt";
import { AdminSupplier, createAdminSupplier, getAdminSuppliers } from "@/services/adminSupplier";
import { bookService } from "@/services/book";
import type { BookListItem } from "@/types/book";

interface CreateReceiptModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface SelectedBook extends BookListItem {
    importQuantity: number;
    importPrice: number;
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
    const [searchResults, setSearchResults] = useState<BookListItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Selected Books Cart
    const [selectedBooks, setSelectedBooks] = useState<SelectedBook[]>([]);

    useEffect(() => {
        fetchSuppliers();
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

    const handleSearchBooks = async () => {
        if (!searchKeyword.trim()) return;
        setIsSearching(true);
        try {
            const res = await bookService.getAdminBookInventory(0, 10, searchKeyword);
            if (res && res.content) {
                setSearchResults(res.content);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_76);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddBookToReceipt = (book: BookListItem) => {
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
            <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-6 py-4">
                    <h2 className="text-xl font-bold">{UI_TEXT.RECENT.TEXT_69}</h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-outline-variant/30">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left: Form & Search */}
                    <div className="flex w-1/3 flex-col overflow-y-auto border-r border-outline-variant/30 p-6">
                        <div className="mb-6 flex flex-col gap-1.5">
                            <label className="text-sm font-medium">{UI_TEXT.RECENT.TEXT_68}</label>
                            {isAddingSupplier ? (
                                <div className="flex gap-2">
                                    <input
                                        autoFocus
                                        placeholder="Tên nhà cung cấp mới..."
                                        className="flex-1 rounded-lg border border-outline-variant p-2 text-sm"
                                        value={newSupplierName}
                                        onChange={(e) => setNewSupplierName(e.target.value)}
                                    />
                                    <button onClick={handleQuickAddSupplier} className="rounded-lg bg-primary px-3 text-sm text-white">
                                        {UI_TEXT.RECENT.TEXT_67}
                                    </button>
                                    <button onClick={() => setIsAddingSupplier(false)} className="rounded-lg bg-surface-variant px-3 text-sm">
                                        {UI_TEXT.RECENT.TEXT_66}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low p-2 text-sm"
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
                                        className="rounded-lg border border-outline-variant px-2 hover:bg-surface-variant"
                                        title="Thêm NCC mới"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mb-6 flex flex-col gap-1.5">
                            <label className="text-sm font-medium">{UI_TEXT.RECENT.TEXT_64}</label>
                            <textarea
                                rows={2}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2 text-sm"
                                placeholder="Ghi chú thêm..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div className="my-4 h-px w-full bg-outline-variant/30"></div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">{UI_TEXT.RECENT.TEXT_63}</label>
                            <div className="flex gap-2">
                                <input
                                    placeholder="Tên sách, ISBN..."
                                    className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low p-2 text-sm"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearchBooks()}
                                />
                                <button onClick={handleSearchBooks} className="rounded-lg bg-surface-variant px-3 hover:bg-outline-variant/30">
                                    {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                                </button>
                            </div>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="mt-4 flex max-h-64 flex-col gap-2 overflow-y-auto rounded-lg border border-outline-variant/50 p-2">
                                {searchResults.map((book) => (
                                    <div
                                        key={book.id}
                                        className="flex items-center justify-between rounded border-b border-outline-variant/20 p-2 last:border-0 hover:bg-surface-variant/50"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {book.imageUrl ? (
                                                <img src={book.imageUrl} className="h-10 w-8 rounded object-cover" />
                                            ) : (
                                                <div className="flex h-10 w-8 items-center justify-center rounded bg-surface-variant">
                                                    <LibraryBig size={14} />
                                                </div>
                                            )}
                                            <div className="text-xs">
                                                <p className="line-clamp-1 font-semibold">{book.title}</p>
                                                <p className="line-clamp-1 text-on-surface-variant">
                                                    {book.authors?.map((a) => a.name).join(", ") || UI_TEXT.RECENT.TEXT_62}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddBookToReceipt(book)}
                                            className="ml-2 flex-shrink-0 rounded bg-primary/10 p-1.5 text-primary transition-colors hover:bg-primary hover:text-white"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Selected Books Table */}
                    <div className="flex w-2/3 flex-col bg-surface-container-lowest p-6">
                        <h3 className="mb-4 font-bold">
                            {UI_TEXT.RECENT.TEXT_61}
                            {selectedBooks.length})
                        </h3>
                        <div className="flex-1 overflow-y-auto rounded-xl border border-outline-variant/30">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 z-10 bg-surface-container-low shadow-sm">
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
                                            <td colSpan={5} className="p-12 text-center text-on-surface-variant">
                                                {UI_TEXT.RECENT.TEXT_57}
                                            </td>
                                        </tr>
                                    ) : (
                                        selectedBooks.map((book) => (
                                            <tr key={book.id} className="border-b border-outline-variant/20 hover:bg-surface-variant/10">
                                                <td className="p-3">
                                                    <p className="line-clamp-1 font-medium">{book.title}</p>
                                                    <p className="text-xs text-on-surface-variant">ISBN: {book.isbn}</p>
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className="w-full rounded border border-outline-variant p-1.5 text-center text-sm"
                                                        value={book.importQuantity}
                                                        onChange={(e) => handleUpdateBook(book.id, "importQuantity", Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1000"
                                                        className="w-full rounded border border-outline-variant p-1.5 text-right text-sm"
                                                        value={book.importPrice}
                                                        onChange={(e) => handleUpdateBook(book.id, "importPrice", Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-3 text-right font-medium text-error">
                                                    {formatCurrency(book.importQuantity * book.importPrice)}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button onClick={() => handleRemoveBook(book.id)} className="text-on-surface-variant hover:text-error">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <div>
                                <p className="text-sm text-on-surface-variant">{UI_TEXT.RECENT.TEXT_56}</p>
                                <p className="text-2xl font-bold text-error">{formatCurrency(totalAmount)}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={onClose} className="rounded-lg px-6 py-2.5 font-medium hover:bg-surface-variant">
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
        </div>
    );
}
