package library.repository;

import library.entity.BookCopyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopyEntity, Integer> {
    List<BookCopyEntity> findByBookId(Integer bookId);
    boolean existsByBarcode(String barcode);
}
