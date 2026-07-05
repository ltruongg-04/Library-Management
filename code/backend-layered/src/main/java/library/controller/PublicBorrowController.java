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

@RestController
@RequestMapping("/api/public/borrow")
@RequiredArgsConstructor
public class PublicBorrowController {

    private final BorrowOrderService borrowOrderService;

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
    public ResponseEntity<ApiResponse<BorrowOrderDetailResponseDto>> lookupGuestBorrowOrder(
            @RequestParam String orderCode,
            @RequestParam String phone) {
        
        BorrowOrderDetailResponseDto response = borrowOrderService.getGuestBorrowOrderDetail(orderCode, phone);
        
        return ResponseEntity.ok(ApiResponse.<BorrowOrderDetailResponseDto>builder()
                .success(true)
                .message("Borrow order retrieved successfully")
                .data(response)
                .build());
    }
}
