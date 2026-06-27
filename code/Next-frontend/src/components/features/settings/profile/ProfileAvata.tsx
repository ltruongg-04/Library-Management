"use client";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { UI_TEXT } from "@/constants/ui-text";

interface ProfileAvatarProps {
    avatarUrl?: string;
    onUpload?: () => void;
    onRemove?: () => void;
}

export default function ProfileAvatar({ avatarUrl, onUpload }: ProfileAvatarProps) {
    return (
        <div className="flex items-start gap-4 pb-5">
            <div className="relative">
                <Image
                    src={avatarUrl || "https://placehold.co/72x72"}
                    alt={UI_TEXT.PROFILE.AVATAR.IMG_ALT}
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] rounded-full border border-ink-200 object-cover dark:border-slate-800"
                />

                <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-[10px] text-white">
                    <Pencil className="h-2.5 w-2.5" />
                </span>
            </div>

            <div>
                <h3 className="text-base font-semibold text-ink-950 dark:text-white">{UI_TEXT.PROFILE.AVATAR.HEADING}</h3>

                <p className="mb-3 text-sm text-ink-600 dark:text-slate-400">{UI_TEXT.PROFILE.AVATAR.SUBHEADING}</p>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onUpload}
                        className="rounded border border-ink-200 px-3 py-1.5 text-sm text-ink-950 transition hover:bg-ink-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                    >
                        {UI_TEXT.PROFILE.AVATAR.UPLOAD_BTN}
                    </button>
                </div>
            </div>
        </div>
    );
}
