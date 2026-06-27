"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { bookService } from "@/services/book";
import type { Book, BookUpdateRequest } from "@/types/book";

interface EditBookModalProps {
  bookId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBookModal({ bookId, isOpen, onClose, onSuccess }: EditBookModalProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [shelfLocation, setShelfLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [quantity, setQuantity] = useState<number>(0);
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);

  useEffect(() => {
    if (isOpen && bookId) {
      fetchBookDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getBookById(bookId);
      setBook(data);
      
      setTitle(data.title || "");
      setAuthor(data.author || "");
      setIsbn(data.isbn || "");
      setCategory(data.categories?.join(", ") || "");
      setStatus((data as any).status || "AVAILABLE"); // handle missing status in type if not updated properly
      setShelfLocation(data.shelfLocation || "");
      setImageUrl(data.imageUrl || "");
      setQuantity(data.quantity || 0);
      setAvailableQuantity(data.availableQuantity || 0);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải thông tin sách");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const updateData: BookUpdateRequest = {
        title,
        author,
        isbn,
        category,
        status,
        shelfLocation,
        imageUrl,
        quantity,
        availableQuantity,
      };

      await bookService.updateBook(bookId, updateData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Lỗi khi lưu sách");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-surface-container-high px-6 py-4 shrink-0">
          <h2 className="text-[18px] font-semibold text-ink-950">Chỉnh sửa sách</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex py-12 flex-col items-center justify-center gap-3 text-outline">
              <Loader2 size={32} className="animate-spin text-primary-500" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : error && !book ? (
            <div className="py-12 text-center text-error">
              <p>{error}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-error-50 p-3 text-[14px] text-error">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">Tiêu đề *</label>
                  <input 
                    type="text" 
                    required 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">Tác giả *</label>
                  <input 
                    type="text" 
                    required 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">ISBN</label>
                  <input 
                    type="text" 
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] font-mono focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">Thể loại</label>
                  <input 
                    type="text" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">Tổng số lượng</label>
                  <input 
                    type="number" 
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">Số lượng có sẵn</label>
                  <input 
                    type="number" 
                    min="0"
                    value={availableQuantity}
                    onChange={(e) => setAvailableQuantity(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">Trạng thái</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                  >
                    <option value="AVAILABLE">Có sẵn</option>
                    <option value="BORROWED">Đang mượn</option>
                    <option value="PROCESSING_AI_SCAN">Đang xử lý AI</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">Vị trí kệ sách</label>
                  <input 
                    type="text" 
                    value={shelfLocation}
                    onChange={(e) => setShelfLocation(e.target.value)}
                    className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-surface-container-high pt-5 mt-5">
                <label className="text-[13px] font-medium text-on-surface-variant">URL Ảnh bìa</label>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="rounded-lg px-4 py-2.5 text-[14px] font-medium text-on-surface-variant hover:bg-surface transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-70 focus-ring"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
