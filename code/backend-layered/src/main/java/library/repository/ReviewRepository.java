package library.repository;

import library.entity.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import library.entity.ReviewStatus;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer> {
    
    Page<ReviewEntity> findByBookIdAndStatusIn(Integer bookId, List<ReviewStatus> statuses, Pageable pageable);
    
    List<ReviewEntity> findByBookIdAndStatusIn(Integer bookId, List<ReviewStatus> statuses);

    @Query("SELECT r FROM ReviewEntity r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:search IS NULL OR LOWER(r.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.comment) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.book.title) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ReviewEntity> findForAdmin(@Param("status") ReviewStatus status, @Param("search") String search, Pageable pageable);

    long countByStatus(ReviewStatus status);
    
    long countByRating(Integer rating);
}
