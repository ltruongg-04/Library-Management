export interface Notification {
    id: number;

    title: string;

    message: string;

    type: "SYSTEM" | "AUTH" | "AI_INSIGHT" | "BORROW" | "RESERVATION" | "RETURN" | "OVERDUE" | string;

    isRead: boolean;

    time: string;
}
