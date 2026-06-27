"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Loader2, Tags } from "lucide-react";
import { categoryService } from "@/services/category";
import type { Category } from "@/types/category";
import CategoryModal from "./CategoryModal";

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải danh sách thể loại");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá thể loại này? Các sách thuộc thể loại này sẽ không còn hiển thị thể loại này nữa.")) {
      return;
    }
    
    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Lỗi khi xoá thể loại");
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-surface-container-high bg-white">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink-950 flex items-center gap-2">
            <Tags size={24} className="text-primary-600" />
            Quản lý Thể loại
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            Thêm, sửa, xoá và quản lý các thể loại sách trong hệ thống.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-500 focus-ring shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Thêm thể loại mới
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-outline">
            <Loader2 size={32} className="animate-spin text-primary-500" />
            <p>Đang tải danh sách thể loại...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-error">
            <p>{error}</p>
            <button onClick={fetchCategories} className="px-4 py-2 bg-surface-container-high rounded-lg text-on-surface hover:bg-surface-container-highest">Thử lại</button>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-outline">
            <Tags size={48} className="text-surface-container-highest" />
            <p>Chưa có thể loại nào.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-surface-container-high overflow-hidden shadow-sm">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-surface-container-lowest border-b border-surface-container-high">
                <tr>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant w-16 text-center">ID</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant w-1/3">Tên thể loại</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant w-1/2">Mô tả</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 text-center text-on-surface-variant">{category.id}</td>
                    <td className="px-6 py-4 font-medium text-ink-950">{category.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {category.description || <span className="italic text-outline-variant">Không có mô tả</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors focus-ring"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 rounded-lg text-error hover:bg-error-50 transition-colors focus-ring"
                          title="Xoá"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
