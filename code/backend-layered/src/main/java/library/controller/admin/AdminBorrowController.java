package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminBorrowOrderDto;
import library.service.AdminBorrowService;
import lombok.RequiredArgsConstructor;
import library.entity.BorrowOrderStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/borrows")
@RequiredArgsConstructor
public class AdminBorrowController {

    private final AdminBorrowService adminBorrowService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminBorrowOrderDto>>> getAllBorrows() {
        List<AdminBorrowOrderDto> borrows = adminBorrowService.getAllBorrowOrders();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lượt mượn thành công", borrows));
    }

    @PutMapping("/{orderCode}/status")
    public ResponseEntity<ApiResponse<Void>> updateBorrowStatus(
            @PathVariable String orderCode,
            @RequestParam String status) {
        try {
            BorrowOrderStatus newStatus = BorrowOrderStatus.valueOf(status.toUpperCase());
            adminBorrowService.updateBorrowStatus(orderCode, newStatus);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Trạng thái không hợp lệ: " + status));
        }
    }
    @GetMapping("/{orderCode}")
    public ResponseEntity<ApiResponse<library.dto.admin.AdminBorrowOrderDetailDto>> getBorrowOrderDetail(@PathVariable String orderCode) {
        library.dto.admin.AdminBorrowOrderDetailDto detail = adminBorrowService.getBorrowOrderDetail(orderCode);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết lượt mượn thành công", detail));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminBorrowOrderDto>> createBorrowOrder(@RequestBody library.dto.admin.AdminCreateBorrowOrderRequest request) {
        AdminBorrowOrderDto newOrder = adminBorrowService.createBorrowOrder(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo phiếu mượn thành công", newOrder));
    }

    @PutMapping("/{orderCode}/renew")
    public ResponseEntity<ApiResponse<Void>> processRenewal(
            @PathVariable String orderCode,
            @RequestBody library.dto.admin.AdminRenewalRequestDto request) {
        adminBorrowService.processRenewal(orderCode, request);
        return ResponseEntity.ok(ApiResponse.success("Xử lý yêu cầu gia hạn thành công", null));
    }
}
