package library.controller.admin;

import library.common.base.ApiResponse;
import org.springframework.data.domain.Page;
import library.dto.admin.AdminPaymentDto;
import library.service.AdminPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasAuthority('payment.manage')")
public class AdminPaymentController {

    private final AdminPaymentService adminPaymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AdminPaymentDto>>> getPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String transactionCode) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách giao dịch", adminPaymentService.getPayments(page, size, transactionCode)));
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<AdminPaymentDto>> refundPayment(
            @PathVariable Integer id, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Hoàn tiền thành công", adminPaymentService.refundPayment(id, authentication.getName())));
    }
}
