import { LoginBanner } from "@/components/features/auth/banner";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-surface transition-colors duration-200">
      <LoginBanner />

      <section className="flex-1 flex items-center justify-center p-6 lg:ml-[50%]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
