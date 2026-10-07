package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminCreateStockReceiptRequest;
import library.dto.admin.AdminStockReceiptDto;
import library.service.AdminStockReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/admin/stock-receipts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasAuthority('inventory.manage')")
public class AdminStockReceiptController {

    private final AdminStockReceiptService adminStockReceiptService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminStockReceiptDto>>> getAllReceipts() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phiếu nhập thành công", adminStockReceiptService.getAllReceipts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminStockReceiptDto>> getReceiptDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết phiếu nhập thành công", adminStockReceiptService.getReceiptDetail(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminStockReceiptDto>> createReceipt(
            @RequestBody AdminCreateStockReceiptRequest request, Authentication authentication) {
        String username = authentication.getName();
        AdminStockReceiptDto receipt = adminStockReceiptService.createReceipt(request, username);
        return ResponseEntity.ok(ApiResponse.success("Tạo phiếu nhập kho thành công", receipt));
    }
}
