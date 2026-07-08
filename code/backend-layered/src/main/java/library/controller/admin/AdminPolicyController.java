package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.BorrowingPolicyDto;
import library.service.FeeCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin/policies")
@RequiredArgsConstructor
public class AdminPolicyController {

    private final FeeCalculatorService feeCalculatorService;

    /**
     * Lấy chính sách mượn sách hiện hành
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<BorrowingPolicyDto>> getActivePolicy() {
        var policy = feeCalculatorService.getActivePolicy();
        BorrowingPolicyDto dto = BorrowingPolicyDto.builder()
                .id(policy.getId())
                .maxBorrowDays(policy.getMaxBorrowDays())
                .maxBooks(policy.getMaxBooks())
                .rentalFeePerDay(policy.getRentalFeePerDay())
                .overdueFinePerDay(policy.getOverdueFinePerDay())
                .damageFeePercent(policy.getDamageFeePercent())
                .lostBookMultiplier(policy.getLostBookMultiplier())
                .maxExtensions(policy.getMaxExtensions())
                .build();
        return ResponseEntity.ok(ApiResponse.success("Lấy chính sách thành công", dto));
    }

    /**
     * Cập nhật chính sách mượn sách (đồng bộ từ frontend admin settings)
     */
    @PutMapping("/active")
    public ResponseEntity<ApiResponse<BorrowingPolicyDto>> updatePolicy(@RequestBody BorrowingPolicyDto dto) {
        BorrowingPolicyDto updated = feeCalculatorService.updatePolicy(dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật chính sách thành công", updated));
    }
}
