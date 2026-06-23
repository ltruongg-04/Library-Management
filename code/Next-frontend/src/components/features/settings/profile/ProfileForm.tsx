"use client";

import { ChangeEvent, useState } from "react";
import { BaseButton } from "@/components/base/base-button";
import { BaseInput } from "@/components/base/base-input";
import { BaseTextarea } from "@/components/base/base-textarea";
import { SuccessModal } from "@/components/base/success-modal";
import ProfileAvatar from "./ProfileAvata";
import { UI_TEXT } from "@/constants/ui-text";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
};

type ProfileErrors = Partial<Record<keyof ProfileData, string>>;

const initialData: ProfileData = {
  fullName: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 123-4567",
  bio: "Avid reader, aspiring author, and technology enthusiast. Usually found in the science fiction section or attending a local book club.",
};

export default function ProfileForm() {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const validate = () => {
    const newErrors: ProfileErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = UI_TEXT.PROFILE.FORM.ERRORS.FULL_NAME_REQUIRED;
    }

    if (!formData.email.trim()) {
      newErrors.email = UI_TEXT.PROFILE.FORM.ERRORS.EMAIL_REQUIRED;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = UI_TEXT.PROFILE.FORM.ERRORS.EMAIL_INVALID;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = UI_TEXT.PROFILE.FORM.ERRORS.PHONE_REQUIRED;
    }

    if (formData.bio.length > 500) {
      newErrors.bio = UI_TEXT.PROFILE.FORM.ERRORS.BIO_MAX_LENGTH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setFormData(initialData);
    setErrors({});
  };

  const handleSave = () => {
    if (!validate()) return;

    console.log("Saved profile:", formData);
    setModalMessage(UI_TEXT.PROFILE.FORM.SUCCESS_MSG);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleUpload = () => {
    setModalMessage(UI_TEXT.PROFILE.AVATAR.UPLOAD_ALERT);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="rounded-xl border border-ink-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5 shadow-sm">
      {/* Avatar */}
      <ProfileAvatar
        avatarUrl="https://placehold.co/80x80"
        onUpload={handleUpload}
      />

      {/* Form fields */}
      <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-ink-200 dark:border-slate-800 pt-5 md:grid-cols-2">
        <BaseInput
          label={UI_TEXT.PROFILE.FORM.FULL_NAME_LABEL}
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder={UI_TEXT.PROFILE.FORM.FULL_NAME_PLACEHOLDER}
          className="h-10 !bg-gray-100 dark:!bg-slate-800 dark:text-white dark:border-slate-700"
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
          className="h-10 !bg-gray-100 dark:!bg-slate-800 dark:text-white dark:border-slate-700"
          labelClassName="dark:text-white"
        />

        <BaseInput
          label={UI_TEXT.PROFILE.FORM.PHONE_LABEL}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder={UI_TEXT.PROFILE.FORM.PHONE_PLACEHOLDER}
          className="h-10 !bg-gray-100 dark:!bg-slate-800 dark:text-white dark:border-slate-700"
          labelClassName="dark:text-white"
        />
      </div>

      {/* Bio */}
      <div className="mt-5 border-t border-ink-200 dark:border-slate-800 pt-5">
        <BaseTextarea
          label={UI_TEXT.PROFILE.FORM.BIO_LABEL}
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          error={errors.bio}
          maxLength={500}
          placeholder={UI_TEXT.PROFILE.FORM.BIO_PLACEHOLDER}
          className="min-h-[110px] resize-none !bg-gray-100 dark:!bg-slate-800 dark:text-white dark:border-slate-700"
        />

        <div className="mt-2 text-right text-xs text-ink-500 dark:text-slate-400">
          {formData.bio.length}/500 {UI_TEXT.PROFILE.FORM.CHAR_COUNT_SUFFIX}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex justify-end gap-3 border-t border-ink-200 dark:border-slate-800 pt-5">
        <BaseButton
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="w-auto min-w-[90px]"
        >
          {UI_TEXT.PROFILE.FORM.CANCEL_BTN}
        </BaseButton>

        <BaseButton
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSave}
          className="w-auto min-w-[90px]"
        >
          {UI_TEXT.PROFILE.FORM.SAVE_BTN}
        </BaseButton>
      </div>
      
      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={modalMessage}
      />
    </div>
  );
}