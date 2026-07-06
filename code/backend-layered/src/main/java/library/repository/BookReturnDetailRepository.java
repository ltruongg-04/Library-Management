package library.repository;

import library.entity.BookReturnDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookReturnDetailRepository extends JpaRepository<BookReturnDetailEntity, Integer> {
}
