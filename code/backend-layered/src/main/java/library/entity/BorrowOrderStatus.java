package library.entity;

public enum BorrowOrderStatus {
    PENDING,
    READY,
    BORROWED,
    PENDING_RENEWAL,
    PARTIALLY_RETURNED,
    RETURNED,
    OVERDUE,
    CANCELLED,
    REJECTED
}
