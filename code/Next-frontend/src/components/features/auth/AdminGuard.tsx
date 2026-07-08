"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AUTH } from "@/constants/ui-text/auth";
import { useAuth } from "@/providers/auth";
import { isStaffOrAdmin, isSuperAdmin } from "@/utils/role";

export function AdminGuard({ children }: { children: ReactNode }) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const portal = (params?.portal as string) || "admin";

    let canViewAdmin = false;
    if (isAuthenticated) {
        if (portal === "admin") {
            canViewAdmin = isSuperAdmin(user?.role);
        } else if (portal === "staff") {
            canViewAdmin = isStaffOrAdmin(user?.role);
        }
    }

    useEffect(() => {
        // Chỉ kiểm tra khi đã load xong trạng thái auth
        if (!isLoading) {
            if (!isAuthenticated) {
                // Chưa đăng nhập thì chuyển về trang login
                router.replace("/login");
            }
            // Bỏ đoạn tự động redirect về trang chủ khi không phải admin
        }
    }, [isLoading, isAuthenticated, router]);

    // Hiển thị loading trong lúc đang kiểm tra auth
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FAFAFB]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    // Nếu không có quyền, render trang báo lỗi
    if (!canViewAdmin) {
        // Nếu chưa đăng nhập thì trả về null đợi useEffect redirect
        if (!isAuthenticated) return null;

        // Nếu đã đăng nhập nhưng không phải admin, báo lỗi
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-surface p-4 text-center">
                <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl">
                    <h1 className="mb-4 text-2xl font-bold text-red-600">{AUTH.ADMIN_GUARD.ACCESS_DENIED}</h1>
                    <p className="mb-8 text-on-surface-variant">{AUTH.ADMIN_GUARD.NO_PERMISSION}</p>
                    <button
                        onClick={() => router.replace("/")}
                        className="hover:bg-primary-600 rounded bg-primary-500 px-6 py-2.5 font-medium text-white transition-colors"
                    >
                        {AUTH.ADMIN_GUARD.BACK_TO_HOME}
                    </button>
                </div>
            </div>
        );
    }

    // Đã xác thực và có quyền admin
    return <>{children}</>;
}
