import { LoginBanner } from "@/components/features/auth/banner";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-slate-50">
      <LoginBanner />

      <section className="flex-1 flex items-center justify-center p-6 lg:ml-[50%]">
        <LoginForm />
      </section>
    </main>
  );
}
