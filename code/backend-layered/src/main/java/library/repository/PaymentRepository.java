package library.repository;

import library.entity.PaymentEntity;
import library.entity.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {

    Optional<PaymentEntity> findByBorrowOrderOrderCode(String orderCode);

    Optional<PaymentEntity> findByTransactionCode(String transactionCode);

    Optional<PaymentEntity> findByBorrowOrderIdAndPaymentType(Integer borrowOrderId, PaymentType paymentType);

    java.util.List<PaymentEntity> findByBorrowOrderIdAndPaymentStatus(Integer borrowOrderId, library.entity.PaymentStatus paymentStatus);
}

