package library.repository;

import library.entity.BookEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, Integer> {

    List<BookEntity> findTop10ByOrderByRatingDesc();

    @Query("SELECT DISTINCT b FROM BookEntity b LEFT JOIN b.categories c LEFT JOIN b.authors a WHERE " +
           "(:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId)")
    Page<BookEntity> findForAdminInventory(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            Pageable pageable);

    // Tìm kiếm theo title hoặc author name (case-insensitive)
    @Query("SELECT DISTINCT b FROM BookEntity b LEFT JOIN b.authors a WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<BookEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Lọc theo category name
    @Query("SELECT DISTINCT b FROM BookEntity b JOIN b.categories c WHERE LOWER(c.name) = LOWER(:category)")
    Page<BookEntity> findByCategory(@Param("category") String category, Pageable pageable);

    // Tìm kiếm + lọc category
    @Query("SELECT DISTINCT b FROM BookEntity b JOIN b.categories c LEFT JOIN b.authors a WHERE LOWER(c.name) = LOWER(:category) " +
            "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<BookEntity> searchByKeywordAndCategory(
            @Param("keyword") String keyword,
            @Param("category") String category,
            Pageable pageable);
}
