package library.service;

import jakarta.servlet.http.HttpServletRequest;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;

public interface BorrowOrderCommandService {
    BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request, HttpServletRequest httpRequest);
    BorrowResponseDto createGuestBorrowOrder(library.dto.borrow.GuestBorrowRequestDto request, HttpServletRequest httpRequest);
    void cancelBorrowOrder(String orderCode, Integer userId);
    BorrowResponseDto renewBorrowOrder(String orderCode, Integer userId, library.dto.borrow.BorrowExtensionRequestDto request, HttpServletRequest httpRequest);
}
