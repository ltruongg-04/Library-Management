"use client";

import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, User as UserIcon, X } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import { BorrowRecord } from "./BorrowTable";

const T = UI_TEXT.ADMIN_BORROW_MANAGEMENT.MODAL;

export default function BorrowModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (record: Partial<BorrowRecord>) => void }) {
    const [form, setForm] = useState({
        memberCode: "",
        bookTitle: "",
        dueDate: "",
    });

    useEffect(() => {
        if (open) {
            setForm({ memberCode: "", bookTitle: "", dueDate: "" });
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = () => {
        onSubmit({
            member: {
                name: "Người dùng mới",
                code: form.memberCode || "#MB-9999",
                avatarInitials: "NN",
                avatarColor: "primary",
            },
            book: {
                title: form.bookTitle || "Sách mới mượn",
                author: "Tác giả ẩn danh",
            },
            dueDate: form.dueDate || "30/10/2024",
            borrowDate: "20/10/2024",
            status: "pending",
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 px-4 backdrop-blur-sm">
            <div className="level-2-shadow flex w-full max-w-lg transform flex-col overflow-hidden rounded-2xl bg-surface-container-lowest transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-bright p-lg">
                    <h3 className="font-headline-lg text-headline-lg-mobile text-on-background">{T.CREATE_TITLE}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-error-container/20 hover:text-error"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex flex-col gap-md p-lg">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-body-sm text-body-sm font-medium text-on-surface">{T.LABEL_MEMBER_CODE}</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 font-body-md text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={T.PLACEHOLDER_MEMBER_CODE}
                                value={form.memberCode}
                                onChange={(e) => setForm({ ...form, memberCode: e.target.value })}
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-body-sm text-body-sm font-medium text-on-surface">{T.LABEL_BOOK_TITLE}</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 font-body-md text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={T.PLACEHOLDER_BOOK_TITLE}
                                value={form.bookTitle}
                                onChange={(e) => setForm({ ...form, bookTitle: e.target.value })}
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-body-sm text-body-sm font-medium text-on-surface">{T.LABEL_DUE_DATE}</label>
                        <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2.5 pl-10 pr-4 font-body-md text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={T.PLACEHOLDER_DUE_DATE}
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                type="text"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-auto flex justify-end gap-3 border-t border-outline-variant/30 bg-surface-bright p-lg">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-outline px-5 py-2.5 font-title-md text-sm text-title-md text-on-surface transition-colors hover:bg-surface-variant"
                    >
                        {T.BTN_CANCEL}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-primary px-5 py-2.5 font-title-md text-sm text-title-md text-on-primary shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container"
                    >
                        {T.BTN_CREATE}
                    </button>
                </div>
            </div>
        </div>
    );
}
