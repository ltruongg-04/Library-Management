package library.service.impl;

import library.common.constant.ErrorMessages;
import library.common.exception.CustomBusinessException;
import library.dto.borrow.UserBorrowDetailDto;
import library.dto.borrow.UserBorrowHistoryDto;
import library.entity.BorrowOrderEntity;
import library.repository.BorrowOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class BorrowOrderQueryServiceImpl implements library.service.BorrowOrderQueryService {

    private final BorrowOrderRepository borrowOrderRepository;
    private final library.mapper.BorrowOrderMapper borrowOrderMapper;

    @Override
    @Transactional(readOnly = true)
    public java.util.List<library.dto.borrow.BorrowHistoryResponseDto> getBorrowHistory(Integer userId) {
        java.util.List<BorrowOrderEntity> orders = borrowOrderRepository.findBorrowHistoryByUserId(userId);

        return orders.stream()
                .map(borrowOrderMapper::toBorrowHistoryResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public library.dto.borrow.BorrowOrderDetailResponseDto getBorrowOrderDetail(String orderCode, Integer userId) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerUserId(orderCode, userId)
                .orElseThrow(() -> new CustomBusinessException(
                        ErrorMessages.NOT_FOUND_BORROW_ORDER_NO_PERMISSION, HttpStatus.NOT_FOUND));

        return borrowOrderMapper.toBorrowOrderDetailResponseDto(order);
    }

    @Override
    public Page<UserBorrowHistoryDto> getUserBorrowHistory(Integer customerId, Pageable pageable) {
        return borrowOrderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable)
                .map(borrowOrderMapper::toUserBorrowHistoryDto);
    }

    @Override
    public UserBorrowDetailDto getUserBorrowDetail(Integer customerId, String orderCode) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerId(orderCode, customerId)
                .orElseThrow(() -> new CustomBusinessException(ErrorMessages.NOT_FOUND_BORROW_ORDER, HttpStatus.NOT_FOUND));

        return borrowOrderMapper.toUserBorrowDetailDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<library.dto.borrow.BorrowOrderDetailResponseDto> getGuestBorrowOrders(String identifier) {
        java.util.List<BorrowOrderEntity> orders;
        if (identifier.contains("@")) {
            orders = borrowOrderRepository.findByCustomerEmailOrderByCreatedAtDesc(identifier.toLowerCase());
        } else {
            java.util.Optional<BorrowOrderEntity> orderOpt = borrowOrderRepository.findByOrderCode(identifier);
            orders = orderOpt.map(java.util.Collections::singletonList).orElse(java.util.Collections.emptyList());
        }

        if (orders.isEmpty()) {
            throw new CustomBusinessException(ErrorMessages.NOT_FOUND_BORROW_ORDER_NO_MATCH, HttpStatus.NOT_FOUND);
        }

        return orders.stream().map(borrowOrderMapper::toBorrowOrderDetailResponseDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public library.dto.borrow.BorrowOrderDetailResponseDto getGuestBorrowOrder(String orderCode, String phone) {
        if (orderCode == null || orderCode.isBlank() || phone == null || phone.isBlank()) {
            throw new CustomBusinessException(ErrorMessages.NOT_FOUND_BORROW_ORDER_CHECK_INFO, HttpStatus.NOT_FOUND);
        }

        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerPhone(orderCode.trim(), phone.trim())
                .filter(found -> found.getCustomer() != null && found.getCustomer().getUser() == null)
                .orElseThrow(() -> new CustomBusinessException(ErrorMessages.NOT_FOUND_BORROW_ORDER_CHECK_INFO, HttpStatus.NOT_FOUND));

        return borrowOrderMapper.toBorrowOrderDetailResponseDto(order);
    }
}
