package library.service;

import library.dto.borrow.UserBorrowDetailDto;
import library.dto.borrow.UserBorrowHistoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import library.dto.borrow.BorrowHistoryResponseDto;
import library.dto.borrow.BorrowOrderDetailResponseDto;

public interface BorrowOrderQueryService {
    List<BorrowHistoryResponseDto> getBorrowHistory(Integer userId);
    BorrowOrderDetailResponseDto getBorrowOrderDetail(String orderCode, Integer userId);
    java.util.List<BorrowOrderDetailResponseDto> getGuestBorrowOrders(String identifier);
    BorrowOrderDetailResponseDto getGuestBorrowOrder(String orderCode, String phone);
    Page<UserBorrowHistoryDto> getUserBorrowHistory(Integer customerId, Pageable pageable);
    UserBorrowDetailDto getUserBorrowDetail(Integer customerId, String orderCode);
}
