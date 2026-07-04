package library.controller.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import library.common.base.ApiResponse;
import library.common.exception.CustomBusinessException;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;
import library.dto.borrow.UserBorrowDetailDto;
import library.dto.borrow.UserBorrowHistoryDto;
import library.entity.CustomerEntity;
import library.entity.UserEntity;
import library.repository.CustomerRepository;
import library.repository.UserRepository;
import library.service.BorrowOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
    private final CustomerRepository customerRepository;

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

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserBorrowHistoryDto>>> getUserBorrowHistory(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        CustomerEntity customer = getCurrentCustomer();
        Page<UserBorrowHistoryDto> history = borrowOrderService.getUserBorrowHistory(customer.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử mượn sách thành công", history));
    }

    @GetMapping("/{orderCode}")
    public ResponseEntity<ApiResponse<UserBorrowDetailDto>> getUserBorrowDetail(
            @PathVariable String orderCode) {
        CustomerEntity customer = getCurrentCustomer();
        UserBorrowDetailDto detail = borrowOrderService.getUserBorrowDetail(customer.getId(), orderCode);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết đơn mượn thành công", detail));
    }

    private CustomerEntity getCurrentCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String email = authentication.getPrincipal().toString();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomBusinessException("User not found", HttpStatus.NOT_FOUND));
        return customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new CustomBusinessException("Customer profile not found", HttpStatus.NOT_FOUND));
    }
}

