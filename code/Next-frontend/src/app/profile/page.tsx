import ProfileForm from "@/components/features/settings/profile/ProfileForm";
import { UI_TEXT } from "@/constants/ui-text";

export default function ProfilePage() {
    return (
        <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{UI_TEXT.PROFILE.PAGE.HEADING}</h1>
            <p className="mb-6 text-gray-500">{UI_TEXT.PROFILE.PAGE.SUBHEADING}</p>

            <ProfileForm />
        </div>
    );
}
