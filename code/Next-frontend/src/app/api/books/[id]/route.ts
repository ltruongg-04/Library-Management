import { NextResponse } from "next/server";
import { API_ERRORS } from "@/constants/ui-text/shared/api";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/books/${params.id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ success: false, message: data.message || API_ERRORS.NOT_FOUND_BOOK }, { status: response.status });
        }

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
            },
        });
    } catch (error) {
        console.error(`Error proxying to backend /api/books/${params.id}:`, error);
        return NextResponse.json({ success: false, message: "Backend is unreachable" }, { status: 503 });
    }
}
