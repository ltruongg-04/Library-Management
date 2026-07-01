import type { BookVisitSubmitPayload, SubmitStatus } from "@/types/book-visit";

export async function submitBookVisit(payload: BookVisitSubmitPayload): Promise<SubmitStatus> {
    try {
        const response = await fetch("/api/book-visit/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.status === 503) return "warning";

        return response.ok ? "success" : "error";
    } catch {
        return "error";
    }
}
