"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, LayoutDashboard, Pencil, Plus, Trash2, XCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import { AdminBanner, createAdminBanner, deleteAdminBanner, getAdminBanners, updateAdminBanner } from "@/services/adminBanner";

export default function BannerManagement() {
    const [banners, setBanners] = useState<AdminBanner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
        displayOrder: 0,
        isActive: true,
    });

    const fetchBanners = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAdminBanners();
            if (res.success && res.data) {
                setBanners(res.data);
            } else {
                toast.error(res.message || UI_TEXT.RECENT.TEXT_34);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_33);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const handleOpenModal = (banner?: AdminBanner) => {
        if (banner) {
            setEditingBanner(banner);
            setForm({
                title: banner.title,
                description: banner.description || "",
                imageUrl: banner.imageUrl,
                linkUrl: banner.linkUrl || "",
                displayOrder: banner.displayOrder,
                isActive: banner.isActive,
            });
        } else {
            setEditingBanner(null);
            setForm({
                title: "",
                description: "",
                imageUrl: "",
                linkUrl: "",
                displayOrder: 0,
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBanner) {
                const res = await updateAdminBanner(editingBanner.id, form);
                if (res.success) {
                    toast.success(UI_TEXT.RECENT.TEXT_32);
                    fetchBanners();
                    handleCloseModal();
                } else {
                    toast.error(res.message);
                }
            } else {
                const res = await createAdminBanner(form);
                if (res.success) {
                    toast.success(UI_TEXT.RECENT.TEXT_31);
                    fetchBanners();
                    handleCloseModal();
                } else {
                    toast.error(res.message);
                }
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_30);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(UI_TEXT.RECENT.TEXT_29)) return;
        try {
            const res = await deleteAdminBanner(id);
            if (res.success) {
                toast.success(UI_TEXT.RECENT.TEXT_28);
                fetchBanners();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_27);
        }
    };

    return (
        <div className="flex h-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">{UI_TEXT.RECENT.TEXT_26}</h1>
                    <p className="text-sm text-on-surface-variant">{UI_TEXT.RECENT.TEXT_25}</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:bg-primary/90"
                >
                    <Plus size={18} />
                    {UI_TEXT.RECENT.TEXT_24}
                </button>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="flex flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="relative h-48 bg-surface-variant dark:bg-slate-800">
                                <Image src={banner.imageUrl} alt={banner.title || "Banner"} fill className="object-cover" unoptimized />
                                <div className="absolute right-2 top-2 z-10 flex gap-1 rounded bg-black/50 p-1 backdrop-blur">
                                    <button onClick={() => handleOpenModal(banner)} className="p-1 text-white hover:text-primary">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(banner.id)} className="p-1 text-white hover:text-error">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute left-2 top-2 z-10 rounded bg-black/50 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
                                    {UI_TEXT.RECENT.TEXT_23}
                                    {banner.displayOrder}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="line-clamp-1 font-semibold text-on-surface dark:text-white">{banner.title}</h3>
                                    {banner.isActive ? (
                                        <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                                    ) : (
                                        <XCircle size={18} className="flex-shrink-0 text-error" />
                                    )}
                                </div>
                                <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant dark:text-slate-400">
                                    {banner.description || UI_TEXT.RECENT.TEXT_22}
                                </p>
                            </div>
                        </div>
                    ))}
                    {banners.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant p-12 text-on-surface-variant dark:border-slate-800 dark:text-slate-400">
                            <LayoutDashboard size={48} className="mb-4 opacity-50" />
                            <p>{UI_TEXT.RECENT.TEXT_21}</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl dark:border dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-6 text-xl font-bold text-on-surface dark:text-white">
                            {editingBanner ? UI_TEXT.RECENT.TEXT_20 : UI_TEXT.RECENT.TEXT_19}
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_18}</label>
                                <input
                                    required
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_17}</label>
                                <input
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_16}</label>
                                <input
                                    required
                                    type="url"
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    value={form.imageUrl}
                                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_15}</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={form.displayOrder}
                                        onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                                            checked={form.isActive}
                                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_14}</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="rounded-lg px-4 py-2 text-on-surface hover:bg-surface-variant dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    {UI_TEXT.RECENT.TEXT_13}
                                </button>
                                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
                                    {UI_TEXT.RECENT.TEXT_12}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
