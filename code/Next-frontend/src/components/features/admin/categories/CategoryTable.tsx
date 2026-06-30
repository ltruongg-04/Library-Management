"use client";

import { useCallback, useEffect, useState } from "react";
import { Edit2, Loader2, Plus, Tags, Trash2 } from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ADMIN_CATEGORY_MANAGEMENT } from "@/constants/ui-text/admin";
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
        const startTime = Date.now();
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (err: any) {
            const elapsed = Date.now() - startTime;
            if (elapsed < 5000) {
                await new Promise((resolve) => setTimeout(resolve, 5000 - elapsed));
            }
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

    const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const textUI = ADMIN_CATEGORY_MANAGEMENT;
    const deleteUI = textUI.MODAL;

    const handleDeleteClick = (id: number) => {
        setDeleteCategoryId(id);
    };

    const confirmDelete = async () => {
        if (deleteCategoryId === null) return;

        try {
            setIsDeleting(true);
            await categoryService.deleteCategory(deleteCategoryId);
            fetchCategories();
            setDeleteCategoryId(null);
        } catch (err: any) {
            alert(err.message || "Lỗi khi xoá thể loại");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex h-full flex-col bg-surface">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-container-high bg-white px-8 py-6">
                <div>
                    <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">
                        <Tags size={24} className="text-primary-600" />
                        {textUI.HEADER.TITLE}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant">{textUI.HEADER.DESCRIPTION}</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="focus-ring flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-500"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    {textUI.HEADER.CREATE_BTN}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="overflow-hidden rounded-xl border border-surface-container-high bg-white shadow-sm">
                    <table className="w-full text-left text-[14px]">
                        <thead className="border-b border-surface-container-high bg-surface-container-lowest">
                            <tr>
                                <th className="w-16 px-6 py-4 text-center font-semibold text-on-surface-variant">STT</th>
                                <th className="w-1/3 px-6 py-4 font-semibold text-on-surface-variant">{textUI.TABLE.COL_NAME}</th>
                                <th className="w-1/2 px-6 py-4 font-semibold text-on-surface-variant">{textUI.TABLE.COL_DESC}</th>
                                <th className="px-6 py-4 text-right font-semibold text-on-surface-variant">{textUI.TABLE.COL_ACTIONS}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high">
                            {loading ? (
                                <TableSkeleton columns={4} rows={5} />
                            ) : error ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-error">
                                        <p>{error}</p>
                                        <button onClick={fetchCategories} className="text-primary-600 mt-2 hover:underline">
                                            {textUI.TABLE.BTN_RETRY}
                                        </button>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-outline">
                                        <Tags size={48} className="mx-auto mb-3 text-surface-container-highest" />
                                        <p>{textUI.TABLE.EMPTY_STATE}</p>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category, index) => (
                                    <tr key={category.id} className="transition-colors hover:bg-surface-container-lowest/50">
                                        <td className="px-6 py-4 text-center text-on-surface-variant">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-ink-950">{category.name}</td>
                                        <td className="px-6 py-4 text-on-surface-variant">
                                            {category.description || <span className="italic text-outline-variant">{textUI.TABLE.NO_DESC}</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-primary-600 focus-ring rounded-lg p-2 transition-colors hover:bg-primary-50"
                                                    title="Sửa"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(category.id)}
                                                    className="focus-ring rounded-lg p-2 text-error transition-colors hover:bg-error-50"
                                                    title="Xoá"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category={editingCategory} onSuccess={fetchCategories} />

            {/* Delete Confirmation Modal */}
            {deleteCategoryId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="p-6">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-50 text-error">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-center text-lg font-semibold text-ink-950">{deleteUI.DELETE_TITLE}</h3>
                            <p className="mt-2 text-center text-sm text-on-surface-variant">{deleteUI.DELETE_DESC}</p>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-surface-container-high bg-surface-container-lowest px-6 py-4">
                            <button
                                onClick={() => setDeleteCategoryId(null)}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high"
                                disabled={isDeleting}
                            >
                                {deleteUI.DELETE_BTN_CANCEL}
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex w-[130px] items-center justify-center gap-2 rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-error-600"
                                disabled={isDeleting}
                            >
                                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Xóa thể loại"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
