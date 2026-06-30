package library.service;

import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;

public interface BorrowOrderService {
    BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request);
}
