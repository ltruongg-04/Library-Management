package library.repository;

import library.entity.BookEntity;
import library.entity.BookStatus;
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

    @Query("SELECT b FROM BookEntity b WHERE " +
           "(:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.category) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:category IS NULL OR b.category = :category)")
    Page<BookEntity> findForAdminInventory(
            @Param("keyword") String keyword,
            @Param("status") BookStatus status,
            @Param("category") String category,
            Pageable pageable);
}
