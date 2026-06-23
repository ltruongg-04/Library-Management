package library.repository;

import library.entity.BorrowRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecordEntity, Integer> {

    long countByBorrowDate(LocalDate borrowDate);

    long countByStatus(BorrowRecordEntity.Status status);

    @Query("SELECT COUNT(br) FROM BorrowRecordEntity br WHERE br.status = :status AND br.dueDate < :date")
    long countOverdueBooks(@Param("status") BorrowRecordEntity.Status status, @Param("date") LocalDate date);
}
