"use client";

import { ChangeEvent, useState } from "react";
import { BaseButton } from "@/components/base/base-button";
import { BaseInput } from "@/components/base/base-input";
import { BaseTextarea } from "@/components/base/base-textarea";
import ProfileAvatar from "./ProfileAvata";

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
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (formData.bio.length > 500) {
      newErrors.bio = "Bio must be 500 characters or fewer.";
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
    alert("Profile updated successfully!");
  };

  return (
    <div className="rounded-xl border border-border-default bg-white px-6 py-5 shadow-sm">
      {/* Avatar */}
      <ProfileAvatar
        avatarUrl="https://placehold.co/80x80"
        onUpload={() => alert("Upload avatar")}
        onRemove={() => alert("Remove avatar")}
      />

      {/* Form fields */}
      <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-border-default pt-5 md:grid-cols-2">
        <BaseInput
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="Enter your full name"
          className="h-10 !bg-gray-100"
        />

        <BaseInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          className="h-10 !bg-gray-100"
        />

        <BaseInput
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="Enter your phone number"
          className="h-10 !bg-gray-100"
        />
      </div>

      {/* Bio */}
      <div className="mt-5 border-t border-border-default pt-5">
        <BaseTextarea
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          error={errors.bio}
          maxLength={500}
          placeholder="Tell us a little about yourself"
          className="min-h-[110px] resize-none !bg-gray-100"
        />

        <div className="mt-2 text-right text-xs text-content-outline">
          {formData.bio.length}/500 characters
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex justify-end gap-3 border-t border-border-default pt-5">
        <BaseButton
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="w-auto min-w-[90px]"
        >
          Cancel
        </BaseButton>

        <BaseButton
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSave}
          className="w-auto min-w-[90px]"
        >
          Save
        </BaseButton>
      </div>
    </div>
  );
}