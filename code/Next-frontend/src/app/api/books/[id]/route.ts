import { NextResponse } from "next/server";
import { getFallbackBookById } from "@/mocks/books";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id);

    try {
        const response = await fetch(`${BACKEND_URL}/api/books/${params.id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return getFallbackResponse(id);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error(`Error proxying to backend /api/books/${params.id}:`, error);
        return getFallbackResponse(id);
    }
}

function getFallbackResponse(id: number) {
    const book = getFallbackBookById(id);

    if (!book) {
        return NextResponse.json(
            {
                success: false,
                message: "Không tìm thấy sách",
                data: null,
                timestamp: new Date().toISOString(),
            },
            { status: 404 },
        );
    }

    return NextResponse.json({
        success: true,
        message: "Using local fallback catalog",
        data: book,
        timestamp: new Date().toISOString(),
    });
}
