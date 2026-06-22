import { UI_TEXT } from "@/constants/ui-text";
import ProfileForm from "@/components/features/settings/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink-950 dark:text-white mb-2">{UI_TEXT.PROFILE.PAGE.HEADING}</h1>
      <p className="text-ink-600 dark:text-slate-300 mb-6">
        {UI_TEXT.PROFILE.PAGE.SUBHEADING}
      </p>

      <ProfileForm />
    </div>
  );
}