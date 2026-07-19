"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Book, ChevronLeft, ChevronRight, Library, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { UI_TEXT } from "@/constants/ui-text";
import { ADMIN_UI } from "@/constants/ui-text/admin";
import { ADMIN_INVENTORY_MANAGEMENT } from "@/constants/ui-text/admin";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import { bookService } from "@/services/book";
import type { BookListItem, PageResponse } from "@/types/book";
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
    onDelete: (book: BookListItem) => void;
    canEditBook: boolean;
}

const TableRow = ({ book, onEdit, onManageCopies, onDelete, canEditBook }: TableRowProps) => {
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
            <td className="px-6 py-4 font-mono text-[13px] text-on-surface-variant">{book.isbn || textUI.TABLE.NOT_UPDATED}</td>
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
                        : ADMIN_UI.BOOKS.NOT_SHELVED}
                </p>
            </td>
            <td className="px-6 py-4 text-center">
                {canEditBook && (
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
                                            onDelete(book);
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
                )}
            </td>
        </tr>
    );
};

interface DeleteBookDialogProps {
    book: BookListItem | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function DeleteBookDialog({ book, isDeleting, onClose, onConfirm }: DeleteBookDialogProps) {
    if (!book) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm" role="presentation">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-book-dialog-title"
                aria-describedby="delete-book-dialog-description"
                className="w-full max-w-md rounded-xl border border-error-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.22)] dark:border-error-900/60 dark:bg-slate-900"
            >
                <div className="flex items-start gap-4 border-b border-surface-container-high px-6 py-5 dark:border-slate-800">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-error-50 text-error-600 dark:bg-error-900/30 dark:text-error-200">
                        <AlertTriangle size={22} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <h2 id="delete-book-dialog-title" className="text-title-md font-semibold text-ink-950 dark:text-white">
                            {textUI.TABLE.DELETE_DIALOG_TITLE}
                        </h2>
                        <p id="delete-book-dialog-description" className="mt-1 text-body-sm leading-5 text-on-surface-variant dark:text-slate-300">
                            {textUI.TABLE.DELETE_DIALOG_DESCRIPTION}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        aria-label={textUI.TABLE.DELETE_DIALOG_CLOSE}
                        className="focus-ring rounded p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5">
                    <div className="rounded-lg border border-surface-container-high bg-surface-container-lowest p-4 dark:border-slate-800 dark:bg-slate-950/40">
                        <p className="text-label-caps font-medium text-on-surface-variant dark:text-slate-400">{textUI.TABLE.DELETE_DIALOG_BOOK_LABEL}</p>
                        <p className="mt-2 line-clamp-2 text-body-md font-semibold text-ink-950 dark:text-white">{book.title}</p>
                        <p className="mt-1 text-body-sm text-on-surface-variant dark:text-slate-300">
                            {book.authors && book.authors.length > 0 ? book.authors.map((author) => author.name).join(", ") : textUI.TABLE.NOT_UPDATED}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-surface-container-high px-6 py-4 dark:border-slate-800 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="focus-ring inline-flex h-10 items-center justify-center rounded-lg border border-surface-container-high bg-white px-4 text-body-sm font-semibold text-on-surface transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                    >
                        {textUI.TABLE.DELETE_DIALOG_CANCEL}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-error-600 px-4 text-body-sm font-semibold text-white transition-colors hover:bg-error-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-error-500 dark:hover:bg-error-600"
                    >
                        <Trash2 size={16} />
                        {isDeleting ? textUI.TABLE.DELETE_DIALOG_DELETING : textUI.TABLE.DELETE_DIALOG_CONFIRM}
                    </button>
                </div>
            </section>
        </div>
    );
}

interface BookTableProps {
    canEditBook?: boolean;
    onManageCopies?: (id: number, title: string) => void;
}

export default function BookTable({ canEditBook = false, onManageCopies }: BookTableProps) {
    const [data, setData] = useState<PageResponse<BookListItem> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteBook, setDeleteBook] = useState<BookListItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
            setError(err.message || API_ERRORS.GENERIC_FETCH_ERROR);
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
        if (onManageCopies) {
            onManageCopies(id, title);
        }
    };

    const handleDeleteClick = (book: BookListItem) => {
        setDeleteBook(book);
    };

    const handleCloseDeleteDialog = () => {
        if (isDeleting) return;
        setDeleteBook(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteBook) return;

        try {
            setIsDeleting(true);
            setLoading(true);
            await bookService.deleteBook(deleteBook.id);
            toast.success(textUI.TABLE.DELETE_SUCCESS);
            setDeleteBook(null);
            await fetchData();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || textUI.TABLE.DELETE_ERROR);
            setLoading(false);
        } finally {
            setIsDeleting(false);
        }
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
                                    <TableRow
                                        key={book.id}
                                        book={book}
                                        onEdit={handleEditClick}
                                        onManageCopies={handleManageCopiesClick}
                                        onDelete={handleDeleteClick}
                                        canEditBook={canEditBook}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between border-t border-surface-container-high px-6 py-4 text-[13px] text-on-surface-variant">
                    <span>
                        {loading || !data
                            ? UI_TEXT.COMMON.LOADING
                            : `${ADMIN_UI.BOOKS.SHOWING} ${data.number * data.size + 1} ${ADMIN_UI.BOOKS.TO} ${Math.min((data.number + 1) * data.size, data.totalElements)} ${ADMIN_UI.BOOKS.OF} ${data.totalElements} ${ADMIN_UI.BOOKS.ITEMS}`}
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

            <DeleteBookDialog book={deleteBook} isDeleting={isDeleting} onClose={handleCloseDeleteDialog} onConfirm={handleConfirmDelete} />
        </>
    );
}
