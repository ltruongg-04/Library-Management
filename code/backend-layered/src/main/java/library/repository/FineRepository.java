package library.repository;

import library.entity.FineEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<FineEntity, Integer> {
    List<FineEntity> findByBookReturnId(Integer bookReturnId);
}
