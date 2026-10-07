package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.admin.AdminCreateStockReceiptRequest;
import library.dto.admin.AdminStockReceiptDetailDto;
import library.dto.admin.AdminStockReceiptDto;
import library.entity.*;
import library.repository.*;
import library.service.AdminStockReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminStockReceiptServiceImpl implements AdminStockReceiptService {

    private final StockReceiptRepository stockReceiptRepository;
    private final StockReceiptDetailRepository stockReceiptDetailRepository;
    private final SupplierRepository supplierRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;

    @Override
    public List<AdminStockReceiptDto> getAllReceipts() {
        return stockReceiptRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public AdminStockReceiptDto getReceiptDetail(Integer id) {
        StockReceiptEntity receipt = stockReceiptRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy phiếu nhập", HttpStatus.NOT_FOUND));
        return mapToDto(receipt);
    }

    @Override
    @Transactional
    public AdminStockReceiptDto createReceipt(AdminCreateStockReceiptRequest request, String username) {
        SupplierEntity supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy nhà cung cấp", HttpStatus.NOT_FOUND));
        
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy người dùng", HttpStatus.UNAUTHORIZED));

        String receiptCode = "PN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        StockReceiptEntity receipt = StockReceiptEntity.builder()
                .receiptCode(receiptCode)
                .supplier(supplier)
                .createdBy(user)
                .note(request.getNote())
                .totalAmount(BigDecimal.ZERO)
                .build();
                
        StockReceiptEntity savedReceipt = stockReceiptRepository.save(receipt);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (AdminCreateStockReceiptRequest.DetailRequest detailReq : request.getDetails()) {
            BookEntity book = bookRepository.findById(detailReq.getBookId())
                    .orElseThrow(() -> new CustomBusinessException("Không tìm thấy sách ID: " + detailReq.getBookId(), HttpStatus.NOT_FOUND));
            
            BigDecimal detailTotal = detailReq.getUnitPrice().multiply(new BigDecimal(detailReq.getQuantity()));
            totalAmount = totalAmount.add(detailTotal);
            
            StockReceiptDetailEntity detail = StockReceiptDetailEntity.builder()
                    .stockReceipt(savedReceipt)
                    .book(book)
                    .quantity(detailReq.getQuantity())
                    .unitPrice(detailReq.getUnitPrice())
                    .totalPrice(detailTotal)
                    .build();
            stockReceiptDetailRepository.save(detail);
            
            // Book quantity and availableQuantity are calculated by @Formula based on BookCopies,
            // so we don't need to manually update them here.
            
            // Generate BookCopies
            for (int i = 0; i < detailReq.getQuantity(); i++) {
                String barcode = "BC-" + book.getId() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                BookCopyEntity copy = BookCopyEntity.builder()
                        .book(book)
                        .barcode(barcode)
                        .status(BookCopyStatus.AVAILABLE)
                        .build();
                bookCopyRepository.save(copy);
            }
        }
        
        savedReceipt.setTotalAmount(totalAmount);
        stockReceiptRepository.save(savedReceipt);
        
        return getReceiptDetail(savedReceipt.getId());
    }
    
    private AdminStockReceiptDto mapToDto(StockReceiptEntity entity) {
        List<StockReceiptDetailEntity> details = stockReceiptDetailRepository.findByStockReceiptId(entity.getId());
        
        List<AdminStockReceiptDetailDto> detailDtos = details.stream().map(d -> AdminStockReceiptDetailDto.builder()
                .id(d.getId())
                .bookId(d.getBook().getId())
                .bookTitle(d.getBook().getTitle())
                .quantity(d.getQuantity())
                .unitPrice(d.getUnitPrice())
                .totalPrice(d.getTotalPrice())
                .build()).collect(Collectors.toList());
                
        return AdminStockReceiptDto.builder()
                .id(entity.getId())
                .receiptCode(entity.getReceiptCode())
                .supplierName(entity.getSupplier().getName())
                .supplierId(entity.getSupplier().getId())
                .totalAmount(entity.getTotalAmount())
                .note(entity.getNote())
                .createdBy(entity.getCreatedBy().getFullName())
                .createdAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : "")
                .details(detailDtos)
                .build();
    }
}
