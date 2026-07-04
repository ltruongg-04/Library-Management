package library.entity;

public enum BorrowOrderStatus {
    PENDING,
    READY,
    BORROWED,
    PENDING_RENEWAL,
    RETURNED,
    OVERDUE,
    CANCELLED
}
