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

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT p FROM PaymentEntity p WHERE p.transactionCode = :transactionCode")
    Optional<PaymentEntity> findByTransactionCodeForUpdate(@org.springframework.data.repository.query.Param("transactionCode") String transactionCode);

    Optional<PaymentEntity> findByBorrowOrderIdAndPaymentType(Integer borrowOrderId, PaymentType paymentType);

    java.util.List<PaymentEntity> findByBorrowOrderIdAndPaymentStatus(Integer borrowOrderId, library.entity.PaymentStatus paymentStatus);

    boolean existsByTransactionCodeStartingWithAndPaymentStatus(String transactionCodePrefix, library.entity.PaymentStatus paymentStatus);
    
    org.springframework.data.domain.Page<PaymentEntity> findByTransactionCodeContaining(String transactionCode, org.springframework.data.domain.Pageable pageable);
}
