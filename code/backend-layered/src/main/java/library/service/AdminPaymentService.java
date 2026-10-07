package library.service;

import org.springframework.data.domain.Page;
import library.dto.admin.AdminPaymentDto;

public interface AdminPaymentService {
    Page<AdminPaymentDto> getPayments(int page, int size, String transactionCode);
    AdminPaymentDto refundPayment(Integer paymentId, String username);
}
