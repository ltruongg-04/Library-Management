package library.service;

import library.dto.admin.returnbook.AdminReturnBookRequestDto;
import library.dto.admin.returnbook.AdminReturnBookResponseDto;

public interface BookReturnService {
    AdminReturnBookResponseDto returnBooks(AdminReturnBookRequestDto requestDto, String assistantUsername);
    String generateVnPayUrl(Integer bookReturnId, String ipAddress);
    void confirmCashPayment(Integer bookReturnId);
}
