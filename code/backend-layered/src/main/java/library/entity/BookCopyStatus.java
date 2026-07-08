package library.entity;

public enum BookCopyStatus {
    AVAILABLE,    // Có sẵn
    BORROWED,     // Đang mượn
    LOST,         // Mất
    DAMAGED,      // Hư hỏng
    MAINTENANCE,  // Đang bảo trì / Kiểm tra
    RESERVED      // Đã được giữ chỗ cho người dùng (Reservation)
}
