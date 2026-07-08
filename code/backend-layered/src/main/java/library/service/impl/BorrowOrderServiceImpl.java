package library.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;
import library.dto.borrow.UserBorrowDetailDto;
import library.dto.borrow.UserBorrowHistoryDto;
import library.dto.borrow.BorrowHistoryResponseDto;
import library.dto.borrow.BorrowOrderDetailResponseDto;
import library.service.BorrowOrderService;
import library.service.BorrowOrderCommandService;
import library.service.BorrowOrderQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class BorrowOrderServiceImpl implements BorrowOrderService {

    private final BorrowOrderCommandService commandService;
    private final BorrowOrderQueryService queryService;

    @Override
    public BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request, HttpServletRequest httpRequest) {
        return commandService.createBorrowOrder(userId, request, httpRequest);
    }

    @Override
    public BorrowResponseDto createGuestBorrowOrder(library.dto.borrow.GuestBorrowRequestDto request, HttpServletRequest httpRequest) {
        return commandService.createGuestBorrowOrder(request, httpRequest);
    }

    @Override
    public List<BorrowHistoryResponseDto> getBorrowHistory(Integer userId) {
        return queryService.getBorrowHistory(userId);
    }

    @Override
    public BorrowOrderDetailResponseDto getBorrowOrderDetail(String orderCode, Integer userId) {
        return queryService.getBorrowOrderDetail(orderCode, userId);
    }

    @Override
    public List<BorrowOrderDetailResponseDto> getGuestBorrowOrders(String identifier) {
        return queryService.getGuestBorrowOrders(identifier);
    }

    @Override
    public BorrowOrderDetailResponseDto getGuestBorrowOrder(String orderCode, String phone) {
        return queryService.getGuestBorrowOrder(orderCode, phone);
    }

    @Override
    public void cancelBorrowOrder(String orderCode, Integer userId) {
        commandService.cancelBorrowOrder(orderCode, userId);
    }

    @Override
    public BorrowResponseDto renewBorrowOrder(String orderCode, Integer userId, library.dto.borrow.BorrowExtensionRequestDto request, HttpServletRequest httpRequest) {
        return commandService.renewBorrowOrder(orderCode, userId, request, httpRequest);
    }

    @Override
    public Page<UserBorrowHistoryDto> getUserBorrowHistory(Integer customerId, Pageable pageable) {
        return queryService.getUserBorrowHistory(customerId, pageable);
    }

    @Override
    public UserBorrowDetailDto getUserBorrowDetail(Integer customerId, String orderCode) {
        return queryService.getUserBorrowDetail(customerId, orderCode);
    }
}
