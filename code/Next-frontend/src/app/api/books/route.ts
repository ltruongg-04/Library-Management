import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    try {
        const response = await fetch(`${BACKEND_URL}/api/books?${searchParams.toString()}`, {
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 45 },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ success: false, message: data.message || "Failed to fetch from backend" }, { status: response.status });
        }

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "s-maxage=45, stale-while-revalidate=30",
            },
        });
    } catch (error) {
        console.error("Error proxying to backend /api/books:", error);
        return NextResponse.json({ success: false, message: "Backend is unreachable" }, { status: 503 });
    }
}
