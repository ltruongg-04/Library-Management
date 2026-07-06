package library.repository;

import library.entity.SystemLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLogEntity, Integer> {
    Page<SystemLogEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
