package library.service;

import library.dto.admin.AdminBorrowOrderDto;
import library.entity.BorrowOrderStatus;
import java.util.List;

public interface AdminBorrowService {
    List<AdminBorrowOrderDto> getAllBorrowOrders();
    void updateBorrowStatus(String orderCode, BorrowOrderStatus newStatus);
    library.dto.admin.AdminBorrowOrderDetailDto getBorrowOrderDetail(String orderCode);
    library.dto.admin.AdminBorrowOrderDto createBorrowOrder(library.dto.admin.AdminCreateBorrowOrderRequest request);
}
