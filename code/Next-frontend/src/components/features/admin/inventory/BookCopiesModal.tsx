"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2, Edit } from "lucide-react";
import { bookCopyService } from "@/services/book-copy";
import type { BookCopy, BookCopyStatus, BookCopyUpdateRequest } from "@/types/book-copy";

interface BookCopiesModalProps {
  bookId: number;
  bookTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Triggered when quantity changes
}

export default function BookCopiesModal({ bookId, bookTitle, isOpen, onClose, onSuccess }: BookCopiesModalProps) {
  const [copies, setCopies] = useState<BookCopy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status mapping for UI
  const statusMap: Record<BookCopyStatus, { label: string, colorClass: string }> = {
    AVAILABLE: { label: "Sẵn sàng", colorClass: "bg-info-50 text-info-600 border-info-100" },
    BORROWED: { label: "Đang mượn", colorClass: "bg-surface-container-high text-on-surface-variant border-outline" },
    LOST: { label: "Bị mất", colorClass: "bg-error-50 text-error-600 border-error-100" },
    DAMAGED: { label: "Hư hỏng", colorClass: "bg-warning-50 text-warning-700 border-warning-200" },
    MAINTENANCE: { label: "Bảo trì", colorClass: "bg-tertiary-50 text-tertiary-600 border-tertiary-100" },
  };

  useEffect(() => {
    if (isOpen && bookId) {
      fetchCopies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bookId]);

  const fetchCopies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookCopyService.getCopiesByBookId(bookId);
      setCopies(data);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải danh sách bản sao");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCopy = async () => {
    try {
      setLoading(true);
      await bookCopyService.addCopy(bookId);
      await fetchCopies();
      onSuccess(); // Triggers table refresh to update quantity
    } catch (err: any) {
      alert(err.message || "Lỗi khi thêm bản sao");
      setLoading(false);
    }
  };

  const handleStatusChange = async (copyId: number, newStatus: BookCopyStatus) => {
    try {
      setLoading(true);
      await bookCopyService.updateCopy(copyId, { status: newStatus });
      await fetchCopies();
      onSuccess(); // Status change might affect availableQuantity
    } catch (err: any) {
      alert(err.message || "Lỗi khi cập nhật trạng thái");
      setLoading(false);
    }
  };

  const handleDeleteCopy = async (copyId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xoá bản sao này? Hành động này không thể hoàn tác.")) return;
    
    try {
      setLoading(true);
      await bookCopyService.deleteCopy(copyId);
      await fetchCopies();
      onSuccess(); // Triggers table refresh to update quantity
    } catch (err: any) {
      alert(err.message || "Lỗi khi xoá bản sao");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high px-6 py-4 shrink-0 bg-surface">
          <div>
            <h2 className="text-[18px] font-semibold text-ink-950">Quản lý các cuốn sách (Bản sao)</h2>
            <p className="text-[13px] text-on-surface-variant mt-0.5">Đầu sách: <span className="font-semibold">{bookTitle}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-surface-container-high flex justify-between items-center shrink-0">
          <div className="text-[14px] text-on-surface-variant font-medium">
            Tổng cộng: <span className="text-on-surface font-bold">{copies.length}</span> cuốn
          </div>
          <button
            onClick={handleAddCopy}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-50 focus-ring"
          >
            <Plus size={16} />
            Thêm 1 cuốn
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto bg-surface-container-lowest">
          {loading && copies.length === 0 ? (
            <div className="flex py-12 flex-col items-center justify-center gap-3 text-outline">
              <Loader2 size={32} className="animate-spin text-primary-500" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-error">
              <p>{error}</p>
            </div>
          ) : copies.length === 0 ? (
            <div className="py-12 text-center text-outline">
              <p>Chưa có cuốn sách (bản sao) nào cho đầu sách này.</p>
              <button 
                onClick={handleAddCopy}
                className="mt-4 text-primary-600 hover:underline font-medium text-[14px]"
              >
                Nhập kho ngay
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-surface-container-high overflow-hidden bg-white">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-surface/50 font-label-caps text-[12px] uppercase tracking-wider text-on-surface-variant border-b border-surface-container-high">
                  <tr>
                    <th className="px-6 py-3 font-medium">Mã Vạch (Barcode)</th>
                    <th className="px-6 py-3 font-medium">Trạng Thái</th>
                    <th className="px-6 py-3 font-medium">Ghi chú tình trạng</th>
                    <th className="px-6 py-3 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high text-on-surface">
                  {copies.map(copy => (
                    <tr key={copy.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-6 py-3 font-mono font-medium text-ink-900">{copy.barcode}</td>
                      <td className="px-6 py-3">
                        <select
                          value={copy.status}
                          onChange={(e) => handleStatusChange(copy.id, e.target.value as BookCopyStatus)}
                          disabled={loading}
                          className={`appearance-none rounded-full px-3 py-1 text-[12px] font-medium border outline-none cursor-pointer focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 ${statusMap[copy.status].colorClass}`}
                        >
                          {Object.entries(statusMap).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3 text-on-surface-variant text-[13px]">
                        {copy.conditionNote || <span className="italic text-outline">Không có</span>}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleDeleteCopy(copy.id)}
                          disabled={loading}
                          className="p-1.5 text-error-400 hover:bg-error-50 hover:text-error rounded transition-colors disabled:opacity-50"
                          title="Xoá bản sao này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
