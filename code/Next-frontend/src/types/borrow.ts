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
    settlementAmount?: string;
    settlementType?: "COLLECT" | "REFUND" | "SETTLED";
    customerName: string;
    customerPhone?: string;
    status: string;
    overdueDays: number;
    extensionCount: number;
    books: BookItemDto[];
}

export interface UserBorrowHistoryItem {
    id: number;
    orderCode: string;
    status: string;
    borrowDate: string;
    pickupDate: string | null;
    dueDate: string;
    actualReturnDate?: string | null;
    totalDeposit: number;
    bookTitle: string;
    bookAuthor: string;
    bookCoverImage: string | null;
}

export interface UserBorrowDetail {
    id: number;
    orderCode: string;
    status: string;
    borrowDate: string;
    pickupDate: string | null;
    dueDate: string;
    totalDeposit: number;
    totalFee: number | null;
    lateFee: number;
    bookTitle: string;
    bookAuthor: string;
    bookCoverImage: string | null;
    bookDetailStatus: string;
}

export interface BorrowRequestPayload {
    bookId: number;
    pickupDate: string;
    returnDate: string;
    paymentMethod: string;
}

export interface BorrowResponse {
    id: number;
    orderCode: string;
    pickupDate: string;
    dueDate: string;
    status: string;
    totalDeposit: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentUrl?: string;
}

export interface AdminBorrowResponse {
    id: string;
    customerName: string;
    customerCode: string;
    bookTitle: string;
    bookAuthor: string;
    borrowDate: string | null;
    dueDate: string | null;
    status: string;
    overdayCount: number | null;
    isGuest?: boolean;
}

export interface AdminBorrowFilters {
    status?: string;
    customerType?: "ALL" | "GUEST" | "CUSTOMER";
    keyword?: string;
    page?: number;
    size?: number;
}
