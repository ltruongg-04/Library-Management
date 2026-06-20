import { LoginBanner } from "@/components/features/auth/login-banner";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <LoginBanner />

      <section className="flex flex-1 items-center justify-center p-8">
        <LoginForm />
      </section>
    </main>
  );
}
