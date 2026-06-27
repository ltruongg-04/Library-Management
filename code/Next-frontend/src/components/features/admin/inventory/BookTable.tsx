"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MoreVertical, ChevronLeft, ChevronRight, Book, Loader2, Pencil, Trash2, Library } from "lucide-react";
import { bookService } from "@/services/book";
import type { BookListItem, PageResponse } from "@/types/book";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import EditBookModal from "./EditBookModal";
import BookCopiesModal from "./BookCopiesModal";

const CoverPlaceholder = () => {
  return (
    <div className="flex h-16 w-12 items-center justify-center rounded bg-surface-container-high text-outline overflow-hidden shrink-0">
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
          <div className="flex h-16 w-12 items-center justify-center rounded bg-surface-container-high text-outline overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={book.imageUrl} alt={book.title} className="h-full w-full object-cover" />
          </div>
        ) : (
          <CoverPlaceholder />
        )}
      </td>
      <td className="px-6 py-4">
        <div className="max-w-[200px]">
          <p className="font-semibold text-ink-950 leading-tight mb-1">{book.title}</p>
          <p className="text-[13px] text-on-surface-variant">
            {book.authors && book.authors.length > 0 
              ? book.authors.map(a => a.name).join(', ') 
              : <span className="italic">Chưa cập nhật</span>}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 text-on-surface-variant font-mono text-[13px]">{book.isbn || 'N/A'}</td>
      <td className="px-6 py-4">
        {book.categories && book.categories.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {book.categories.map(cat => (
              <span key={cat.id} className="rounded-md bg-surface px-2 py-0.5 text-[12px] font-medium text-on-surface-variant border border-surface-container-high truncate" title={cat.name}>
                {cat.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-outline-variant italic text-[13px]">N/A</span>
        )}
      </td>
      <td className="px-6 py-4 text-center">
        <div className="text-[14px] font-medium text-on-surface inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 border border-surface-container-high">
          <span className="text-primary-600">{book.availableQuantity}</span> 
          <span className="text-outline-variant">/</span> 
          <span>{book.quantity || 0}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-[13px] text-on-surface-variant leading-tight">
          {book.shelfLocation ? book.shelfLocation.split(', ').map((loc, idx) => (
            <span key={idx} className="block">{loc}</span>
          )) : 'Chưa xếp giá'}
        </p>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded p-1.5 text-outline hover:bg-surface hover:text-on-surface transition-colors focus-ring"
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <button
                  onClick={() => { setIsMenuOpen(false); onManageCopies(book.id, book.title); }}
                  className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface transition-colors"
                >
                  <Library size={15} className="text-outline group-hover:text-primary-600" />
                  Chi tiết các cuốn
                </button>
                <div className="border-t border-surface-container-high my-1"></div>
                <button
                  onClick={() => { setIsMenuOpen(false); onEdit(book.id); }}
                  className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface transition-colors"
                >
                  <Pencil size={15} className="text-outline group-hover:text-primary-600" />
                  Sửa thông tin
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); alert('Chức năng xóa sách đang phát triển'); }}
                  className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error-50 transition-colors"
                >
                  <Trash2 size={15} className="text-error-400 group-hover:text-error" />
                  Xóa
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
    try {
      setLoading(true);
      setError(null);
      // We no longer pass status since it's removed from filters
      const result = await bookService.getAdminBookInventory(page, 10, keyword, undefined, category);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải dữ liệu');
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
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-surface/50 font-label-caps text-[12px] uppercase tracking-wider text-on-surface-variant border-b border-surface-container-high">
              <tr>
                <th className="px-6 py-4 font-medium">Ảnh bìa</th>
                <th className="px-6 py-4 font-medium">Tiêu đề & Tác giả</th>
                <th className="px-6 py-4 font-medium">ISBN-13</th>
                <th className="px-6 py-4 font-medium">Thể loại</th>
                <th className="px-6 py-4 text-center font-medium">Tồn kho</th>
                <th className="px-6 py-4 font-medium">Vị trí</th>
                <th className="px-6 py-4 text-center font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high text-on-surface">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-outline">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-primary-500" />
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-error">
                    <p>{error}</p>
                  </td>
                </tr>
              ) : data?.content.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-outline">
                    <p>Không tìm thấy sách nào phù hợp với bộ lọc.</p>
                  </td>
                </tr>
              ) : (
                data?.content.map((book) => (
                  <TableRow 
                    key={book.id} 
                    book={book} 
                    onEdit={handleEditClick} 
                    onManageCopies={handleManageCopiesClick}
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
              ? "Đang tải..."
              : `Hiển thị ${data.number * data.size + 1} đến ${Math.min((data.number + 1) * data.size, data.totalElements)} của ${data.totalElements} mục`}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={loading || !data || data.first}
              onClick={() => setPage(Math.max(0, page - 1))}
              className="flex h-8 w-8 items-center justify-center rounded border border-surface-container-high bg-white text-outline hover:bg-surface hover:text-on-surface focus-ring transition-colors disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={loading || !data || data.last}
              onClick={() => setPage(page + 1)}
              className="flex h-8 w-8 items-center justify-center rounded border border-surface-container-high bg-white text-outline hover:bg-surface hover:text-on-surface focus-ring transition-colors disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {isEditModalOpen && editBookId !== null && (
        <EditBookModal
          bookId={editBookId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
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
