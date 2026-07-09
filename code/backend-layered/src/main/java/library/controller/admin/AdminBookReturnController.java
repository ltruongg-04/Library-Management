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
            throw new CustomBusinessException("Bạn chưa được xác thực", HttpStatus.UNAUTHORIZED);
        }

        String assistantEmail = authentication.getPrincipal().toString();

        AdminReturnBookResponseDto response = bookReturnService.returnBooks(requestDto, assistantEmail);
        return ResponseEntity.ok(ApiResponse.success("Xác nhận trả sách thành công", response));
    }

    @PostMapping("/returns/{bookReturnId}/vnpay")
    public ResponseEntity<ApiResponse<String>> generateVnPayUrl(
            @PathVariable Integer bookReturnId,
            jakarta.servlet.http.HttpServletRequest request) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Bạn chưa được xác thực", HttpStatus.UNAUTHORIZED);
        }

        // Get IP Address
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }

        String vnpayUrl = bookReturnService.generateVnPayUrl(bookReturnId, ipAddress);
        return ResponseEntity.ok(ApiResponse.success("Tạo mã thanh toán thành công", vnpayUrl));
    }

    @PostMapping("/returns/{bookReturnId}/cash")
    public ResponseEntity<ApiResponse<String>> confirmCashPayment(
            @PathVariable Integer bookReturnId) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Bạn chưa được xác thực", HttpStatus.UNAUTHORIZED);
        }

        String assistantEmail = authentication.getPrincipal().toString();
        bookReturnService.confirmCashPayment(bookReturnId, assistantEmail);
        return ResponseEntity.ok(ApiResponse.success("Xác nhận thanh toán tiền mặt thành công", null));
    }
}
