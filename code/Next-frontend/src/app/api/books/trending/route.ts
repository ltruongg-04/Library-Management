import { NextResponse } from "next/server";
import { getFallbackBookPage } from "@/mocks/books";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";
const DEFAULT_TRENDING_LIMIT = 8;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || DEFAULT_TRENDING_LIMIT;

    try {
        const response = await fetch(`${BACKEND_URL}/api/books/trending?limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(getFallbackResponse(limit));
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error proxying to backend /api/books/trending:", error);
        return NextResponse.json(getFallbackResponse(limit));
    }
}

function getFallbackResponse(limit: number) {
    return {
        success: true,
        message: "Using local fallback catalog",
        data: getFallbackBookPage({ size: limit }),
        timestamp: new Date().toISOString(),
    };
}
