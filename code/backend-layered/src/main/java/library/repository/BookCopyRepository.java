package library.repository;

import library.entity.BookCopyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopyEntity, Integer> {
    List<BookCopyEntity> findByBookId(Integer bookId);
    boolean existsByBarcode(String barcode);
    java.util.Optional<BookCopyEntity> findByBarcode(String barcode);
    BookCopyEntity findFirstByBookIdAndStatus(Integer bookId, library.entity.BookCopyStatus status);
    long countByStatus(library.entity.BookCopyStatus status);
    boolean existsByBookIdAndStatusIn(Integer bookId, List<library.entity.BookCopyStatus> statuses);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE BookCopyEntity bc SET bc.status = :status, bc.conditionNote = :note WHERE bc.book.id = :bookId")
    void updateStatusByBookId(@org.springframework.data.repository.query.Param("bookId") Integer bookId, 
                             @org.springframework.data.repository.query.Param("status") library.entity.BookCopyStatus status, 
                             @org.springframework.data.repository.query.Param("note") String note);
}
