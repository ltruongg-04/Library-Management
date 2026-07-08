package library.service;

import library.dto.admin.AdminBorrowOrderDto;
import library.entity.BorrowOrderStatus;
import java.util.List;

public interface AdminBorrowService {
    List<AdminBorrowOrderDto> getAllBorrowOrders();
    List<AdminBorrowOrderDto> searchBorrowOrders(String status, String customerType, String keyword, int page, int size);
    void updateBorrowStatus(String orderCode, BorrowOrderStatus newStatus);
    void approveBorrow(String orderCode);
    void rejectBorrow(String orderCode, String reason);
    void confirmPickup(String orderCode);
    library.dto.admin.AdminBorrowOrderDetailDto getBorrowOrderDetail(String orderCode);
    library.dto.admin.AdminBorrowOrderDto createBorrowOrder(library.dto.admin.AdminCreateBorrowOrderRequest request);
    void processRenewal(String orderCode, library.dto.admin.AdminRenewalRequestDto request);
}
