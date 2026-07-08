package library.controller;

import library.common.base.ApiResponse;
import library.dto.admin.BorrowingPolicyDto;
import library.service.FeeCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PublicPolicyController {

    private final FeeCalculatorService feeCalculatorService;

    /**
     * Lấy chính sách mượn sách hiện hành (public, không cần auth)
     * Dùng cho frontend hiển thị đơn giá thuê, phí phạt...
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
}
