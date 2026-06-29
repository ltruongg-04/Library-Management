package library.repository;

import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface BorrowOrderRepository extends JpaRepository<BorrowOrderEntity, Integer> {
    long countByStatus(BorrowOrderStatus status);
    
    long countByBorrowDate(LocalDate date);
    
    @Query("SELECT COUNT(br) FROM BorrowOrderEntity br WHERE br.status = :status AND br.dueDate < :date")
    long countOverdueBooks(@Param("status") BorrowOrderStatus status, @Param("date") LocalDate date);
    
    java.util.Optional<BorrowOrderEntity> findByOrderCode(String orderCode);
}
