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
                .message("Guest borrow order created successfully")
                .data(response)
                .build());
    }

    @GetMapping("/lookup")
    public ResponseEntity<ApiResponse<java.util.List<BorrowOrderDetailResponseDto>>> lookupGuestBorrowOrder(
            @RequestParam String identifier,
            @RequestParam(required = false) String otp) {
        
        if (identifier != null && identifier.contains("@")) {
            if (otp == null || otp.trim().isEmpty()) {
                throw new CustomBusinessException("Vui lòng cung cấp mã OTP để tra cứu bằng email", HttpStatus.BAD_REQUEST);
            }
            if (!otpService.validateOtp(identifier, otp)) {
                throw new CustomBusinessException("Mã OTP không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED);
            }
        }

        java.util.List<BorrowOrderDetailResponseDto> response = borrowOrderService.getGuestBorrowOrders(identifier);
        
        return ResponseEntity.ok(ApiResponse.<java.util.List<BorrowOrderDetailResponseDto>>builder()
                .success(true)
                .message("Borrow orders retrieved successfully")
                .data(response)
                .build());
    }
}
