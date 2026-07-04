package library.repository;

import library.entity.BorrowExtensionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BorrowExtensionRepository extends JpaRepository<BorrowExtensionEntity, Integer> {
    long countByBorrowOrderId(Integer borrowOrderId);
    long countByBorrowOrderIdAndStatus(Integer borrowOrderId, library.entity.BorrowExtensionStatus status);
    java.util.Optional<BorrowExtensionEntity> findFirstByBorrowOrderIdAndStatusOrderByRequestedAtDesc(Integer borrowOrderId, library.entity.BorrowExtensionStatus status);
}
