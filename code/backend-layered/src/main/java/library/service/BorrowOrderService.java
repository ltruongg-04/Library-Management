package library.service;

import jakarta.servlet.http.HttpServletRequest;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;
import library.dto.borrow.UserBorrowDetailDto;
import library.dto.borrow.UserBorrowHistoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import library.dto.borrow.BorrowHistoryResponseDto;
import library.dto.borrow.BorrowOrderDetailResponseDto;

public interface BorrowOrderService {
    BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request, HttpServletRequest httpRequest);
    BorrowResponseDto createGuestBorrowOrder(library.dto.borrow.GuestBorrowRequestDto request, HttpServletRequest httpRequest);
    List<BorrowHistoryResponseDto> getBorrowHistory(Integer userId);
    BorrowOrderDetailResponseDto getBorrowOrderDetail(String orderCode, Integer userId);
    BorrowOrderDetailResponseDto getGuestBorrowOrderDetail(String orderCode, String phone);
    BorrowResponseDto renewBorrowOrder(String orderCode, Integer userId, library.dto.borrow.BorrowExtensionRequestDto request, HttpServletRequest httpRequest);

    Page<UserBorrowHistoryDto> getUserBorrowHistory(Integer customerId, Pageable pageable);

    UserBorrowDetailDto getUserBorrowDetail(Integer customerId, String orderCode);
}
