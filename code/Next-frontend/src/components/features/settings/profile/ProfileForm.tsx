"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { BaseButton } from "@/components/base/base-button";
import { BaseInput } from "@/components/base/base-input";
import { BaseTextarea } from "@/components/base/base-textarea";
import { SuccessModal } from "@/components/base/success-modal";
import { UI_TEXT } from "@/constants/ui-text";
import { PROFILE_MOCK } from "@/constants/ui-text/public/profile";
import { useAuth } from "@/providers/auth";
import { DEFAULT_PROFILE_AVATAR_URL, PROFILE_UPDATED_EVENT, getProfileStorageKey, readStoredProfile } from "@/utils/profile-storage";
import ProfileAvatar from "./ProfileAvata";

type ProfileData = {
    avatarUrl: string;
    fullName: string;
    email: string;
    phone: string;
    bio: string;
};

type ProfileErrors = Partial<Record<keyof ProfileData, string>>;

const initialData: ProfileData = {
    avatarUrl: DEFAULT_PROFILE_AVATAR_URL,
    fullName: "",
    email: "",
    phone: "",
    bio: PROFILE_MOCK.BIO,
};

type AuthProfileUser = {
    id: string;
    email: string;
    fullName: string;
    phone?: string | null;
    image?: string;
    authProvider?: string;
};

function getProfileBaseData(user: AuthProfileUser | null): ProfileData {
    const baseData = {
        ...initialData,
        email: user?.email ?? "",
    };

    if (user?.authProvider !== "google") return baseData;

    return {
        ...baseData,
        avatarUrl: user.image || initialData.avatarUrl,
        fullName: user.fullName,
        phone: user.phone || "",
    };
}

