export interface BorrowHistoryResponseDto {
    id: string;
    title: string;
    author: string;
    borrowDate: string;
    dueDate: string;
    actualReturnDate: string | null;
    deposit: string;
    depositReturn: string | null;
    lateFee: string | null;
    status: "borrowed" | "returned" | "overdue" | "pending" | "ready" | "cancelled" | "pending_renewal";
    extensionCount: number;
    imgSrc: string | null;
}

export interface BookItemDto {
    title: string;
    author: string;
    status: string;
    imgSrc: string;
}

export interface BorrowOrderDetailResponseDto {
    id: string;
    borrowDate: string;
    dueDate: string;
    actualReturnDate: string | null;
    deadlineDate: string;
    reminderDate: string;
    borrowSuccessDate: string;
    deposit: string;
    rentalFee: string;
    lateFee: string;
    paidOnline: string;
    total: string;
    status: string;
    overdueDays: number;
    extensionCount: number;
    books: BookItemDto[];
}
