"use client";
import RegisterForm from "@/components/features/auth/RegisterForm";
import { LoginBanner } from "@/components/features/auth/banner";
import { AUTH } from "@/constants/ui-text/auth";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen bg-surface transition-colors duration-200">
            {/* Sidebar trang trí */}
            <LoginBanner />

            {/* Form Container */}
            <div className="flex flex-1 items-center justify-center p-6 lg:ml-[50%]">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                    <h2 className="mb-6 text-2xl font-bold text-slate-900">{AUTH.REGISTER.HEADING}</h2>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
