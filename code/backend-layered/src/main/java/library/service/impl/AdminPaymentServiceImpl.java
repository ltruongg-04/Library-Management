package library.service.impl;

import org.springframework.data.domain.Page;
import library.common.exception.CustomBusinessException;
import library.dto.admin.AdminPaymentDto;
import library.entity.PaymentEntity;
import library.entity.PaymentStatus;
import library.entity.UserEntity;
import library.repository.PaymentRepository;
import library.repository.UserRepository;
import library.service.AdminPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminPaymentServiceImpl implements AdminPaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Override
    public Page<AdminPaymentDto> getPayments(int page, int size, String transactionCode) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PaymentEntity> paymentPage;

        if (transactionCode != null && !transactionCode.isEmpty()) {
            paymentPage = paymentRepository.findByTransactionCodeContaining(transactionCode, pageable);
        } else {
            paymentPage = paymentRepository.findAll(pageable);
        }

        return paymentPage.map(this::mapToDto);
    }

    @Override
    @Transactional
    public AdminPaymentDto refundPayment(Integer paymentId, String username) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy giao dịch", HttpStatus.NOT_FOUND));

        if (payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
            throw new CustomBusinessException("Chỉ có thể hoàn tiền các giao dịch đã thanh toán", HttpStatus.BAD_REQUEST);
        }

        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy user", HttpStatus.UNAUTHORIZED));

        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        payment.setProcessedBy(user.getId());
        
        return mapToDto(paymentRepository.save(payment));
    }

    private AdminPaymentDto mapToDto(PaymentEntity entity) {
        String processedByName = null;
        if (entity.getProcessedBy() != null) {
            UserEntity user = userRepository.findById(entity.getProcessedBy()).orElse(null);
            if (user != null) processedByName = user.getFullName();
        }

        return AdminPaymentDto.builder()
                .id(entity.getId())
                .orderCode(entity.getBorrowOrder() != null ? entity.getBorrowOrder().getOrderCode() : null)
                .paymentMethod(entity.getPaymentMethod())
                .transactionCode(entity.getTransactionCode())
                .amount(entity.getAmount())
                .paymentType(entity.getPaymentType())
                .paymentStatus(entity.getPaymentStatus())
                .paymentDate(entity.getPaymentDate())
                .processedByName(processedByName)
                .build();
    }
}
