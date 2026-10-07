import LibraryCard from "@/components/features/settings/profile/LibraryCard";
import ProfileForm from "@/components/features/settings/profile/ProfileForm";
import { UI_TEXT } from "@/constants/ui-text";

export default function ProfilePage() {
    return (
        <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{UI_TEXT.PROFILE.PAGE.HEADING}</h1>
            <p className="mb-6 text-gray-500 dark:text-slate-400">{UI_TEXT.PROFILE.PAGE.SUBHEADING}</p>

            <ProfileForm />
            <LibraryCard />
        </div>
    );
}
