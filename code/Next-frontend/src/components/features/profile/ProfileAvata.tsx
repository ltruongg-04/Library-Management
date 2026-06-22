"use client";

interface ProfileAvatarProps {
  avatarUrl?: string;
  onUpload?: () => void;
  onRemove?: () => void;
}

export default function ProfileAvatar({
  avatarUrl,
  onUpload,
  onRemove,
}: ProfileAvatarProps) {
  return (
    <div className="flex items-start gap-4 pb-5">
      <div className="relative">
        <img
          src={avatarUrl || "https://placehold.co/72x72"}
          alt="Profile avatar"
          className="h-[72px] w-[72px] rounded-full object-cover border border-border-default"
        />

        <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-[10px] text-white">
          ✎
        </span>
      </div>

      <div>
        <h3 className="text-base font-semibold text-content-primary">
          Profile Picture
        </h3>

        <p className="mb-3 text-sm text-content-secondary">
          JPG, GIF or PNG. Max size of 800K.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onUpload}
            className="rounded border border-border-default px-3 py-1.5 text-sm text-content-primary transition hover:bg-surface-high"
          >
            Upload New
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-error-500 transition hover:text-error-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}