export default function ProfileForm() {
    const { user } = useAuth();
    const [savedData, setSavedData] = useState<ProfileData>(initialData);
    const [formData, setFormData] = useState<ProfileData>(initialData);
    const [errors, setErrors] = useState<ProfileErrors>({});
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const isGoogleProfile = user?.authProvider === "google";
    const canEditIdentity = isEditing && !isGoogleProfile;
    const canEditEmail = false;
    const canEditPhone = isEditing;
    const canChangeAvatar = isEditing && !isGoogleProfile;

    useEffect(() => {
        const baseData = getProfileBaseData(user);
        const parsedProfile = readStoredProfile(user);

        if (!parsedProfile) {
            setSavedData(baseData);
            setFormData(baseData);
            setErrors({});
            setIsEditing(false);
            return;
        }

        const nextData = isGoogleProfile
            ? {
                  ...baseData,
                  phone: parsedProfile.phone ?? baseData.phone,
                  bio: parsedProfile.bio ?? baseData.bio,
              }
            : {
                  ...baseData,
                  ...parsedProfile,
                  email: baseData.email,
              };

        setSavedData(nextData);
        setFormData(nextData);
        setErrors({});
        setIsEditing(false);
    }, [isGoogleProfile, user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleAvatarChange = (file: File) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

        if (!allowedTypes.includes(file.type)) {
            setModalMessage(UI_TEXT.PROFILE.AVATAR.UPLOAD_TYPE_ERROR);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            return;
        }

        if (file.size > 800 * 1024) {
            setModalMessage(UI_TEXT.PROFILE.AVATAR.UPLOAD_SIZE_ERROR);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") return;

            setFormData((prev) => ({
                ...prev,
                avatarUrl: reader.result as string,
            }));
        };

        reader.readAsDataURL(file);
    };

    const validate = () => {
        const newErrors: ProfileErrors = {};

        if (!isGoogleProfile) {
            if (!formData.fullName.trim()) {
                newErrors.fullName = UI_TEXT.PROFILE.FORM.ERRORS.FULL_NAME_REQUIRED;
            }

            if (!user?.email?.trim()) {
                newErrors.email = UI_TEXT.PROFILE.FORM.ERRORS.EMAIL_REQUIRED;
            } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
                newErrors.email = UI_TEXT.PROFILE.FORM.ERRORS.EMAIL_INVALID;
            }

            if (!formData.phone.trim()) {
                newErrors.phone = UI_TEXT.PROFILE.FORM.ERRORS.PHONE_REQUIRED;
            }
        }

        if (formData.bio.length > 500) {
            newErrors.bio = UI_TEXT.PROFILE.FORM.ERRORS.BIO_MAX_LENGTH;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCancel = () => {
        setFormData(savedData);
        setErrors({});
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!validate()) return;

        const nextData = {
            ...formData,
            email: user?.email ?? "",
        };

        console.log("Đã lưu hồ sơ:", nextData);
        window.localStorage.setItem(getProfileStorageKey(user), JSON.stringify(nextData));
        window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
        setSavedData(nextData);
        setFormData(nextData);
        setIsEditing(false);
        setModalMessage(UI_TEXT.PROFILE.FORM.SUCCESS_MSG);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div>
            {/* Avatar */}
            <ProfileAvatar
                avatarUrl={formData.avatarUrl}
                isEditing={isEditing}
                canChangeAvatar={canChangeAvatar}
                onEdit={() => setIsEditing(true)}
                onAvatarChange={handleAvatarChange}
            />

            {/* Form fields */}
            <div className="mt-xl grid grid-cols-1 gap-x-8 gap-y-5 border-t border-ink-200 pt-xl dark:border-slate-800 md:grid-cols-2">
                <BaseInput
                    label={UI_TEXT.PROFILE.FORM.FULL_NAME_LABEL}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    placeholder={UI_TEXT.PROFILE.FORM.FULL_NAME_PLACEHOLDER}
                    disabled={!canEditIdentity}
                    className="h-10 !bg-gray-100 placeholder:text-ink-400 disabled:cursor-not-allowed disabled:text-ink-500 disabled:opacity-70 dark:border-slate-700 dark:!bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    labelClassName="dark:text-white"
                />

                <BaseInput
                    label={UI_TEXT.PROFILE.FORM.EMAIL_LABEL}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder={UI_TEXT.PROFILE.FORM.EMAIL_PLACEHOLDER}
                    disabled={!canEditEmail}
                    className="h-10 !bg-gray-100 placeholder:text-ink-400 disabled:cursor-not-allowed disabled:text-ink-500 disabled:opacity-70 dark:border-slate-700 dark:!bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    labelClassName="dark:text-white"
                />

                <BaseInput
                    label={UI_TEXT.PROFILE.FORM.PHONE_LABEL}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder={UI_TEXT.PROFILE.FORM.PHONE_PLACEHOLDER}
                    disabled={!canEditPhone}
                    className="h-10 !bg-gray-100 placeholder:text-ink-400 disabled:cursor-not-allowed disabled:text-ink-500 disabled:opacity-70 dark:border-slate-700 dark:!bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    labelClassName="dark:text-white"
                />
            </div>

            {/* Giới thiệu */}
            <div className="mt-xl border-t border-ink-200 pt-xl dark:border-slate-800">
                <BaseTextarea
                    label={UI_TEXT.PROFILE.FORM.BIO_LABEL}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    error={errors.bio}
                    maxLength={500}
                    placeholder={UI_TEXT.PROFILE.FORM.BIO_PLACEHOLDER}
                    disabled={!isEditing}
                    className="min-h-[110px] resize-none !bg-gray-100 placeholder:text-ink-400 disabled:cursor-not-allowed disabled:text-ink-500 disabled:opacity-70 dark:border-slate-700 dark:!bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                />

                <div className="mt-2 text-right text-xs text-ink-500 dark:text-slate-400">
                    {formData.bio.length}/500 {UI_TEXT.PROFILE.FORM.CHAR_COUNT_SUFFIX}
                </div>
            </div>

            {/* Actions */}
            {isEditing && (
                <div className="mt-xl flex flex-col justify-end gap-3 border-t border-ink-200 pt-xl dark:border-slate-800 sm:flex-row">
                    <BaseButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="h-12 w-full rounded-lg px-6 text-body-md font-semibold sm:w-[220px]"
                    >
                        {UI_TEXT.PROFILE.FORM.CANCEL_BTN}
                    </BaseButton>

                    <BaseButton
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                        className="h-12 w-full rounded-lg bg-primary-700 px-6 text-body-md font-semibold hover:bg-primary-500 sm:w-[220px]"
                    >
                        {UI_TEXT.PROFILE.FORM.SAVE_BTN}
                    </BaseButton>
                </div>
            )}

            <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={modalMessage} />
        </div>
    );
}
