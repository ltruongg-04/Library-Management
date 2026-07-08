import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || process.env.BACKEND_URL || "http://127.0.0.1:8081";
const DEFAULT_TRENDING_LIMIT = 8;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || DEFAULT_TRENDING_LIMIT;

    try {
        const response = await fetch(`${BACKEND_URL}/api/books/trending?limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ success: false, message: data.message || "Failed to fetch trending books" }, { status: response.status });
        }

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
            },
        });
    } catch (error) {
        console.error("Error proxying to backend /api/books/trending:", error);
        return NextResponse.json({ success: false, message: "Backend is unreachable" }, { status: 503 });
    }
}
