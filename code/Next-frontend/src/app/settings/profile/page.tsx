import { UI_TEXT } from "@/constants/ui-text";
import ProfileForm from "@/components/features/settings/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="w-full max-w-4xl rounded-2xl border border-ink-200 bg-white p-xl shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-xl border-b border-ink-200 pb-xl dark:border-slate-800">
        <h1 className="mb-2 text-3xl font-bold text-ink-950 dark:text-white">
          {UI_TEXT.PROFILE.PAGE.HEADING}
        </h1>
        <p className="font-body-md text-body-md text-ink-600 dark:text-slate-400 max-w-2xl">
          {UI_TEXT.PROFILE.PAGE.SUBHEADING}
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
