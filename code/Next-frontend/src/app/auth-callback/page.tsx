"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            if (session?.user?.role === "ADMIN") {
                router.replace("/admin");
            } else {
                router.replace("/");
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
