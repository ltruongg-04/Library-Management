package library.service.impl;

import library.dto.admin.AdminBorrowOrderDto;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.service.AdminBorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminBorrowServiceImpl implements AdminBorrowService {

    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final library.repository.CustomerRepository customerRepository;
    private final library.repository.BookCopyRepository bookCopyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdminBorrowOrderDto> getAllBorrowOrders() {
        List<BorrowOrderEntity> orders = borrowOrderRepository.findAll();

        return orders.stream().map(order -> {
            List<BorrowOrderDetailEntity> details = borrowOrderDetailRepository.findByBorrowOrderId(order.getId());

            String bookTitle = "N/A";
            String bookAuthor = "N/A";

            if (!details.isEmpty()) {
                BorrowOrderDetailEntity firstDetail = details.get(0);
                if (firstDetail.getBookCopy() != null && firstDetail.getBookCopy().getBook() != null) {
                    bookTitle = firstDetail.getBookCopy().getBook().getTitle();
                    // Assuming Author list is accessed, get the first author if available.
                    // For simplicity, we just leave it as N/A if it's complex, or if BookEntity has
                    // authors
                    if (firstDetail.getBookCopy().getBook().getAuthors() != null
                            && !firstDetail.getBookCopy().getBook().getAuthors().isEmpty()) {
                        bookAuthor = firstDetail.getBookCopy().getBook().getAuthors().iterator().next().getName();
                    }
                }
            }

            // Calculate overday
            Integer overdayCount = null;
            if (order.getStatus() == BorrowOrderStatus.BORROWED && order.getDueDate() != null) {
                long days = ChronoUnit.DAYS.between(order.getDueDate(), LocalDate.now());
                if (days > 0) {
                    overdayCount = (int) days;
                    // Note: Could also update status to OVERDUE here, but usually done via a batch
                    // job.
                }
            } else if (order.getStatus() == BorrowOrderStatus.OVERDUE && order.getDueDate() != null) {
                long days = ChronoUnit.DAYS.between(order.getDueDate(), LocalDate.now());
                if (days > 0) {
                    overdayCount = (int) days;
                }
            }

            return AdminBorrowOrderDto.builder()
                    .id(order.getOrderCode())
                    .customerName(order.getCustomer() != null ? order.getCustomer().getFullName() : "Unknown")
                    .customerCode(order.getCustomer() != null
                            ? order.getCustomer().getLibraryCardNo() != null ? order.getCustomer().getLibraryCardNo()
                                    : order.getCustomer().getPhone()
                            : "N/A")
                    .bookTitle(bookTitle)
                    .bookAuthor(bookAuthor)
                    .borrowDate(order.getBorrowDate())
                    .dueDate(order.getDueDate())
                    .status(order.getStatus())
                    .overdayCount(overdayCount)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateBorrowStatus(String orderCode, BorrowOrderStatus newStatus) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Borrow order not found",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        order.setStatus(newStatus);

        if (newStatus == BorrowOrderStatus.BORROWED) {
            order.setBorrowDate(LocalDate.now()); // Confirm pickup
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
    }

    @Override
    @Transactional(readOnly = true)
    public library.dto.admin.AdminBorrowOrderDetailDto getBorrowOrderDetail(String orderCode) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Borrow order not found",
                        org.springframework.http.HttpStatus.NOT_FOUND));

        List<BorrowOrderDetailEntity> details = borrowOrderDetailRepository.findByBorrowOrderId(order.getId());

        List<library.dto.admin.BorrowItemDto> items = details.stream().map(detail -> {
            String title = "N/A";
            String author = "N/A";
            String barcode = "N/A";

            if (detail.getBookCopy() != null) {
                barcode = detail.getBookCopy().getBarcode();
                if (detail.getBookCopy().getBook() != null) {
                    title = detail.getBookCopy().getBook().getTitle();
                    if (detail.getBookCopy().getBook().getAuthors() != null
                            && !detail.getBookCopy().getBook().getAuthors().isEmpty()) {
                        author = detail.getBookCopy().getBook().getAuthors().iterator().next().getName();
                    }
                }
            }

            return library.dto.admin.BorrowItemDto.builder()
                    .id(detail.getId())
                    .bookTitle(title)
                    .bookAuthor(author)
                    .barcode(barcode)
                    .rentalFee(detail.getRentalFee())
                    .depositPrice(detail.getDepositPrice())
                    .status(detail.getStatus())
                    .build();
        }).collect(Collectors.toList());

        return library.dto.admin.AdminBorrowOrderDetailDto.builder()
                .orderCode(order.getOrderCode())
                .borrowDate(order.getBorrowDate())
                .pickupDate(order.getPickupDate())
                .dueDate(order.getDueDate())
                .status(order.getStatus())
                .subtotalFee(order.getSubtotalFee())
                .discountAmount(order.getDiscountAmount())
                .totalFee(order.getTotalFee())
                .totalDeposit(order.getTotalDeposit())
                .customerName(order.getCustomer() != null ? order.getCustomer().getFullName() : "Unknown")
                .customerCode(order.getCustomer() != null
                        ? (order.getCustomer().getLibraryCardNo() != null ? order.getCustomer().getLibraryCardNo()
                                : order.getCustomer().getPhone())
                        : "N/A")
                .customerPhone(order.getCustomer() != null ? order.getCustomer().getPhone() : "N/A")
                .items(items)
                .build();
    }

    @Override
    @Transactional
    public AdminBorrowOrderDto createBorrowOrder(library.dto.admin.AdminCreateBorrowOrderRequest request) {
        library.entity.CustomerEntity customer = customerRepository.findByLibraryCardNoOrPhone(request.getPhone())
                .orElseGet(() -> {
                    if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                        throw new library.common.exception.CustomBusinessException("Phone number is required",
                                org.springframework.http.HttpStatus.BAD_REQUEST);
                    }
                    library.entity.CustomerEntity newCustomer = library.entity.CustomerEntity.builder()
                            .phone(request.getPhone())
                            .fullName(request.getFullName() != null && !request.getFullName().trim().isEmpty()
                                    ? request.getFullName()
                                    : "Khách vãng lai")
                            .email(request.getEmail())
                            .address("Tại quầy")
                            .build();
                    return customerRepository.save(newCustomer);
                });

        if (request.getBookBarcodes() == null || request.getBookBarcodes().isEmpty()) {
            throw new library.common.exception.CustomBusinessException("At least one book barcode is required",
                    org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        java.math.BigDecimal totalDeposit = java.math.BigDecimal.ZERO;
        java.util.List<library.entity.BookCopyEntity> copiesToBorrow = new java.util.ArrayList<>();

        for (String barcode : request.getBookBarcodes()) {
            library.entity.BookCopyEntity copy = bookCopyRepository.findByBarcode(barcode)
                    .orElseThrow(() -> new library.common.exception.CustomBusinessException(
                            "Book copy not found: " + barcode, org.springframework.http.HttpStatus.NOT_FOUND));

            if (copy.getStatus() != library.entity.BookCopyStatus.AVAILABLE) {
                throw new library.common.exception.CustomBusinessException(
                        "Book copy is not available: " + barcode + " (Status: " + copy.getStatus() + ")",
                        org.springframework.http.HttpStatus.BAD_REQUEST);
            }

            copiesToBorrow.add(copy);
            if (copy.getBook() != null && copy.getBook().getDepositPrice() != null) {
                totalDeposit = totalDeposit.add(copy.getBook().getDepositPrice());
            }
        }

        String orderCode = "BO-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        BorrowOrderEntity borrowOrder = BorrowOrderEntity.builder()
                .orderCode(orderCode)
                .customer(customer)
                .borrowDate(LocalDate.now())
                .pickupDate(LocalDate.now())
                .dueDate(request.getDueDate())
                .status(BorrowOrderStatus.BORROWED)
                .subtotalFee(java.math.BigDecimal.ZERO)
                .discountPercent(java.math.BigDecimal.ZERO)
                .discountAmount(java.math.BigDecimal.ZERO)
                .totalFee(java.math.BigDecimal.ZERO)
                .totalDeposit(totalDeposit)
                .build();

        BorrowOrderEntity savedOrder = borrowOrderRepository.save(borrowOrder);

        String firstBookTitle = "N/A";
        String firstBookAuthor = "N/A";

        for (library.entity.BookCopyEntity copy : copiesToBorrow) {
            copy.setStatus(library.entity.BookCopyStatus.BORROWED);
            bookCopyRepository.save(copy);

            java.math.BigDecimal depositPrice = copy.getBook() != null && copy.getBook().getDepositPrice() != null
                    ? copy.getBook().getDepositPrice()
                    : java.math.BigDecimal.ZERO;

            BorrowOrderDetailEntity detail = BorrowOrderDetailEntity.builder()
                    .borrowOrder(savedOrder)
                    .bookCopy(copy)
                    .rentalFee(java.math.BigDecimal.ZERO)
                    .depositPrice(depositPrice)
                    .status(library.entity.BorrowOrderDetailStatus.BORROWING)
                    .build();
            borrowOrderDetailRepository.save(detail);

            if (firstBookTitle.equals("N/A") && copy.getBook() != null) {
                firstBookTitle = copy.getBook().getTitle();
                if (copy.getBook().getAuthors() != null && !copy.getBook().getAuthors().isEmpty()) {
                    firstBookAuthor = copy.getBook().getAuthors().iterator().next().getName();
                }
            }
        }

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
}
