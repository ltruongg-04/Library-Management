package library.service.impl;

import library.dto.admin.AdminBorrowOrderDto;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.service.AdminBorrowService;
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminBorrowServiceImpl implements AdminBorrowService {

    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final library.repository.BorrowExtensionRepository borrowExtensionRepository;
    private final library.service.FeeCalculatorService feeCalculatorService;
    private final SystemLogService systemLogService;
    private final library.service.CacheInvalidationService cacheInvalidationService;
    private final library.mapper.AdminBorrowOrderMapper adminBorrowOrderMapper;
    private final library.repository.PaymentRepository paymentRepository;
    private final library.repository.BookCopyRepository bookCopyRepository;
    private final library.service.EmailService emailService;
    private final library.service.NotificationService notificationService;
    
    // Helpers
    private final library.service.impl.helper.AdminBorrowHelper adminBorrowHelper;

    @Override
    @Transactional(readOnly = true)
    public List<AdminBorrowOrderDto> getAllBorrowOrders() {
        List<BorrowOrderEntity> orders = borrowOrderRepository.findAll();
        orders.sort((o1, o2) -> {
            if (o1.getCreatedAt() == null) return 1;
            if (o2.getCreatedAt() == null) return -1;
            return o2.getCreatedAt().compareTo(o1.getCreatedAt());
        });

        return orders.stream().map(adminBorrowOrderMapper::toAdminBorrowOrderDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminBorrowOrderDto> searchBorrowOrders(String status, String customerType, String keyword, int page, int size) {
        String normalizedStatus = status != null ? status.trim().toUpperCase() : "";
        String normalizedCustomerType = customerType != null ? customerType.trim().toUpperCase() : "ALL";
        String normalizedKeyword = keyword != null ? keyword.trim().toLowerCase() : "";

        return getAllBorrowOrders().stream()
                .filter(order -> normalizedStatus.isEmpty() || order.getStatus().name().equals(normalizedStatus))
                .filter(order -> {
                    if ("GUEST".equals(normalizedCustomerType)) return Boolean.TRUE.equals(order.getIsGuest());
                    if ("CUSTOMER".equals(normalizedCustomerType)) return !Boolean.TRUE.equals(order.getIsGuest());
                    return true;
                })
                .filter(order -> normalizedKeyword.isEmpty()
                        || safe(order.getId()).toLowerCase().contains(normalizedKeyword)
                        || safe(order.getCustomerName()).toLowerCase().contains(normalizedKeyword)
                        || safe(order.getCustomerCode()).toLowerCase().contains(normalizedKeyword)
                        || safe(order.getBookTitle()).toLowerCase().contains(normalizedKeyword))
                .skip((long) Math.max(page, 0) * Math.max(size, 1))
                .limit(Math.max(size, 1))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateBorrowStatus(String orderCode, BorrowOrderStatus newStatus) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Không tìm thấy phiếu mượn",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        order.setStatus(newStatus);

        if (newStatus == BorrowOrderStatus.BORROWED) {
            order.setBorrowDate(LocalDate.now()); // Confirm pickup
        }

        if (newStatus == BorrowOrderStatus.RETURNED) {
            order.setActualReturnDate(LocalDate.now()); // Confirm return date
            
            // Tính lại phí thuê theo ngày thực tế mượn
            LocalDate feeStartDate = order.getBorrowDate() != null ? order.getBorrowDate() : order.getPickupDate();
            long actualDays = feeStartDate != null ? java.time.temporal.ChronoUnit.DAYS.between(feeStartDate, LocalDate.now()) : 1;
            if (actualDays <= 0) actualDays = 1;
            
            List<BorrowOrderDetailEntity> details = borrowOrderDetailRepository.findByBorrowOrderId(order.getId());
            java.math.BigDecimal rentalFeePerBook = feeCalculatorService.calculateRentalFee(feeStartDate, LocalDate.now(), 1);
            java.math.BigDecimal totalRentalFee = rentalFeePerBook.multiply(new java.math.BigDecimal(details.size()));
            
            for (BorrowOrderDetailEntity detail : details) {
                detail.setRentalFee(rentalFeePerBook);
            }
            order.setSubtotalFee(totalRentalFee);
            
            // Solidify penalty if overdue
            java.math.BigDecimal overdueFee = feeCalculatorService.calculateOverdueFee(order.getDueDate(), LocalDate.now());
            if (overdueFee.compareTo(java.math.BigDecimal.ZERO) > 0) {
                java.math.BigDecimal currentTotalFee = order.getTotalFee() != null ? order.getTotalFee() : (order.getSubtotalFee() != null ? order.getSubtotalFee() : java.math.BigDecimal.ZERO);
                order.setTotalFee(currentTotalFee.add(overdueFee));
            }
        }

        if (newStatus == BorrowOrderStatus.RETURNED || newStatus == BorrowOrderStatus.CANCELLED) {
            List<BorrowOrderDetailEntity> details = borrowOrderDetailRepository.findByBorrowOrderId(order.getId());
            for (BorrowOrderDetailEntity detail : details) {
                if (detail.getBookCopy() != null) {
                    library.entity.BookCopyEntity copy = detail.getBookCopy();
                    copy.setStatus(library.entity.BookCopyStatus.AVAILABLE);
                    // Saving copy might not be strictly necessary if it's cascade persisted or we
                    // use copyRepository,
                    // but it's managed so hibernate will update it.
                }
                if (newStatus == BorrowOrderStatus.RETURNED) {
                    detail.setStatus(library.entity.BorrowOrderDetailStatus.RETURNED);
                } else if (newStatus == BorrowOrderStatus.CANCELLED) {
                    detail.setStatus(library.entity.BorrowOrderDetailStatus.CANCELLED);
                }
            }
        }

        borrowOrderRepository.save(order);
        systemLogService.logAction("Cập nhật trạng thái đơn mượn", "Admin cập nhật đơn " + orderCode + " thành " + newStatus.name());
        cacheInvalidationService.evictBookCaches();
    }

    @Override
    @Transactional
    public void approveBorrow(String orderCode) {
        BorrowOrderEntity order = getOrder(orderCode);
        if (order.getStatus() != BorrowOrderStatus.PENDING) {
            throw new library.common.exception.CustomBusinessException("Chỉ phiếu chờ duyệt mới có thể duyệt",
                    org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        order.setStatus(BorrowOrderStatus.READY);
        borrowOrderRepository.save(order);
        notifyBorrowStatus(order, "Phiếu mượn đã được duyệt", "Sách đã sẵn sàng để lấy tại thư viện.", "READY", null);
        systemLogService.logAction("Duyệt phiếu mượn", "Admin duyệt phiếu mượn: " + orderCode);
        cacheInvalidationService.evictBookCaches();
    }

    @Override
    @Transactional
    public void rejectBorrow(String orderCode, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new library.common.exception.CustomBusinessException("Lý do từ chối là bắt buộc",
                    org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        BorrowOrderEntity order = getOrder(orderCode);
        if (order.getStatus() != BorrowOrderStatus.PENDING && order.getStatus() != BorrowOrderStatus.READY) {
            throw new library.common.exception.CustomBusinessException("Chỉ phiếu chờ duyệt hoặc chờ lấy mới có thể từ chối",
                    org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        order.setStatus(BorrowOrderStatus.REJECTED);
        releaseCopies(order, library.entity.BorrowOrderDetailStatus.CANCELLED);
        borrowOrderRepository.save(order);
        notifyBorrowStatus(order, "Phiếu mượn đã bị từ chối", reason, "REJECTED", reason);
        systemLogService.logAction("Từ chối phiếu mượn", "Admin từ chối phiếu mượn: " + orderCode + ". Lý do: " + reason);
        cacheInvalidationService.evictBookCaches();
    }

    @Override
    @Transactional
    public void confirmPickup(String orderCode) {
        BorrowOrderEntity order = getOrder(orderCode);
        if (order.getStatus() != BorrowOrderStatus.READY) {
            throw new library.common.exception.CustomBusinessException("Chỉ phiếu chờ lấy sách mới có thể xác nhận giao sách",
                    org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        order.setStatus(BorrowOrderStatus.BORROWED);
        order.setBorrowDate(LocalDate.now());
        for (BorrowOrderDetailEntity detail : borrowOrderDetailRepository.findByBorrowOrderId(order.getId())) {
            if (detail.getBookCopy() != null) {
                detail.getBookCopy().setStatus(library.entity.BookCopyStatus.BORROWED);
                bookCopyRepository.save(detail.getBookCopy());
            }
        }

        if (order.getCustomer() != null && order.getCustomer().getUser() == null) {
            recordGuestCashDeposit(order);
        }

        borrowOrderRepository.save(order);
        notifyBorrowStatus(order, "Đã xác nhận giao sách", "Phiếu mượn đã chuyển sang trạng thái đang mượn.", "BORROWED", null);
        systemLogService.logAction("Xác nhận giao sách", "Admin xác nhận giao sách cho phiếu: " + orderCode);
        cacheInvalidationService.evictBookCaches();
    }

    @Override
    @Transactional(readOnly = true)
    public library.dto.admin.AdminBorrowOrderDetailDto getBorrowOrderDetail(String orderCode) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Không tìm thấy phiếu mượn",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        return adminBorrowOrderMapper.toAdminBorrowOrderDetailDto(order);
    }

    @Override
    @Transactional
    public AdminBorrowOrderDto createBorrowOrder(library.dto.admin.AdminCreateBorrowOrderRequest request) {
        library.entity.CustomerEntity customer = adminBorrowHelper.getOrCreateCustomer(request.getPhone(), request.getFullName(), request.getEmail());

        int maxBooks = feeCalculatorService.getActivePolicy().getMaxBooks() != null ? feeCalculatorService.getActivePolicy().getMaxBooks() : 5;
        if (request.getBookBarcodes() != null && request.getBookBarcodes().size() > maxBooks) {
            throw new library.common.exception.CustomBusinessException("Số sách mượn không được vượt quá " + maxBooks + " quyển",
                    org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        java.math.BigDecimal[] depositRef = new java.math.BigDecimal[1];
        java.util.List<library.entity.BookCopyEntity> copiesToBorrow = adminBorrowHelper.validateAndGetBookCopies(request.getBookBarcodes(), depositRef);
        java.math.BigDecimal totalDeposit = depositRef[0];

        String orderCode = "BO-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Tính phí thuê dựa trên ngày mượn đến ngày hẹn trả
        int numberOfBooks = copiesToBorrow.size();
        java.math.BigDecimal totalRentalFee = feeCalculatorService.calculateRentalFee(LocalDate.now(), request.getDueDate(), numberOfBooks);

        BorrowOrderEntity borrowOrder = BorrowOrderEntity.builder()
                .orderCode(orderCode)
                .customer(customer)
                .borrowDate(LocalDate.now())
                .pickupDate(LocalDate.now())
                .dueDate(request.getDueDate())
                .status(BorrowOrderStatus.BORROWED)
                .subtotalFee(totalRentalFee)
                .discountPercent(java.math.BigDecimal.ZERO)
                .discountAmount(java.math.BigDecimal.ZERO)
                .totalFee(totalRentalFee)
                .totalDeposit(totalDeposit)
                .build();

        BorrowOrderEntity savedOrder = borrowOrderRepository.save(borrowOrder);

        // Tính phí thuê per book = totalRentalFee / numberOfBooks
        java.math.BigDecimal rentalFeePerBook = feeCalculatorService.calculateRentalFee(LocalDate.now(), request.getDueDate(), 1);
        String[] bookInfos = adminBorrowHelper.processBookCopiesForOrder(copiesToBorrow, savedOrder, rentalFeePerBook);
        String firstBookTitle = bookInfos[0];
        String firstBookAuthor = bookInfos[1];

        systemLogService.logAction("Tạo đơn mượn", "Admin tạo đơn mượn: " + orderCode + " cho khách: " + customer.getPhone());
        cacheInvalidationService.evictBookCaches();

        return AdminBorrowOrderDto.builder()
                .id(savedOrder.getOrderCode())
                .customerName(customer.getFullName())
                .customerCode(customer.getLibraryCardNo() != null ? customer.getLibraryCardNo() : customer.getPhone())
                .bookTitle(firstBookTitle
                        + (copiesToBorrow.size() > 1 ? " (và " + (copiesToBorrow.size() - 1) + " sách khác)" : ""))
                .bookAuthor(firstBookAuthor)
                .borrowDate(savedOrder.getBorrowDate())
                .dueDate(savedOrder.getDueDate())
                .status(savedOrder.getStatus())
                .overdayCount(null)
                .build();
    }

    @Override
    @Transactional
    public void processRenewal(String orderCode, library.dto.admin.AdminRenewalRequestDto request) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Không tìm thấy phiếu mượn",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        // Bỏ check PENDING_RENEWAL ở đây, chỉ cần có BorrowExtensionEntity trạng thái PENDING là đủ để duyệt gia hạn.

        library.entity.BorrowExtensionEntity extension = borrowExtensionRepository
                .findFirstByBorrowOrderIdAndStatusOrderByRequestedAtDesc(order.getId(), library.entity.BorrowExtensionStatus.PENDING)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Không tìm thấy yêu cầu gia hạn đang chờ xử lý",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        if (request.isApproved()) {
            extension.setStatus(library.entity.BorrowExtensionStatus.APPROVED);
            
            // Calculate penalty if they were overdue when requested
            LocalDate requestedDate = extension.getRequestedAt().toLocalDate();
            LocalDate oldDueDate = order.getDueDate();
            if (oldDueDate != null && requestedDate.isAfter(oldDueDate)) {
                long overdueDays = java.time.temporal.ChronoUnit.DAYS.between(order.getDueDate(), requestedDate);
                if (overdueDays > 0) {
                    java.math.BigDecimal overdueFee = feeCalculatorService.calculateOverdueFee(order.getDueDate(), requestedDate);
                    
                    java.math.BigDecimal currentTotalFee = order.getTotalFee() != null ? order.getTotalFee() : (order.getSubtotalFee() != null ? order.getSubtotalFee() : java.math.BigDecimal.ZERO);
                    order.setTotalFee(currentTotalFee.add(overdueFee));
                }
            }
            
            // Calculate extension fee
            LocalDate baseDate = oldDueDate;
            if (baseDate == null || baseDate.isBefore(requestedDate)) {
                baseDate = requestedDate;
            }
            long extensionDays = java.time.temporal.ChronoUnit.DAYS.between(baseDate, extension.getRequestedDueDate());
            if (extensionDays > 0) {
                // extensionFee corresponds to the rental fee for the extended days
                int numberOfBooks = borrowOrderDetailRepository.findByBorrowOrderId(order.getId()).size();
                java.math.BigDecimal extensionFee = feeCalculatorService.calculateRentalFee(baseDate, extension.getRequestedDueDate(), numberOfBooks);
                order.addExtensionFee(extensionFee);
            }

            order.approveExtension(extension.getRequestedDueDate());
        } else {
            extension.setStatus(library.entity.BorrowExtensionStatus.REJECTED);
            order.rejectExtensionRevertStatus();
        }

        borrowExtensionRepository.save(extension);
        borrowOrderRepository.save(order);
        systemLogService.logAction("Xử lý gia hạn đơn mượn", "Admin " + (request.isApproved() ? "duyệt" : "từ chối") + " gia hạn đơn " + orderCode);
        cacheInvalidationService.evictDashboardCaches();
    }

    private BorrowOrderEntity getOrder(String orderCode) {
        return borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Không tìm thấy phiếu mượn",
                        org.springframework.http.HttpStatus.NOT_FOUND));
    }

    private void releaseCopies(BorrowOrderEntity order, library.entity.BorrowOrderDetailStatus detailStatus) {
        for (BorrowOrderDetailEntity detail : borrowOrderDetailRepository.findByBorrowOrderId(order.getId())) {
            detail.setStatus(detailStatus);
            borrowOrderDetailRepository.save(detail);
            if (detail.getBookCopy() != null) {
                detail.getBookCopy().setStatus(library.entity.BookCopyStatus.AVAILABLE);
                bookCopyRepository.save(detail.getBookCopy());
            }
        }
    }

    private void recordGuestCashDeposit(BorrowOrderEntity order) {
        java.math.BigDecimal deposit = order.getTotalDeposit() != null ? order.getTotalDeposit() : java.math.BigDecimal.ZERO;
        if (deposit.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            return;
        }

        boolean alreadyRecorded = paymentRepository.findByBorrowOrderIdAndPaymentStatus(order.getId(), library.entity.PaymentStatus.SUCCESS)
                .stream()
                .anyMatch(payment -> payment.getPaymentType() == library.entity.PaymentType.DEPOSIT
                        && payment.getPaymentMethod() == library.entity.PaymentMethod.CASH);
        if (alreadyRecorded) {
            return;
        }

        paymentRepository.save(library.entity.PaymentEntity.builder()
                .borrowOrder(order)
                .paymentMethod(library.entity.PaymentMethod.CASH)
                .transactionCode("CASH_DEPOSIT_" + order.getOrderCode())
                .amount(deposit)
                .paymentType(library.entity.PaymentType.DEPOSIT)
                .paymentStatus(library.entity.PaymentStatus.SUCCESS)
                .paymentDate(java.time.LocalDateTime.now())
                .build());
    }

    private void notifyBorrowStatus(BorrowOrderEntity order, String title, String content, String status, String reason) {
        if (order.getCustomer() == null) {
            return;
        }

        if (order.getCustomer().getUser() != null) {
            notificationService.createForUser(order.getCustomer().getUser(), title, content, "BORROW");
        }

        if (order.getCustomer().getUser() == null && order.getCustomer().getEmail() != null) {
            emailService.sendGuestBorrowStatusEmail(
                    order.getCustomer().getEmail(),
                    order.getCustomer().getFullName(),
                    order.getOrderCode(),
                    status,
                    reason);
        }
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
