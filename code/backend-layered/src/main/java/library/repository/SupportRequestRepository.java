package library.repository;

import library.entity.SupportRequestEntity;
import library.entity.SupportRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequestEntity, Integer> {
    List<SupportRequestEntity> findByStatus(SupportRequestStatus status);
}
