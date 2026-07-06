package library.controller.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import library.common.base.ApiResponse;
import library.common.exception.CustomBusinessException;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.BorrowOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController("userBorrowController")
@RequestMapping("/api/user/borrow")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowOrderService borrowOrderService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<BorrowResponseDto>> createBorrowOrder(
            @Valid @RequestBody BorrowRequestDto request,
            HttpServletRequest httpRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        String email = authentication.getPrincipal().toString();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomBusinessException("User not found", HttpStatus.NOT_FOUND));

        BorrowResponseDto response = borrowOrderService.createBorrowOrder(user.getId(), request, httpRequest);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đặt mượn sách thành công", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<java.util.List<library.dto.borrow.BorrowHistoryResponseDto>>> getBorrowHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        String email = authentication.getPrincipal().toString();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomBusinessException("User not found", HttpStatus.NOT_FOUND));

        java.util.List<library.dto.borrow.BorrowHistoryResponseDto> history = borrowOrderService.getBorrowHistory(user.getId());

        return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử mượn sách thành công", history));
    }

    @GetMapping("/history/{orderCode}")
    public ResponseEntity<ApiResponse<library.dto.borrow.BorrowOrderDetailResponseDto>> getBorrowOrderDetail(@PathVariable String orderCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        String email = authentication.getPrincipal().toString();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomBusinessException("User not found", HttpStatus.NOT_FOUND));

        library.dto.borrow.BorrowOrderDetailResponseDto detail = borrowOrderService.getBorrowOrderDetail(orderCode, user.getId());

        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết phiếu mượn thành công", detail));
    }

    @PostMapping("/{orderCode}/renew")
    public ResponseEntity<ApiResponse<library.dto.borrow.BorrowResponseDto>> renewBorrowOrder(
            @PathVariable String orderCode,
            @Valid @RequestBody library.dto.borrow.BorrowExtensionRequestDto request,
            HttpServletRequest httpRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        String email = authentication.getPrincipal().toString();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomBusinessException("User not found", HttpStatus.NOT_FOUND));

        library.dto.borrow.BorrowResponseDto response = borrowOrderService.renewBorrowOrder(orderCode, user.getId(), request, httpRequest);

        return ResponseEntity.ok(ApiResponse.success("Yêu cầu gia hạn đã được xử lý", response));
    }
}

