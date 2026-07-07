package library.mapper;

import library.dto.admin.returnbook.AdminReturnBookResponseDto;
import library.dto.admin.returnbook.FineDto;
import library.dto.admin.returnbook.ReturnDetailDto;
import library.entity.BookReturnDetailEntity;
import library.entity.BookReturnEntity;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderEntity;
import library.entity.FineEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class BookReturnMapper {

    public AdminReturnBookResponseDto toAdminReturnBookResponseDto(BookReturnEntity bookReturn, FineEntity fine) {
        if (bookReturn == null) return null;

        AdminReturnBookResponseDto response = new AdminReturnBookResponseDto();
        response.setBookReturnId(bookReturn.getId());
        response.setBorrowOrderId(bookReturn.getBorrowOrder().getId());
        response.setReturnDate(bookReturn.getReturnDate());
        response.setOverdueDays(bookReturn.getOverdueDays());
        response.setTotalFineAmount(bookReturn.getTotalFineAmount());
        response.setNote(bookReturn.getNote());

        BorrowOrderEntity order = bookReturn.getBorrowOrder();
        response.setOrderCode(order.getOrderCode());

        BigDecimal thisReturnRentalFee = BigDecimal.ZERO;
        BigDecimal thisReturnDeposit = BigDecimal.ZERO;
        List<ReturnDetailDto> detailsDto = new ArrayList<>();

        if (bookReturn.getDetails() != null) {
            for (BookReturnDetailEntity detail : bookReturn.getDetails()) {
                ReturnDetailDto dto = new ReturnDetailDto();
                dto.setBookTitle(detail.getBookCopy().getBook().getTitle());
                dto.setBarcode(detail.getBookCopy().getBarcode());
                dto.setConditionStatus(detail.getConditionStatus());
                dto.setFineAmount(detail.getFineAmount());
                dto.setNote(detail.getNote());
                detailsDto.add(dto);

                for (BorrowOrderDetailEntity od : order.getOrderDetails()) {
                    if (od.getBookCopy().getId().equals(detail.getBookCopy().getId())) {
                        thisReturnRentalFee = thisReturnRentalFee.add(od.getRentalFee() != null ? od.getRentalFee() : BigDecimal.ZERO);
                        thisReturnDeposit = thisReturnDeposit.add(od.getDepositPrice() != null ? od.getDepositPrice() : BigDecimal.ZERO);
                        break;
                    }
                }
            }
        }
        
        BigDecimal fineAmt = bookReturn.getTotalFineAmount() != null ? bookReturn.getTotalFineAmount() : BigDecimal.ZERO;

        response.setSubtotalFee(thisReturnRentalFee);
        response.setTotalDeposit(thisReturnDeposit);
        response.setTotalAmountToPay(thisReturnRentalFee.add(fineAmt).subtract(thisReturnDeposit));
        response.setDetails(detailsDto);

        if (fine != null) {
            FineDto fineDto = new FineDto();
            fineDto.setId(fine.getId());
            fineDto.setCustomerId(fine.getCustomer().getId());
            fineDto.setAmount(fine.getAmount());
            fineDto.setStatus(fine.getStatus());
            fineDto.setCreatedAt(fine.getCreatedAt());
            response.setFine(fineDto);
        }

        return response;
    }
}
