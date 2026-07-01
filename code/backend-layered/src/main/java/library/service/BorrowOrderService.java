package library.service;

import jakarta.servlet.http.HttpServletRequest;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;

public interface BorrowOrderService {
    BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request, HttpServletRequest httpRequest);
}
