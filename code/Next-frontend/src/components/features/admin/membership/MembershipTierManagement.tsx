"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Shield, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import {
    AdminMembershipTier,
    createAdminMembershipTier,
    deleteAdminMembershipTier,
    getAdminMembershipTiers,
    updateAdminMembershipTier,
} from "@/services/adminMembershipTier";

export default function MembershipTierManagement() {
    const [tiers, setTiers] = useState<AdminMembershipTier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTier, setEditingTier] = useState<AdminMembershipTier | null>(null);

    const [form, setForm] = useState({
        name: "",
        minPoints: 0,
        discountPercent: 0,
        maxBorrowDays: 14,
        maxBorrowBooks: 5,
    });

    useEffect(() => {
        fetchTiers();
    }, []);

    const fetchTiers = async () => {
        setIsLoading(true);
        try {
            const res = await getAdminMembershipTiers();
            if (res.success && res.data) {
                // Sắp xếp theo điểm tăng dần
                setTiers(res.data.sort((a, b) => a.minPoints - b.minPoints));
            } else {
                toast.error(res.message || UI_TEXT.RECENT.TEXT_126);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_125);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (tier?: AdminMembershipTier) => {
        if (tier) {
            setEditingTier(tier);
            setForm({
                name: tier.name,
                minPoints: tier.minPoints,
                discountPercent: tier.discountPercent,
                maxBorrowDays: tier.maxBorrowDays,
                maxBorrowBooks: tier.maxBorrowBooks,
            });
        } else {
            setEditingTier(null);
            setForm({
                name: "",
                minPoints: 0,
                discountPercent: 0,
                maxBorrowDays: 14,
                maxBorrowBooks: 5,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTier(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTier) {
                const res = await updateAdminMembershipTier(editingTier.id, form);
                if (res.success) {
                    toast.success(UI_TEXT.RECENT.TEXT_124);
                    fetchTiers();
                    handleCloseModal();
                } else {
                    toast.error(res.message);
                }
            } else {
                const res = await createAdminMembershipTier(form);
                if (res.success) {
                    toast.success(UI_TEXT.RECENT.TEXT_123);
                    fetchTiers();
                    handleCloseModal();
                } else {
                    toast.error(res.message);
                }
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_122);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(UI_TEXT.RECENT.TEXT_121)) return;
        try {
            const res = await deleteAdminMembershipTier(id);
            if (res.success) {
                toast.success(UI_TEXT.RECENT.TEXT_120);
                fetchTiers();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_119);
        }
    };

    return (
        <div className="flex h-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">{UI_TEXT.RECENT.TEXT_118}</h1>
                    <p className="text-sm text-on-surface-variant">{UI_TEXT.RECENT.TEXT_117}</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:bg-primary/90"
                >
                    <Plus size={18} />
                    {UI_TEXT.RECENT.TEXT_116}
                </button>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="absolute right-3 top-3 flex gap-2">
                                <button onClick={() => handleOpenModal(tier)} className="text-on-surface-variant hover:text-primary dark:text-slate-400">
                                    <Pencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(tier.id)} className="text-on-surface-variant hover:text-error dark:text-slate-400">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="bg-primary/10 p-5 text-center dark:bg-primary/20">
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg">
                                    <Shield size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-on-surface dark:text-white">{tier.name}</h3>
                                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary dark:bg-slate-800 dark:text-primary">
                                    <Users size={14} /> {UI_TEXT.RECENT.TEXT_115}
                                    {tier.minPoints}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 p-5 text-sm">
                                <div className="flex justify-between border-b border-outline-variant/20 pb-2 dark:border-slate-800">
                                    <span className="text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_114}</span>
                                    <span className="text-success font-semibold">{tier.discountPercent}%</span>
                                </div>
                                <div className="flex justify-between border-b border-outline-variant/20 pb-2 dark:border-slate-800">
                                    <span className="text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_113}</span>
                                    <span className="font-semibold text-on-surface dark:text-white">
                                        {tier.maxBorrowBooks} {UI_TEXT.RECENT.TEXT_112}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_111}</span>
                                    <span className="font-semibold text-on-surface dark:text-white">
                                        {tier.maxBorrowDays} {UI_TEXT.RECENT.TEXT_110}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tiers.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant p-12 text-on-surface-variant dark:border-slate-800 dark:text-slate-400">
                            <Shield size={48} className="mb-4 opacity-50" />
                            <p>{UI_TEXT.RECENT.TEXT_109}</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl dark:border dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-6 text-xl font-bold text-on-surface dark:text-white">
                            {editingTier ? UI_TEXT.RECENT.TEXT_108 : UI_TEXT.RECENT.TEXT_107}
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_106}</label>
                                <input
                                    required
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_105}</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={form.minPoints}
                                        onChange={(e) => setForm({ ...form, minPoints: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_104}</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={form.discountPercent}
                                        onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_103}</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={form.maxBorrowDays}
                                        onChange={(e) => setForm({ ...form, maxBorrowDays: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-on-surface dark:text-slate-200">{UI_TEXT.RECENT.TEXT_102}</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        value={form.maxBorrowBooks}
                                        onChange={(e) => setForm({ ...form, maxBorrowBooks: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-outline-variant/30 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-variant dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    {UI_TEXT.RECENT.TEXT_101}
                                </button>
                                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                                    {UI_TEXT.RECENT.TEXT_100}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
