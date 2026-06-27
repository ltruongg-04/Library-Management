package library.repository;

import library.entity.BookEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, Integer> {

    // Tìm kiếm theo title hoặc author (case-insensitive)
    @Query("SELECT b FROM BookEntity b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<BookEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Lọc theo category
    Page<BookEntity> findByCategory(String category, Pageable pageable);

    // Tìm kiếm + lọc category
    @Query("SELECT b FROM BookEntity b WHERE b.category = :category " +
            "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<BookEntity> searchByKeywordAndCategory(
            @Param("keyword") String keyword,
            @Param("category") String category,
            Pageable pageable);
}
