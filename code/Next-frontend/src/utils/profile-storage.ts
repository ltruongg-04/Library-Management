export type StoredProfileData = {
    avatarUrl?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    bio?: string;
};

export type ProfileStorageUser = {
    id?: string;
    authProvider?: string;
} | null;

export const PROFILE_STORAGE_KEY = "library-management-profile";
export const PROFILE_UPDATED_EVENT = "library-management-profile-updated";
export const DEFAULT_PROFILE_AVATAR_URL = "https://placehold.co/80x80";

export function getProfileStorageKey(user: ProfileStorageUser) {
    if (!user?.id) return PROFILE_STORAGE_KEY;

    return `${PROFILE_STORAGE_KEY}:${user.authProvider ?? "credentials"}:${user.id}`;
}

export function readStoredProfile(user: ProfileStorageUser) {
    const storageKey = getProfileStorageKey(user);
    const savedProfile = window.localStorage.getItem(storageKey);

    if (!savedProfile) return null;

    try {
        return (JSON.parse(savedProfile) as StoredProfileData | null) ?? null;
    } catch {
        window.localStorage.removeItem(storageKey);
        return null;
    }
}
