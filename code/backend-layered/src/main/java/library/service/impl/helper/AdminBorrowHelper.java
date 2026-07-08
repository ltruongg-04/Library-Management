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
                        throw new CustomBusinessException("Phone number is required", HttpStatus.BAD_REQUEST);
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
            throw new CustomBusinessException("At least one book barcode is required", HttpStatus.BAD_REQUEST);
        }

        BigDecimal totalDeposit = BigDecimal.ZERO;
        List<BookCopyEntity> copiesToBorrow = new ArrayList<>();

        for (String barcode : barcodes) {
            BookCopyEntity copy = bookCopyRepository.findByBarcode(barcode)
                    .orElseThrow(() -> new CustomBusinessException(
                            "Book copy not found: " + barcode, HttpStatus.NOT_FOUND));

            if (copy.getStatus() != BookCopyStatus.AVAILABLE) {
                throw new CustomBusinessException(
                        "Book copy is not available: " + barcode + " (Status: " + copy.getStatus() + ")",
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
        String firstBookTitle = "N/A";
        String firstBookAuthor = "N/A";

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

            if (firstBookTitle.equals("N/A") && copy.getBook() != null) {
                firstBookTitle = copy.getBook().getTitle();
                if (copy.getBook().getAuthors() != null && !copy.getBook().getAuthors().isEmpty()) {
                    firstBookAuthor = copy.getBook().getAuthors().iterator().next().getName();
                }
            }
        }

        return new String[]{firstBookTitle, firstBookAuthor};
    }
}
