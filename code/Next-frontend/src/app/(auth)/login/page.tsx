import { Suspense } from "react";
import { LoginBanner } from "@/components/features/auth/banner";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen bg-surface transition-colors duration-200">
            <LoginBanner />

            <section className="flex flex-1 items-center justify-center p-6 lg:ml-[50%]">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                    <Suspense fallback={<div className="h-48 animate-pulse rounded bg-surface-container-high" />}>
                        <LoginForm />
                    </Suspense>
                </div>
            </section>
        </main>
    );
}
