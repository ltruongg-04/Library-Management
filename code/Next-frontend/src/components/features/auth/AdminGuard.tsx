"use client";

import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Chỉ kiểm tra khi đã load xong trạng thái auth
    if (!isLoading) {
      if (!isAuthenticated) {
        // Chưa đăng nhập thì chuyển về trang login
        router.replace("/login");
      } else if (user?.role?.toLowerCase() !== "admin") {
        // Đã đăng nhập nhưng không phải admin thì chuyển về trang người dùng (trang chủ)
        router.replace("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Hiển thị loading trong lúc đang kiểm tra auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAFAFB]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Nếu không có quyền, return null để tránh nháy giao diện trước khi redirect
  if (!isAuthenticated || user?.role?.toLowerCase() !== "admin") {
    return null;
  }

  // Đã xác thực và có quyền admin
  return <>{children}</>;
}
