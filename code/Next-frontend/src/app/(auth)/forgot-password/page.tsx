import { LoginBanner } from "@/components/features/auth/banner";
import { ForgotPasswordForm } from "@/components/features/auth/forgot-password-form";

export default function ForgotPasswordPage() {
    return (
        <main className="flex min-h-screen bg-surface transition-colors duration-200">
            <LoginBanner />

            <section className="flex flex-1 items-center justify-center p-6 lg:ml-[50%]">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                    <ForgotPasswordForm />
                </div>
            </section>
        </main>
    );
}
