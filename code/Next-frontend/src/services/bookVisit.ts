import axiosInstance from "@/lib/axios";
import type { BookVisitSubmitPayload, SubmitStatus } from "@/types/book-visit";

export async function submitBookVisit(payload: BookVisitSubmitPayload): Promise<SubmitStatus> {
    try {
        const response = await axiosInstance.post("/api/public/book-visits/confirm", payload);
        return response.status >= 200 && response.status < 300 ? "success" : "error";
    } catch {
        return "error";
    }
}
