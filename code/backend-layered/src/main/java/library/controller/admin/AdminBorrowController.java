package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminBorrowOrderDto;
import library.dto.admin.BorrowRejectRequest;
import library.service.AdminBorrowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import library.entity.BorrowOrderStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/borrows")
@RequiredArgsConstructor
public class AdminBorrowController {

    private final AdminBorrowService adminBorrowService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminBorrowOrderDto>>> getAllBorrows(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "ALL") String customerType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<AdminBorrowOrderDto> borrows = adminBorrowService.searchBorrowOrders(status, customerType, keyword, page, size);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lượt mượn thành công", borrows));
    }

    @PutMapping("/{orderCode}/status")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('borrow.approve')")
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

    @PutMapping("/{orderCode}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('borrow.approve')")
    public ResponseEntity<ApiResponse<Void>> approveBorrow(@PathVariable String orderCode) {
        adminBorrowService.approveBorrow(orderCode);
        return ResponseEntity.ok(ApiResponse.success("Duyệt phiếu mượn thành công", null));
    }

    @PutMapping("/{orderCode}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('borrow.approve')")
    public ResponseEntity<ApiResponse<Void>> rejectBorrow(
            @PathVariable String orderCode,
            @Valid @RequestBody BorrowRejectRequest request) {
        adminBorrowService.rejectBorrow(orderCode, request.getReason());
        return ResponseEntity.ok(ApiResponse.success("Từ chối phiếu mượn thành công", null));
    }

    @PutMapping("/{orderCode}/pickup")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('borrow.approve')")
    public ResponseEntity<ApiResponse<Void>> confirmPickup(@PathVariable String orderCode) {
        adminBorrowService.confirmPickup(orderCode);
        return ResponseEntity.ok(ApiResponse.success("Xác nhận giao sách thành công", null));
    }

    @GetMapping("/{orderCode}")
    public ResponseEntity<ApiResponse<library.dto.admin.AdminBorrowOrderDetailDto>> getBorrowOrderDetail(@PathVariable String orderCode) {
        library.dto.admin.AdminBorrowOrderDetailDto detail = adminBorrowService.getBorrowOrderDetail(orderCode);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết lượt mượn thành công", detail));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('borrow.approve')")
    public ResponseEntity<ApiResponse<AdminBorrowOrderDto>> createBorrowOrder(@RequestBody library.dto.admin.AdminCreateBorrowOrderRequest request) {
        AdminBorrowOrderDto newOrder = adminBorrowService.createBorrowOrder(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo phiếu mượn thành công", newOrder));
    }

    @PutMapping("/{orderCode}/renew")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('borrow.approve')")
    public ResponseEntity<ApiResponse<Void>> processRenewal(
            @PathVariable String orderCode,
            @RequestBody library.dto.admin.AdminRenewalRequestDto request) {
        adminBorrowService.processRenewal(orderCode, request);
        return ResponseEntity.ok(ApiResponse.success("Xử lý yêu cầu gia hạn thành công", null));
    }
}
