"use client";
import { ChangeEvent } from "react";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { UI_TEXT } from "@/constants/ui-text";

interface ProfileAvatarProps {
    avatarUrl?: string;
    isEditing?: boolean;
    canChangeAvatar?: boolean;
    onEdit?: () => void;
    onAvatarChange?: (file: File) => void;
    onRemove?: () => void;
}

export default function ProfileAvatar({ avatarUrl, isEditing = false, canChangeAvatar = isEditing, onEdit, onAvatarChange }: ProfileAvatarProps) {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            onAvatarChange?.(file);
            event.target.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
                <label className={`relative shrink-0 ${canChangeAvatar ? "cursor-pointer" : "cursor-default"}`}>
                    <Image
                        src={avatarUrl || "https://placehold.co/72x72"}
                        alt={UI_TEXT.PROFILE.AVATAR.IMG_ALT}
                        width={72}
                        height={72}
                        className="h-[72px] w-[72px] rounded-full border border-ink-200 object-cover dark:border-slate-800"
                    />

                    <input type="file" accept="image/jpeg,image/png,image/gif" disabled={!canChangeAvatar} onChange={handleFileChange} className="sr-only" />

                    <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-[10px] text-white">
                        <Pencil className="h-2.5 w-2.5" />
                    </span>
                </label>

                <div>
                    <h3 className="text-base font-semibold text-ink-950 dark:text-white">{UI_TEXT.PROFILE.AVATAR.HEADING}</h3>

                    <p className="text-sm text-ink-600 dark:text-slate-400">{UI_TEXT.PROFILE.AVATAR.SUBHEADING}</p>
                </div>
            </div>

            {!isEditing && (
                <button
                    type="button"
                    onClick={onEdit}
                    className="h-9 rounded bg-primary-700 px-4 text-sm font-semibold text-white transition hover:bg-primary-500 sm:self-start"
                >
                    {UI_TEXT.PROFILE.FORM.EDIT_BTN}
                </button>
            )}
        </div>
    );
}
