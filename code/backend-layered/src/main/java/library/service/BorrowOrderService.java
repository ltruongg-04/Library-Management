package library.service;

import jakarta.servlet.http.HttpServletRequest;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;
import library.dto.borrow.UserBorrowDetailDto;
import library.dto.borrow.UserBorrowHistoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BorrowOrderService {
    BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request, HttpServletRequest httpRequest);

    Page<UserBorrowHistoryDto> getUserBorrowHistory(Integer customerId, Pageable pageable);

    UserBorrowDetailDto getUserBorrowDetail(Integer customerId, String orderCode);
}
