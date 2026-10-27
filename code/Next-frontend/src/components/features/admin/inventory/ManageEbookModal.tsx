"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, FileText, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import { type AdminMembershipTier, getAdminMembershipTiers } from "@/services/adminMembershipTier";
import { ebookService } from "@/services/ebook";
import type { EbookInfo } from "@/types/ebook";

interface ManageEbookModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookId: number;
    bookTitle: string;
    onSuccess?: () => void;
}

const textUI = UI_TEXT.EBOOK_READER.ADMIN_MODAL;

export default function ManageEbookModal({ isOpen, onClose, bookId, bookTitle, onSuccess }: ManageEbookModalProps) {
    const [ebook, setEbook] = useState<EbookInfo | null>(null);
    const [tiers, setTiers] = useState<AdminMembershipTier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewPages, setPreviewPages] = useState<number>(5);
    const [isFree, setIsFree] = useState<boolean>(false);
    const [minTierId, setMinTierId] = useState<number | "none">("none");
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch tiers
                const tiersRes = await getAdminMembershipTiers();
                if (tiersRes.success && tiersRes.data && isMounted) {
                    setTiers(tiersRes.data);
                }

                // Fetch ebook info
                try {
                    const ebookInfo = await ebookService.getEbookInfo(bookId);
                    if (isMounted && ebookInfo) {
                        setEbook(ebookInfo);
                        setPreviewPages(ebookInfo.previewPages);
                        setIsFree(ebookInfo.isFree);
                        setMinTierId(ebookInfo.minMembershipTierId ?? "none");
                        setIsActive(ebookInfo.isActive);
                    }
                } catch {
                    if (isMounted) {
                        setEbook(null);
                        setPreviewPages(5);
                        setIsFree(false);
                        setMinTierId("none");
                        setIsActive(true);
                    }
                }
            } catch (err) {
                console.error("Fetch data error:", err);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [isOpen, bookId]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.name.toLowerCase().endsWith(".pdf")) {
                toast.error(textUI.ERR_NOT_PDF);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUploadOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (selectedFile) {
                // Upload new file
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("previewPages", String(previewPages));
                formData.append("isFree", String(isFree));
                if (minTierId !== "none") {
                    formData.append("minMembershipTierId", String(minTierId));
                }

                const result = await ebookService.uploadEbook(bookId, formData);
                setEbook(result);
                setSelectedFile(null);
                toast.success(textUI.UPLOAD_SUCCESS);
                onSuccess?.();
            } else if (ebook) {
                // Update settings
                const updated = await ebookService.updateEbook(bookId, {
                    previewPages,
                    isFree,
                    minMembershipTierId: minTierId === "none" ? null : minTierId,
                    isActive,
                });
                setEbook(updated);
                toast.success(textUI.UPDATE_SUCCESS);
                onSuccess?.();
            } else {
                toast.error(textUI.ERR_NO_FILE);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || textUI.GENERIC_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEbook = async () => {
        if (!confirm(textUI.DELETE_CONFIRM)) return;

        setIsDeleting(true);
        try {
            await ebookService.deleteEbook(bookId);
            setEbook(null);
            setSelectedFile(null);
            toast.success(textUI.DELETE_SUCCESS);
            onSuccess?.();
        } catch (err: any) {
            toast.error(err.response?.data?.message || textUI.DELETE_ERROR);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <h2 className="text-[18px] font-bold text-slate-900 dark:text-white">{textUI.TITLE}</h2>
                        </div>
                        <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                            {textUI.BOOK_LABEL} <span className="font-semibold text-slate-800 dark:text-slate-200">{bookTitle}</span>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <form onSubmit={handleUploadOrUpdate} className="mt-4 space-y-4">
                        {/* Current Status Banner */}
                        {ebook ? (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        <div>
                                            <p className="text-[14px] font-semibold text-emerald-950 dark:text-emerald-200">{textUI.STATUS_ACTIVE_TITLE}</p>
                                            <p className="text-[12px] text-emerald-700 dark:text-emerald-400">
                                                {`${ebook.fileName} • ${ebook.totalPages} tr. • ${(ebook.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <a
                                            href={`/sach/${bookId}/doc`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="shadow-xs flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-emerald-800 hover:bg-emerald-50 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-slate-700"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            {textUI.PREVIEW_BTN}
                                        </a>

                                        <button
                                            type="button"
                                            onClick={handleDeleteEbook}
                                            disabled={isDeleting}
                                            className="flex items-center gap-1 rounded-md bg-red-100 px-2.5 py-1 text-[12px] font-medium text-red-700 hover:bg-red-200 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            {textUI.DELETE_BTN}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
                                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-[13px]">{textUI.STATUS_EMPTY_DESC}</p>
                                </div>
                            </div>
                        )}

                        {/* File Upload Drop Area */}
                        <div>
                            <label className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                {ebook ? textUI.FILE_REPLACE : textUI.FILE_SELECT_NEW}
                            </label>
                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-5 transition hover:border-primary-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50">
                                <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
                                <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                                    {selectedFile ? selectedFile.name : textUI.DROP_PLACEHOLDER}
                                </span>
                                <span className="mt-1 text-[11px] text-slate-400">
                                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : textUI.FILE_HINT}
                                </span>
                                <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>

                        {/* Settings Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Preview pages limit */}
                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-slate-700 dark:text-slate-300">{textUI.PREVIEW_LABEL}</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={previewPages}
                                    onChange={(e) => setPreviewPages(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <p className="mt-1 text-[11px] text-slate-500">{textUI.PREVIEW_HINT}</p>
                            </div>

                            {/* Required membership tier */}
                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-slate-700 dark:text-slate-300">{textUI.TIER_LABEL}</label>
                                <select
                                    disabled={isFree}
                                    value={minTierId}
                                    onChange={(e) => setMinTierId(e.target.value === "none" ? "none" : Number(e.target.value))}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:border-primary focus:outline-none disabled:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800"
                                >
                                    <option value="none">{textUI.TIER_OPTION_NONE}</option>
                                    {tiers.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {`${textUI.TIER_OPTION_PREFIX} ${t.name} (${t.minPoints} ${textUI.TIER_OPTION_POINTS})`}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-[11px] text-slate-500">{textUI.TIER_HINT}</p>
                            </div>
                        </div>

                        {/* Checkbox Options */}
                        <div className="space-y-2 pt-1">
                            <label className="flex cursor-pointer items-center gap-2.5">
                                <input
                                    type="checkbox"
                                    checked={isFree}
                                    onChange={(e) => setIsFree(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <span className="text-[13px] font-medium text-slate-800 dark:text-slate-200">{textUI.CHECKBOX_FREE}</span>
                            </label>

                            {ebook && (
                                <label className="flex cursor-pointer items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-[13px] font-medium text-slate-800 dark:text-slate-200">{textUI.CHECKBOX_ACTIVE}</span>
                                </label>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                {textUI.BTN_CANCEL}
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting || (!selectedFile && !ebook)}
                                className="shadow-xs hover:bg-primary-600 flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2 text-[13px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500"
                            >
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {selectedFile ? textUI.BTN_SAVE_UPLOAD : textUI.BTN_SAVE_CONFIG}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
