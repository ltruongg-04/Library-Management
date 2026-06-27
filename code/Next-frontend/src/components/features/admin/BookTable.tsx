"use client";

import { useEffect, useState, useRef } from "react";
import { MoreVertical, ChevronLeft, ChevronRight, Book, BookOpen, SearchCode, Loader2, Pencil, Trash2 } from "lucide-react";
import { bookService } from "@/services/book";
import type { BookListItem, PageResponse } from "@/types/book";

const StatusBadge = ({ status }: { status?: string }) => {
  switch (status) {
    case "AVAILABLE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-info-50 px-3 py-1 text-[13px] font-medium text-info-600">
          <span className="h-1.5 w-1.5 rounded-full bg-info-500"></span>
          Có sẵn
        </span>
      );
    case "BORROWED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-[13px] font-medium text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-outline"></span>
          Đang mượn
        </span>
      );
    case "PROCESSING_AI_SCAN":
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-fixed px-3 py-1 text-[13px] font-medium text-tertiary-500 border border-tertiary-100/50">
          <span className="h-1.5 w-1.5 rounded-full bg-tertiary-300"></span>
          Đang xử lý AI
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[13px] font-medium text-outline border border-surface-container-high">
          <span className="h-1.5 w-1.5 rounded-full bg-surface-container-highest"></span>
          Chưa rõ
        </span>
      );
  }
};

const CoverPlaceholder = ({ status }: { status?: string }) => {
  return (
    <div className="flex h-16 w-12 items-center justify-center rounded bg-surface-container-high text-outline overflow-hidden shrink-0">
      {status === 'AVAILABLE' ? <Book size={18} /> : status === 'BORROWED' ? <BookOpen size={18} /> : <SearchCode size={18} />}
    </div>
  );
};

const TableRow = ({ book, onEdit }: { book: BookListItem, onEdit: (id: number) => void }) => {
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
          <CoverPlaceholder status={book.status} />
        )}
      </td>
      <td className="px-6 py-4">
        <div className="max-w-[200px]">
          <p className="font-semibold text-ink-950 leading-tight mb-1">{book.title}</p>
          <p className="text-[13px] text-on-surface-variant">{book.author}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-on-surface-variant font-mono text-[13px]">{book.isbn || 'N/A'}</td>
      <td className="px-6 py-4">
        <span className="rounded-md bg-surface px-2.5 py-1 text-[13px] font-medium text-on-surface-variant border border-surface-container-high inline-block max-w-[120px] truncate" title={book.category}>
          {book.category || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={book.status} />
        <div className="mt-1.5 text-[12px] text-on-surface-variant font-medium">
          Kho: {book.availableQuantity} / {book.quantity || 0}
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
            <div className="absolute right-0 z-10 mt-1 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <button
                  onClick={() => { setIsMenuOpen(false); onEdit(book.id); }}
                  className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface transition-colors"
                >
                  <Pencil size={15} className="text-outline group-hover:text-primary-600" />
                  Sửa
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

import EditBookModal from "./EditBookModal";

export default function BookTable() {
  const [data, setData] = useState<PageResponse<BookListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // Edit Modal State
  const [editBookId, setEditBookId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookService.getAdminBookInventory(currentPage, 10);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleEditClick = (id: number) => {
    setEditBookId(id);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchData(page); // refresh list
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
                <th className="px-6 py-4 font-medium">Trạng thái</th>
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
                    <p>Không có sách nào.</p>
                  </td>
                </tr>
              ) : (
                data?.content.map((book) => (
                  <TableRow key={book.id} book={book} onEdit={handleEditClick} />
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
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded border border-surface-container-high bg-white text-outline hover:bg-surface hover:text-on-surface focus-ring transition-colors disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              disabled={loading || !data || data.last}
              onClick={() => setPage(p => p + 1)}
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
    </>
  );
}
