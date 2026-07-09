package library.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import library.common.base.ApiResponse;
import library.dto.borrow.BorrowOrderDetailResponseDto;
import library.dto.borrow.BorrowResponseDto;
import library.dto.borrow.GuestBorrowRequestDto;
import library.service.BorrowOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import library.dto.request.OtpRequestDto;
import library.service.OtpService;
import library.common.exception.CustomBusinessException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/public/borrow")
@RequiredArgsConstructor
public class PublicBorrowController {

    private final BorrowOrderService borrowOrderService;
    private final OtpService otpService;
    private final library.service.ReCaptchaService reCaptchaService;

    @PostMapping("/otp/request")
    public ResponseEntity<ApiResponse<Void>> requestOtp(@Valid @RequestBody OtpRequestDto request) {
        otpService.requestOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Đã gửi mã OTP tới email của bạn")
                .build());
    }

    @PostMapping("/guest")
    public ResponseEntity<ApiResponse<BorrowResponseDto>> createGuestBorrowOrder(
            @Valid @RequestBody GuestBorrowRequestDto request,
            HttpServletRequest httpRequest) {
        
        BorrowResponseDto response = borrowOrderService.createGuestBorrowOrder(request, httpRequest);
        
        return ResponseEntity.ok(ApiResponse.<BorrowResponseDto>builder()
                .success(true)
                .message("Tạo phiếu mượn cho khách thành công")
                .data(response)
                .build());
    }

    @GetMapping("/lookup")
    public ResponseEntity<ApiResponse<?>> lookupGuestBorrowOrder(
            @RequestParam(required = false) String identifier,
            @RequestParam(required = false) String orderCode,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String otp,
            @RequestParam(required = false) String recaptchaToken) {
        if (orderCode != null && !orderCode.isBlank() && phone != null && !phone.isBlank()) {
            BorrowOrderDetailResponseDto response = borrowOrderService.getGuestBorrowOrder(orderCode, phone);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Tra cứu phiếu mượn thành công")
                    .data(response)
                    .build());
        }

        if (identifier == null || identifier.trim().isEmpty()) {
            throw new CustomBusinessException("Vui lòng cung cấp mã phiếu và SĐT", HttpStatus.BAD_REQUEST);
        }
        
        if (identifier != null && identifier.contains("@")) {
            if (otp == null || otp.trim().isEmpty()) {
                throw new CustomBusinessException("Vui lòng cung cấp mã OTP để tra cứu bằng email", HttpStatus.BAD_REQUEST);
            }
            if (!otpService.validateOtp(identifier, otp)) {
                throw new CustomBusinessException("Mã OTP không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED);
            }
        } else {
            // Tra cứu bằng mã đơn -> Kiểm tra reCAPTCHA
            if (recaptchaToken == null || recaptchaToken.trim().isEmpty()) {
                throw new CustomBusinessException("Vui lòng xác nhận CAPTCHA để tra cứu", HttpStatus.BAD_REQUEST);
            }
            if (!reCaptchaService.verifyToken(recaptchaToken)) {
                throw new CustomBusinessException("Mã CAPTCHA không hợp lệ. Vui lòng thử lại", HttpStatus.UNAUTHORIZED);
            }
        }

        java.util.List<BorrowOrderDetailResponseDto> response = borrowOrderService.getGuestBorrowOrders(identifier);
        
        return ResponseEntity.ok(ApiResponse.<java.util.List<BorrowOrderDetailResponseDto>>builder()
                .success(true)
                .message("Tra cứu danh sách phiếu mượn thành công")
                .data(response)
                .build());
    }

    @GetMapping("/lookup-by-phone")
    public ResponseEntity<ApiResponse<BorrowOrderDetailResponseDto>> lookupGuestBorrowOrderByPhone(
            @RequestParam String orderCode,
            @RequestParam String phone) {
        BorrowOrderDetailResponseDto response = borrowOrderService.getGuestBorrowOrder(orderCode, phone);
        return ResponseEntity.ok(ApiResponse.<BorrowOrderDetailResponseDto>builder()
                .success(true)
                .message("Tra cứu phiếu mượn thành công")
                .data(response)
                .build());
    }
}
