import { NextResponse } from "next/server";
import { FALLBACK_BOOKS } from "@/mocks/books";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";
const TOP_RATED_LIMIT = 10;

export async function GET() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/books/top-rated`, {
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Backend API returned status: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error proxying to backend (top-rated books):", error);
        return NextResponse.json({
            success: true,
            message: "Using local fallback catalog",
            data: [...FALLBACK_BOOKS].sort((firstBook, secondBook) => secondBook.rating - firstBook.rating).slice(0, TOP_RATED_LIMIT),
            timestamp: new Date().toISOString(),
        });
    }
}
