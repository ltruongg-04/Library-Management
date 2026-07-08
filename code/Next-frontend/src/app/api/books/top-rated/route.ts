import { NextResponse } from "next/server";
import { getServerBackendUrl } from "@/config/env";

const BACKEND_URL = getServerBackendUrl();

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/books/top-rated`, {
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return NextResponse.json({ success: false, message: "Failed to fetch top-rated books" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
            },
        });
    } catch (error) {
        console.error("Error proxying to backend (top-rated books):", error);
        return NextResponse.json({ success: false, message: "Backend is unreachable" }, { status: 503 });
    }
}
