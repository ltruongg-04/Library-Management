import { NextResponse } from "next/server";
import { getFallbackBookPage } from "@/mocks/books";
import type { BookSearchParams } from "@/types/book";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    try {
        const response = await fetch(`${BACKEND_URL}/api/books?${searchParams.toString()}`, {
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(getFallbackResponse(readBookSearchParams(searchParams)));
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error proxying to backend /api/books:", error);
        return NextResponse.json(getFallbackResponse(readBookSearchParams(searchParams)));
    }
}

function getFallbackResponse(params: BookSearchParams) {
    return {
        success: true,
        message: "Using local fallback catalog",
        data: getFallbackBookPage(params),
        timestamp: new Date().toISOString(),
    };
}

function readBookSearchParams(searchParams: URLSearchParams): BookSearchParams {
    const page = Number(searchParams.get("page"));
    const size = Number(searchParams.get("size"));
    const sortBy = searchParams.get("sortBy");

    return {
        keyword: searchParams.get("keyword") || undefined,
        category: searchParams.get("category") || undefined,
        page: Number.isNaN(page) ? undefined : page,
        size: Number.isNaN(size) ? undefined : size,
        sortBy: sortBy === "title" || sortBy === "author" || sortBy === "newest" ? sortBy : undefined,
    };
}
