package library.repository;

import library.entity.ReservationEntity;
import library.entity.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Integer> {

    Page<ReservationEntity> findByCustomerId(Integer customerId, Pageable pageable);

    boolean existsByCustomerIdAndBookIdAndStatus(Integer customerId, Integer bookId, ReservationStatus status);

    long countByBookIdAndStatusAndReservationDateBefore(Integer bookId, ReservationStatus status, LocalDateTime date);

    Optional<ReservationEntity> findFirstByBookIdAndStatusOrderByReservationDateAsc(Integer bookId, ReservationStatus status);

    @Modifying
    @Query("DELETE FROM ReservationEntity r WHERE r.status = :status AND r.reservationDate < :date")
    int deleteByStatusAndReservationDateBefore(@Param("status") ReservationStatus status, @Param("date") LocalDateTime date);
}
