package library.service.impl.helper;

import library.common.exception.CustomBusinessException;
import library.entity.BookCopyEntity;
import library.entity.BookCopyStatus;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderDetailStatus;
import library.entity.BorrowOrderEntity;
import library.entity.CustomerEntity;
import library.repository.BookCopyRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AdminBorrowHelper {

    private final CustomerRepository customerRepository;
    private final BookCopyRepository bookCopyRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;

    public CustomerEntity getOrCreateCustomer(String phone, String fullName, String email) {
        return customerRepository.findByLibraryCardNoOrPhone(phone)
                .orElseGet(() -> {
                    if (phone == null || phone.trim().isEmpty()) {
                        throw new CustomBusinessException("Số điện thoại là bắt buộc", HttpStatus.BAD_REQUEST);
                    }
                    CustomerEntity newCustomer = CustomerEntity.builder()
                            .phone(phone)
                            .fullName(fullName != null && !fullName.trim().isEmpty() ? fullName : "Khách vãng lai")
                            .email(email)
                            .address("Tại quầy")
                            .build();
                    return customerRepository.save(newCustomer);
                });
    }

    public List<BookCopyEntity> validateAndGetBookCopies(List<String> barcodes, BigDecimal[] totalDepositOut) {
        if (barcodes == null || barcodes.isEmpty()) {
            throw new CustomBusinessException("Vui lòng nhập ít nhất một mã vạch sách", HttpStatus.BAD_REQUEST);
        }

        BigDecimal totalDeposit = BigDecimal.ZERO;
        List<BookCopyEntity> copiesToBorrow = new ArrayList<>();

        for (String barcode : barcodes) {
            BookCopyEntity copy = bookCopyRepository.findByBarcode(barcode)
                    .orElseThrow(() -> new CustomBusinessException(
                            "Không tìm thấy bản sao sách: " + barcode, HttpStatus.NOT_FOUND));

            if (copy.getStatus() != BookCopyStatus.AVAILABLE) {
                throw new CustomBusinessException(
                        "Bản sao sách không sẵn sàng để mượn: " + barcode + " (Trạng thái: " + copy.getStatus() + ")",
                        HttpStatus.BAD_REQUEST);
            }

            copiesToBorrow.add(copy);
            if (copy.getBook() != null && copy.getBook().getDepositPrice() != null) {
                totalDeposit = totalDeposit.add(copy.getBook().getDepositPrice());
            }
        }
        totalDepositOut[0] = totalDeposit;
        return copiesToBorrow;
    }

    public String[] processBookCopiesForOrder(List<BookCopyEntity> copiesToBorrow, BorrowOrderEntity savedOrder, BigDecimal rentalFeePerBook) {
        String firstBookTitle = "Chưa cập nhật";
        String firstBookAuthor = "Chưa cập nhật";

        for (BookCopyEntity copy : copiesToBorrow) {
            copy.setStatus(BookCopyStatus.BORROWED);
            bookCopyRepository.save(copy);

            BigDecimal depositPrice = copy.getBook() != null && copy.getBook().getDepositPrice() != null
                    ? copy.getBook().getDepositPrice()
                    : BigDecimal.ZERO;

            BorrowOrderDetailEntity detail = BorrowOrderDetailEntity.builder()
                    .borrowOrder(savedOrder)
                    .bookCopy(copy)
                    .rentalFee(rentalFeePerBook)
                    .depositPrice(depositPrice)
                    .status(BorrowOrderDetailStatus.BORROWING)
                    .build();
            borrowOrderDetailRepository.save(detail);

            if (firstBookTitle.equals("Chưa cập nhật") && copy.getBook() != null) {
                firstBookTitle = copy.getBook().getTitle();
                if (copy.getBook().getAuthors() != null && !copy.getBook().getAuthors().isEmpty()) {
                    firstBookAuthor = copy.getBook().getAuthors().iterator().next().getName();
                }
            }
        }

        return new String[]{firstBookTitle, firstBookAuthor};
    }
}
