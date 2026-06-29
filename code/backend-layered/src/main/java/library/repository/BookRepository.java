package library.repository;

import library.entity.BookEntity;
<<<<<<< HEAD

=======
>>>>>>> develop
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, Integer> {
<<<<<<< HEAD
    List<BookEntity> findTop10ByOrderByRatingDesc();

    @Query("SELECT DISTINCT b FROM BookEntity b LEFT JOIN b.categories c LEFT JOIN b.authors a WHERE " +
           "(:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId)")
    Page<BookEntity> findForAdminInventory(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
=======

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
>>>>>>> develop
            Pageable pageable);
}
