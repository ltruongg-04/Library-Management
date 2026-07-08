package library.repository;

import library.entity.BookVisitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookVisitRepository extends JpaRepository<BookVisitEntity, Integer> {
    List<BookVisitEntity> findByVisitDateAndStatusAndIsRemindedFalse(LocalDate visitDate, String status);
}
