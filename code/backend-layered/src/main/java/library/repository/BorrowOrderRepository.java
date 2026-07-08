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
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BorrowOrderRepository extends JpaRepository<BorrowOrderEntity, Integer> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"customer", "customer.user"})
    @Override
    List<BorrowOrderEntity> findAll();

    long countByStatus(BorrowOrderStatus status);
    
    long countByBorrowDate(LocalDate date);
    
    @Query("SELECT COUNT(br) FROM BorrowOrderEntity br WHERE br.status = :status AND br.dueDate < :date")
    long countOverdueBooks(@Param("status") BorrowOrderStatus status, @Param("date") LocalDate date);
    
    List<BorrowOrderEntity> findByStatusAndDueDateBefore(BorrowOrderStatus status, LocalDate date);
    
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

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"customer", "customer.user"})
    @Query("""
            SELECT orderEntity
            FROM BorrowOrderEntity orderEntity
            WHERE orderEntity.status = :status
              AND orderEntity.customer.user IS NULL
              AND orderEntity.updatedAt < :cutoff
            """)
    List<BorrowOrderEntity> findGuestOrdersByStatusAndUpdatedAtBefore(
            @Param("status") BorrowOrderStatus status,
            @Param("cutoff") LocalDateTime cutoff);

    @Query("""
            SELECT orderEntity.orderCode,
                   COALESCE(customer.fullName, ''),
                   COALESCE(MIN(book.title), ''),
                   orderEntity.status,
                   orderEntity.createdAt
            FROM BorrowOrderEntity orderEntity
            LEFT JOIN orderEntity.customer customer
            LEFT JOIN orderEntity.orderDetails detail
            LEFT JOIN detail.bookCopy copy
            LEFT JOIN copy.book book
            GROUP BY orderEntity.id, orderEntity.orderCode, customer.fullName, orderEntity.status, orderEntity.createdAt
            ORDER BY orderEntity.createdAt DESC
            """)
    List<Object[]> findRecentActivityStats(Pageable pageable);

    @Query("""
            SELECT c.name, COUNT(detail.id)
            FROM BorrowOrderDetailEntity detail
            JOIN detail.bookCopy copy
            JOIN copy.book book
            JOIN book.categories c
            GROUP BY c.id, c.name
            ORDER BY COUNT(detail.id) DESC
            """)
    List<Object[]> findTopCategoryBorrowStats(Pageable pageable);

    @Query("""
            SELECT book.title, COALESCE(MIN(author.name), ''), COUNT(detail.id), book.availableQuantity
            FROM BorrowOrderDetailEntity detail
            JOIN detail.bookCopy copy
            JOIN copy.book book
            LEFT JOIN book.authors author
            GROUP BY book.id, book.title, book.availableQuantity
            ORDER BY COUNT(detail.id) DESC
            """)
    List<Object[]> findTopBorrowedBookStats(Pageable pageable);

    @Query("""
            SELECT FUNCTION('YEAR', orderEntity.createdAt),
                   FUNCTION('MONTH', orderEntity.createdAt),
                   SUM(CASE WHEN orderEntity.status IN (library.entity.BorrowOrderStatus.BORROWED, library.entity.BorrowOrderStatus.RETURNED, library.entity.BorrowOrderStatus.OVERDUE) THEN 1 ELSE 0 END),
                   SUM(CASE WHEN orderEntity.status = library.entity.BorrowOrderStatus.RETURNED THEN 1 ELSE 0 END),
                   SUM(CASE WHEN orderEntity.status = library.entity.BorrowOrderStatus.OVERDUE THEN 1 ELSE 0 END)
            FROM BorrowOrderEntity orderEntity
            WHERE orderEntity.createdAt IS NOT NULL
            GROUP BY FUNCTION('YEAR', orderEntity.createdAt), FUNCTION('MONTH', orderEntity.createdAt)
            ORDER BY FUNCTION('YEAR', orderEntity.createdAt), FUNCTION('MONTH', orderEntity.createdAt)
            """)
    List<Object[]> findMonthlyBorrowTrends();
}
