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
    boolean existsByIsbn(String isbn);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE BookEntity b SET b.isDeleted = true WHERE b.id = :id")
    void softDeleteById(@Param("id") Integer id);

    @Query("SELECT COUNT(b) > 0 FROM BookEntity b WHERE LOWER(TRIM(b.title)) = LOWER(TRIM(:title))")
    boolean existsByNormalizedTitle(@Param("title") String title);

    @Query("SELECT COUNT(b) > 0 FROM BookEntity b WHERE b.id <> :id AND LOWER(TRIM(b.title)) = LOWER(TRIM(:title))")
    boolean existsByNormalizedTitleAndIdNot(@Param("title") String title, @Param("id") Integer id);

    List<BookEntity> findTop10ByOrderByRatingDesc();

    @Query("SELECT DISTINCT b FROM BookEntity b LEFT JOIN b.categories c LEFT JOIN b.authors a WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId)")
    @org.springframework.data.jpa.repository.QueryHints({
        @jakarta.persistence.QueryHint(name = "org.hibernate.fetchSize", value = "50")
    })
    Page<BookEntity> findForAdminInventory(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            Pageable pageable);

    // Tìm kiếm theo title hoặc author name (case-insensitive)
    @Query("SELECT DISTINCT b FROM BookEntity b LEFT JOIN b.authors a WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<BookEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Lọc theo category id
    @Query("SELECT DISTINCT b FROM BookEntity b JOIN b.categories c WHERE c.id = :categoryId")
    Page<BookEntity> findByCategoryId(@Param("categoryId") Integer categoryId, Pageable pageable);

    // Tìm kiếm + lọc category
    @Query("SELECT DISTINCT b FROM BookEntity b JOIN b.categories c LEFT JOIN b.authors a WHERE c.id = :categoryId " +
            "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<BookEntity> searchByKeywordAndCategoryId(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            Pageable pageable);

    @Query("SELECT DISTINCT b FROM BookEntity b LEFT JOIN b.categories c LEFT JOIN b.authors a WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId) AND " +
           "(:authorId IS NULL OR a.id = :authorId) AND " +
           "(:publisher IS NULL OR :publisher = '' OR b.publisher = :publisher) AND " +
           "(:minRating IS NULL OR b.rating >= :minRating) AND " +
           "(:isAvailable IS NULL OR :isAvailable = false OR b.availableQuantity > 0)")
    Page<BookEntity> findWithFilters(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            @Param("authorId") Integer authorId,
            @Param("publisher") String publisher,
            @Param("minRating") Double minRating,
            @Param("isAvailable") Boolean isAvailable,
            Pageable pageable);
}
