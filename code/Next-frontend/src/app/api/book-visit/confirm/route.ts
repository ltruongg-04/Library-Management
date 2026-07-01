import { NextResponse } from "next/server";
import type { BookVisitSubmitPayload } from "@/types/book-visit";
import { buildBookVisitEmailHtml } from "@/utils/book-visit-email";

const RESEND_API_URL = "https://api.resend.com/emails";

export async function POST(request: Request) {
    const payload = (await request.json()) as BookVisitSubmitPayload;

    if (!isValidBookVisitPayload(payload)) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.BOOK_VISIT_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
        return NextResponse.json({ success: false, reason: "email_not_configured" }, { status: 503 });
    }

    const response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: fromEmail,
            to: payload.email,
            subject: "Xác nhận lịch đọc sách tại Lumina Library",
            html: buildBookVisitEmailHtml({
                fullName: payload.fullName,
                bookTitle: payload.bookTitle || "Lumina Library",
                visitDate: payload.visitDate,
                visitTime: `${payload.visitHour}:${payload.visitMinute} ${payload.visitPeriod}`,
                phone: payload.phone,
            }),
        }),
    });

    if (!response.ok) {
        return NextResponse.json({ success: false }, { status: 502 });
    }

    return NextResponse.json({ success: true });
}

function isValidBookVisitPayload(payload: Partial<BookVisitSubmitPayload>) {
    return Boolean(
        payload.email && payload.fullName && payload.visitDate && payload.visitHour && payload.visitMinute && payload.visitPeriod && payload.purpose,
    );
}
