"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { ADMIN_AUTHOR_MANAGEMENT } from "@/constants/ui-text/admin";
import { authorService } from "@/services/author";
import type { Author, AuthorRequest } from "@/types/author";

interface AuthorModalProps {
    author: Author | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AuthorModal({ author, isOpen, onClose, onSuccess }: AuthorModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const textUI = ADMIN_AUTHOR_MANAGEMENT.MODAL;

    useEffect(() => {
        if (isOpen) {
            if (author) {
                setName(author.name);
                setDescription(author.biography || "");
            } else {
                setName("");
                setDescription("");
            }
            setError(null);
        }
    }, [isOpen, author]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);

            const requestData: AuthorRequest = {
                name,
                biography: description,
            };

            if (author?.id) {
                await authorService.updateAuthor(author.id, requestData);
            } else {
                await authorService.createAuthor(requestData);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Lỗi khi lưu tác giả");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
            <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex shrink-0 items-center justify-between border-b border-surface-container-high px-6 py-4">
                    <h2 className="text-[18px] font-semibold text-ink-950">{author ? textUI.TITLE_EDIT : textUI.TITLE_ADD}</h2>
                    <button onClick={onClose} className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="rounded-lg bg-error-50 p-3 text-[14px] text-error">{error}</div>}

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-on-surface-variant">{textUI.LABEL_NAME}</label>
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
                            <label className="text-[13px] font-medium text-on-surface-variant">{textUI.LABEL_BIO}</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả ngắn gọn về tiểu sử tác giả này..."
                                rows={3}
                                className="w-full resize-none rounded-lg border border-surface-container-high px-3 py-2 text-[14px] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-surface-container-high pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg px-4 py-2.5 text-[14px] font-medium text-on-surface-variant transition-colors hover:bg-surface"
                            >
                                {textUI.BTN_CANCEL}
                            </button>
                            <button
                                type="submit"
                                disabled={saving || !name.trim()}
                                className="focus-ring flex items-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-70"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {textUI.BTN_SAVE}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
