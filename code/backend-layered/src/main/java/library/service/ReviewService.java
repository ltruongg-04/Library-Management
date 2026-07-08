package library.service;

import library.dto.request.ReviewRequest;
import library.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    
    ReviewResponse createReview(Integer bookId, ReviewRequest request);
    
    Page<ReviewResponse> getReviewsByBookId(Integer bookId, Pageable pageable);
    
    ReviewResponse updateReview(Integer id, ReviewRequest request);
    
    Page<library.dto.response.AdminReviewResponse> getReviewsForAdmin(library.entity.ReviewStatus status, String search, Pageable pageable);
    
    void updateReviewStatus(Integer id, library.entity.ReviewStatus status, String hideReason);
    
    void reportReview(Integer id, String reason);
    
    void deleteReview(Integer id);
    
    void deleteMyReview(Integer id);
    
    library.dto.response.ReviewSummaryResponse getReviewSummary();
}
