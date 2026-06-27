"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { categoryService } from "@/services/category";
import type { Category, CategoryRequest } from "@/types/category";

interface CategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryModal({ category, isOpen, onClose, onSuccess }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name);
        setDescription(category.description || "");
      } else {
        setName("");
        setDescription("");
      }
      setError(null);
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const requestData: CategoryRequest = {
        name,
        description,
      };

      if (category?.id) {
        await categoryService.updateCategory(category.id, requestData);
      } else {
        await categoryService.createCategory(requestData);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Lỗi khi lưu thể loại");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-surface-container-high px-6 py-4 shrink-0">
          <h2 className="text-[18px] font-semibold text-ink-950">
            {category ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-error-50 p-3 text-[14px] text-error">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-on-surface-variant">Tên thể loại *</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Khoa học viễn tưởng"
                className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-on-surface-variant">Mô tả</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn gọn về thể loại này..."
                rows={3}
                className="w-full rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-high mt-6">
              <button 
                type="button" 
                onClick={onClose}
                className="rounded-lg px-4 py-2.5 text-[14px] font-medium text-on-surface-variant hover:bg-surface transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                disabled={saving || !name.trim()}
                className="flex items-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-70 focus-ring"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
