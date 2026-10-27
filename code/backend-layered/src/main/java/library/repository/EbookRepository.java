package library.repository;

import library.entity.EbookEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EbookRepository extends JpaRepository<EbookEntity, Integer> {
    Optional<EbookEntity> findByBookId(Integer bookId);
    boolean existsByBookId(Integer bookId);
    void deleteByBookId(Integer bookId);
}
