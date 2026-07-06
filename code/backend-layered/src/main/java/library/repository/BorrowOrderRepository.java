package library.repository;

import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowOrderRepository extends JpaRepository<BorrowOrderEntity, Integer> {
    long countByStatus(BorrowOrderStatus status);
    
    long countByBorrowDate(LocalDate date);
    
    @Query("SELECT COUNT(br) FROM BorrowOrderEntity br WHERE br.status = :status AND br.dueDate < :date")
    long countOverdueBooks(@Param("status") BorrowOrderStatus status, @Param("date") LocalDate date);
    
    java.util.Optional<BorrowOrderEntity> findByOrderCode(String orderCode);

    @Query("SELECT b FROM BorrowOrderEntity b WHERE b.customer.user.id = :userId ORDER BY b.createdAt DESC")
    java.util.List<BorrowOrderEntity> findBorrowHistoryByUserId(@Param("userId") Integer userId);

    @Query("SELECT b FROM BorrowOrderEntity b WHERE b.orderCode = :orderCode AND b.customer.user.id = :userId")
    java.util.Optional<BorrowOrderEntity> findByOrderCodeAndCustomerUserId(@Param("orderCode") String orderCode, @Param("userId") Integer userId);
    Page<BorrowOrderEntity> findByCustomerIdOrderByCreatedAtDesc(Integer customerId, Pageable pageable);

    java.util.Optional<BorrowOrderEntity> findByOrderCodeAndCustomerId(String orderCode, Integer customerId);

    java.util.Optional<BorrowOrderEntity> findByOrderCodeAndCustomerPhone(String orderCode, String phone);
    
    java.util.List<BorrowOrderEntity> findByCustomerEmailOrderByCreatedAtDesc(String email);

    List<BorrowOrderEntity> findTop5ByOrderByCreatedAtDesc();
}
