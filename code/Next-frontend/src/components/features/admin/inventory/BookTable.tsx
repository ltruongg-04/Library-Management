"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Book, ChevronLeft, ChevronRight, Library, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ADMIN_INVENTORY_MANAGEMENT } from "@/constants/ui-text/admin";
import { bookService } from "@/services/book";
import type { BookListItem, PageResponse } from "@/types/book";
import BookCopiesModal from "./BookCopiesModal";
import EditBookModal from "./EditBookModal";

const textUI = ADMIN_INVENTORY_MANAGEMENT;

const CoverPlaceholder = () => {
    return (
        <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-surface-container-high text-outline">
            <Book size={18} />
        </div>
    );
};

interface TableRowProps {
    book: BookListItem;
    onEdit: (id: number) => void;
    onManageCopies: (id: number, title: string) => void;
}

const TableRow = ({ book, onEdit, onManageCopies }: TableRowProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    return (
        <tr className="transition-colors hover:bg-surface/30">
            <td className="px-6 py-4">
                {book.imageUrl ? (
                    <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-surface-container-high text-outline">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={book.imageUrl} alt={book.title} className="h-full w-full object-cover" />
                    </div>
                ) : (
                    <CoverPlaceholder />
                )}
            </td>
            <td className="px-6 py-4">
                <div className="max-w-[200px]">
                    <p className="mb-1 font-semibold leading-tight text-ink-950">{book.title}</p>
                    <p className="text-[13px] text-on-surface-variant">
                        {book.authors && book.authors.length > 0 ? (
                            book.authors.map((a) => a.name).join(", ")
                        ) : (
                            <span className="italic">{textUI.TABLE.NOT_UPDATED}</span>
                        )}
                    </p>
                </div>
            </td>
            <td className="px-6 py-4 font-mono text-[13px] text-on-surface-variant">{book.isbn || "N/A"}</td>
            <td className="px-6 py-4">
                {book.categories && book.categories.length > 0 ? (
                    <div className="flex max-w-[150px] flex-wrap gap-1">
                        {book.categories.map((cat) => (
                            <span
                                key={cat.id}
                                className="truncate rounded-md border border-surface-container-high bg-surface px-2 py-0.5 text-[12px] font-medium text-on-surface-variant"
                                title={cat.name}
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-[13px] italic text-outline-variant">{textUI.TABLE.NA}</span>
                )}
            </td>
            <td className="px-6 py-4 text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-surface-container-high bg-surface-container-low px-3 py-1 text-[14px] font-medium text-on-surface">
                    <span className="text-primary-600">{book.availableQuantity}</span>
                    <span className="text-outline-variant">/</span>
                    <span>{book.quantity || 0}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <p className="text-[13px] leading-tight text-on-surface-variant">
                    {book.shelfLocation
                        ? book.shelfLocation.split(", ").map((loc, idx) => (
                              <span key={idx} className="block">
                                  {loc}
                              </span>
                          ))
                        : "Chưa xếp giá"}
                </p>
            </td>
            <td className="px-6 py-4 text-center">
                <div className="relative inline-block text-left" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="focus-ring rounded p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface"
                    >
                        <MoreVertical size={18} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onManageCopies(book.id, book.title);
                                    }}
                                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-on-surface transition-colors hover:bg-surface"
                                >
                                    <Library size={15} className="group-hover:text-primary-600 text-outline" />
                                    {textUI.TABLE.BTN_COPIES}
                                </button>
                                <div className="my-1 border-t border-surface-container-high"></div>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onEdit(book.id);
                                    }}
                                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-on-surface transition-colors hover:bg-surface"
                                >
                                    <Pencil size={15} className="group-hover:text-primary-600 text-outline" />
                                    {textUI.TABLE.BTN_EDIT}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        toast.info("Chức năng xóa sách đang phát triển");
                                    }}
                                    className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-error transition-colors hover:bg-error-50"
                                >
                                    <Trash2 size={15} className="text-error-400 group-hover:text-error" />
                                    {textUI.TABLE.BTN_DELETE}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default function BookTable() {
    const [data, setData] = useState<PageResponse<BookListItem> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // URL State
    const page = parseInt(searchParams?.get("page") || "0", 10);
    const keyword = searchParams?.get("keyword") || undefined;
    const category = searchParams?.get("category") || undefined;

    // Edit Modal State
    const [editBookId, setEditBookId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Copies Modal State
    const [copiesBookId, setCopiesBookId] = useState<number | null>(null);
    const [copiesBookTitle, setCopiesBookTitle] = useState<string>("");
    const [isCopiesModalOpen, setIsCopiesModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        const startTime = Date.now();
        try {
            setLoading(true);
            setError(null);
            // We no longer pass status since it's removed from filters
            const result = await bookService.getAdminBookInventory(page, 10, keyword, category);
            setData(result);
        } catch (err: any) {
            const elapsed = Date.now() - startTime;
            if (elapsed < 5000) {
                await new Promise((resolve) => setTimeout(resolve, 5000 - elapsed));
            }
            setError(err.message || "Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, [page, keyword, category]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEditClick = (id: number) => {
        setEditBookId(id);
        setIsEditModalOpen(true);
    };

    const handleManageCopiesClick = (id: number, title: string) => {
        setCopiesBookId(id);
        setCopiesBookTitle(title);
        setIsCopiesModalOpen(true);
    };

    const handleEditSuccess = () => {
        fetchData(); // refresh list
    };

    const createPageUrl = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("page", newPage.toString());
        return `${pathname}?${params.toString()}`;
    };

    const setPage = (newPage: number) => {
        router.push(createPageUrl(newPage));
    };

    return (
        <>
            <div className="flex flex-col rounded-xl border border-surface-container-high bg-white shadow-sm">
                <div className="min-h-[400px] overflow-x-auto">
                    <table className="w-full text-left text-[14px]">
                        <thead className="border-b border-surface-container-high bg-surface/50 font-label-caps text-[12px] uppercase tracking-wider text-on-surface-variant">
                            <tr>
                                <th className="px-6 py-4 font-medium">{textUI.TABLE.COL_COVER}</th>
                                <th className="px-6 py-4 font-medium">{textUI.TABLE.COL_TITLE}</th>
                                <th className="px-6 py-4 font-medium">{textUI.TABLE.COL_ISBN}</th>
                                <th className="px-6 py-4 font-medium">{textUI.TABLE.COL_CATEGORY}</th>
                                <th className="px-6 py-4 text-center font-medium">{textUI.TABLE.COL_STOCK}</th>
                                <th className="px-6 py-4 font-medium">{textUI.TABLE.COL_LOCATION}</th>
                                <th className="px-6 py-4 text-center font-medium">{textUI.TABLE.COL_ACTIONS}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high text-on-surface">
                            {loading ? (
                                <TableSkeleton columns={7} rows={5} />
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-error">
                                        <p>{error}</p>
                                    </td>
                                </tr>
                            ) : data?.content.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-outline">
                                        <p>{textUI.TABLE.EMPTY_STATE}</p>
                                    </td>
                                </tr>
                            ) : (
                                data?.content.map((book) => (
                                    <TableRow key={book.id} book={book} onEdit={handleEditClick} onManageCopies={handleManageCopiesClick} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between border-t border-surface-container-high px-6 py-4 text-[13px] text-on-surface-variant">
                    <span>
                        {loading || !data
                            ? "Đang tải..."
                            : `Hiển thị ${data.number * data.size + 1} đến ${Math.min((data.number + 1) * data.size, data.totalElements)} của ${data.totalElements} mục`}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={loading || !data || data.first}
                            onClick={() => setPage(Math.max(0, page - 1))}
                            className="focus-ring flex h-8 w-8 items-center justify-center rounded border border-surface-container-high bg-white text-outline transition-colors hover:bg-surface hover:text-on-surface disabled:opacity-50 disabled:hover:bg-white"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            disabled={loading || !data || data.last}
                            onClick={() => setPage(page + 1)}
                            className="focus-ring flex h-8 w-8 items-center justify-center rounded border border-surface-container-high bg-white text-outline transition-colors hover:bg-surface hover:text-on-surface disabled:opacity-50 disabled:hover:bg-white"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && editBookId !== null && (
                <EditBookModal bookId={editBookId} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={handleEditSuccess} />
            )}

            {isCopiesModalOpen && copiesBookId !== null && (
                <BookCopiesModal
                    bookId={copiesBookId}
                    bookTitle={copiesBookTitle}
                    isOpen={isCopiesModalOpen}
                    onClose={() => setIsCopiesModalOpen(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </>
    );
}
