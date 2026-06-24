import ProfileForm from "@/components/features/settings/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Info</h1>
      <p className="text-gray-500 mb-6">
        Update your personal details and how we can reach you.
      </p>

      <ProfileForm />
    </div>
  );
}