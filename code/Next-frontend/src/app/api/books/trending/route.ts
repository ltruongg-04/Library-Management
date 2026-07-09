import { NextResponse } from "next/server";
import { getServerBackendUrl } from "@/config/env";

const BACKEND_URL = getServerBackendUrl();
const DEFAULT_TRENDING_LIMIT = 8;
const FALLBACK_BACKEND_URL = "https://lms-backend-345298684510.europe-west1.run.app";

async function fetchJson(url: string) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
    });

    const data = await response.json();
    return { response, data };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || DEFAULT_TRENDING_LIMIT;
    const backendCandidates = Array.from(new Set([BACKEND_URL, FALLBACK_BACKEND_URL].filter(Boolean)));

    let lastMessage = "Backend is unreachable";

    for (const backendUrl of backendCandidates) {
        try {
            const trending = await fetchJson(`${backendUrl}/api/books/trending?limit=${limit}`);

            if (trending.response.ok) {
                return NextResponse.json(trending.data, {
                    headers: {
                        "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
                    },
                });
            }

            lastMessage = trending.data?.message || "Failed to fetch trending books";
        } catch (error) {
            console.error(`Error proxying to backend /api/books/trending via ${backendUrl}:`, error);
        }

        try {
            const fallback = await fetchJson(`${backendUrl}/api/books?page=0&size=${limit}&sortBy=newest`);

            if (fallback.response.ok) {
                return NextResponse.json(fallback.data, {
                    headers: {
                        "Cache-Control": "s-maxage=45, stale-while-revalidate=30",
                    },
                });
            }

            lastMessage = fallback.data?.message || lastMessage;
        } catch (error) {
            console.error(`Error proxying to backend /api/books fallback via ${backendUrl}:`, error);
        }
    }

    return NextResponse.json({ success: false, message: lastMessage }, { status: 503 });
}
