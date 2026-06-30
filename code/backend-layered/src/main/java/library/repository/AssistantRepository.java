package library.repository;

import library.entity.AssistantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssistantRepository extends JpaRepository<AssistantEntity, Integer> {
    Optional<AssistantEntity> findByUserId(Integer userId);
}
