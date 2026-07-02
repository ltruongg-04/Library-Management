export type VisitFormState = {
    fullName: string;
    email: string;
    phone: string;
    visitDate: string;
    visitHour: string;
    visitMinute: string;
    visitPeriod: string;
    purpose: string;
};

export type SubmitStatus = "idle" | "sending" | "success" | "warning" | "error";

export type BookVisitSubmitPayload = VisitFormState & {
    bookId: number;
    bookTitle: string;
    confirmationCode: string;
};

export type BookVisitPageContentProps = {
    bookId: number;
};
