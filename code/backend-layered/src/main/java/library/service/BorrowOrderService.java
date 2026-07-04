package library.service;

import jakarta.servlet.http.HttpServletRequest;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;

import java.util.List;
import library.dto.borrow.BorrowHistoryResponseDto;
import library.dto.borrow.BorrowOrderDetailResponseDto;

public interface BorrowOrderService {
    BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request, HttpServletRequest httpRequest);
    List<BorrowHistoryResponseDto> getBorrowHistory(Integer userId);
    BorrowOrderDetailResponseDto getBorrowOrderDetail(String orderCode, Integer userId);
    BorrowResponseDto renewBorrowOrder(String orderCode, Integer userId, library.dto.borrow.BorrowExtensionRequestDto request, HttpServletRequest httpRequest);
}
