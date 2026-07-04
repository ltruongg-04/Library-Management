package library.repository;

import library.entity.ReservationEntity;
import library.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Integer> {
    boolean existsByBookIdAndStatus(Integer bookId, ReservationStatus status);
}
