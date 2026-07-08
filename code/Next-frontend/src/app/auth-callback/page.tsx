"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isStaffOrAdmin, isSuperAdmin } from "@/utils/role";

export default function AuthCallbackPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            if (isSuperAdmin(session?.user?.role)) {
                router.push("/admin");
            } else if (isStaffOrAdmin(session?.user?.role)) {
                router.push("/staff");
            } else {
                router.push("/");
            }
        } else if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, session, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface">
            <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
    );
}
