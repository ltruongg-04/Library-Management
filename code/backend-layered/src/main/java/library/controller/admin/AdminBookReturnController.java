package library.controller.admin;

import jakarta.validation.Valid;
import library.common.base.ApiResponse;
import library.common.exception.CustomBusinessException;
import library.dto.admin.returnbook.AdminReturnBookRequestDto;
import library.dto.admin.returnbook.AdminReturnBookResponseDto;
import library.service.BookReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/borrows")
@RequiredArgsConstructor
public class AdminBookReturnController {

    private final BookReturnService bookReturnService;

    @PostMapping("/{borrowOrderId}/return")
    public ResponseEntity<ApiResponse<AdminReturnBookResponseDto>> returnBooks(
            @PathVariable Integer borrowOrderId,
            @Valid @RequestBody AdminReturnBookRequestDto requestDto) {
        
        if (!borrowOrderId.equals(requestDto.getBorrowOrderId())) {
            throw new CustomBusinessException("Borrow order ID in path and body do not match", HttpStatus.BAD_REQUEST);
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        String assistantEmail = authentication.getPrincipal().toString();

        try {
            AdminReturnBookResponseDto response = bookReturnService.returnBooks(requestDto, assistantEmail);
            return ResponseEntity.ok(ApiResponse.success("Xác nhận trả sách thành công", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi xác nhận trả sách: " + e.getMessage()));
        }
    }

    @PostMapping("/returns/{bookReturnId}/vnpay")
    public ResponseEntity<ApiResponse<String>> generateVnPayUrl(
            @PathVariable Integer bookReturnId,
            jakarta.servlet.http.HttpServletRequest request) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        try {
            // Get IP Address
            String ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null || ipAddress.isEmpty()) {
                ipAddress = request.getRemoteAddr();
            }

            String vnpayUrl = bookReturnService.generateVnPayUrl(bookReturnId, ipAddress);
            return ResponseEntity.ok(ApiResponse.success("Tạo mã thanh toán thành công", vnpayUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi tạo thanh toán VNPay: " + e.getMessage()));
        }
    }

    @PostMapping("/returns/{bookReturnId}/cash")
    public ResponseEntity<ApiResponse<String>> confirmCashPayment(
            @PathVariable Integer bookReturnId) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        try {
            bookReturnService.confirmCashPayment(bookReturnId);
            return ResponseEntity.ok(ApiResponse.success("Xác nhận thanh toán tiền mặt thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi xác nhận thanh toán: " + e.getMessage()));
        }
    }
}
