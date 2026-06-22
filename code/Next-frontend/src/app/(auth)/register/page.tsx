'use client'
import { LoginBanner } from "@/components/features/auth/banner";
import RegisterForm from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar trang trí */}
      <LoginBanner />

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 lg:ml-[50%]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tạo tài khoản</h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
