import { NextResponse } from "next/server";
import { getServerBackendUrl } from "@/config/env";
import { API_ERRORS } from "@/constants/ui-text/shared/api";

const LOCAL_BACKEND_URL = "http://localhost:8080";
const BACKEND_REQUEST_TIMEOUT_MS = 3000;

function getBackendCandidates() {
    const configuredBackendUrl = getServerBackendUrl();
    const backendCandidates = [configuredBackendUrl];

    try {
        const parsedBackendUrl = new URL(configuredBackendUrl);
        if (parsedBackendUrl.hostname === "localhost" && parsedBackendUrl.port !== "8080") {
            backendCandidates.push(LOCAL_BACKEND_URL);
        }
    } catch {
        // Keep the configured URL as-is if it is not parseable.
    }

    return Array.from(new Set(backendCandidates.filter(Boolean)));
}

async function fetchBookDetail(backendUrl: string, bookId: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_REQUEST_TIMEOUT_MS);

    const response = await fetch(`${backendUrl}/api/books/${bookId}`, {
        signal: controller.signal,
        headers: {
            "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
    });

    try {
        const data = await response.json();
        return { response, data };
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    let lastMessage = API_ERRORS.NOT_FOUND_BOOK;

    for (const backendUrl of getBackendCandidates()) {
        try {
            const { response, data } = await fetchBookDetail(backendUrl, params.id);

            if (!response.ok) {
                lastMessage = data.message || API_ERRORS.NOT_FOUND_BOOK;
                continue;
            }

            return NextResponse.json(data, {
                headers: {
                    "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
                },
            });
        } catch (error) {
            console.error(`Error proxying to backend /api/books/${params.id} via ${backendUrl}:`, error);
        }
    }

    return NextResponse.json({ success: false, message: lastMessage }, { status: 503 });
}
