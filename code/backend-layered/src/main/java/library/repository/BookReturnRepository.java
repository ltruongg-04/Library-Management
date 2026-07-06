package library.repository;

import library.entity.BookReturnEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookReturnRepository extends JpaRepository<BookReturnEntity, Integer> {
}
