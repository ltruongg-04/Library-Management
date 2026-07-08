package library.service.impl;

import library.dto.request.ReviewRequest;
import library.dto.response.ReviewResponse;
import library.entity.BookEntity;
import library.entity.ReviewEntity;
import library.entity.UserEntity;
import library.repository.BookRepository;
import library.repository.ReviewRepository;
import library.repository.UserRepository;
import library.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import library.entity.ReviewStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(Integer bookId, ReviewRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        ReviewEntity review = ReviewEntity.builder()
                .user(user)
                .book(book)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);

        updateBookRating(book);

        return mapToResponse(review);
    }

    @Override
    public Page<ReviewResponse> getReviewsByBookId(Integer bookId, Pageable pageable) {
        return reviewRepository.findByBookIdAndStatusIn(bookId, Arrays.asList(ReviewStatus.VISIBLE, ReviewStatus.REPORTED), pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Integer id, ReviewRequest request) {
        ReviewEntity review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!review.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You can only edit your own review");
        }
        
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);
        updateBookRating(review.getBook());
        
        return mapToResponse(review);
    }

    @Override
    public Page<library.dto.response.AdminReviewResponse> getReviewsForAdmin(ReviewStatus status, String search, Pageable pageable) {
        return reviewRepository.findForAdmin(status, search, pageable).map(entity -> {
            long daysAgo = ChronoUnit.DAYS.between(entity.getCreatedAt().toLocalDate(), java.time.LocalDate.now());
            
            String accent = "primary";
            if (entity.getStatus() == ReviewStatus.REPORTED) accent = "warning";
            else if (entity.getStatus() == ReviewStatus.HIDDEN) accent = "muted";

            return library.dto.response.AdminReviewResponse.builder()
                    .id(entity.getId())
                    .reviewerName(entity.getUser().getFullName())
                    .reviewerInitials(entity.getUser().getFullName().substring(0, 2).toUpperCase())
                    .reviewerRole(entity.getUser().getRole().name())
                    .bookTitle(entity.getBook().getTitle())
                    .rating(entity.getRating())
                    .createdAt(entity.getCreatedAt().toString()) // format later if needed
                    .createdDaysAgo((int) daysAgo)
                    .content(entity.getComment())
                    .hideReason(entity.getHideReason())
                    .status(entity.getStatus().name().toLowerCase())
                    .accent(accent)
                    .build();
        });
    }

    @Override
    @Transactional
    public void updateReviewStatus(Integer id, ReviewStatus status, String hideReason) {
        ReviewEntity review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setStatus(status);
        if (hideReason != null) {
            review.setHideReason(hideReason);
        }
        
        reviewRepository.save(review);
        updateBookRating(review.getBook());
    }

    @Override
    @Transactional
    public void reportReview(Integer id, String reason) {
        ReviewEntity review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
                
        // Only mark as reported if it's currently visible
        if (review.getStatus() == ReviewStatus.VISIBLE) {
            review.setStatus(ReviewStatus.REPORTED);
            reviewRepository.save(review);
        }
    }

    @Override
    @Transactional
    public void deleteReview(Integer id) {
        ReviewEntity review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        BookEntity book = review.getBook();
        reviewRepository.delete(review);
        updateBookRating(book);
    }
    
    @Override
    @Transactional
    public void deleteMyReview(Integer id) {
        ReviewEntity review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
                
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!review.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You can only delete your own review");
        }
        
        BookEntity book = review.getBook();
        reviewRepository.delete(review);
        updateBookRating(book);
    }

    @Override
    public library.dto.response.ReviewSummaryResponse getReviewSummary() {
        return library.dto.response.ReviewSummaryResponse.builder()
                .all(reviewRepository.count())
                .recent(reviewRepository.count()) // recent is typically same as all but sorted differently
                .reported(reviewRepository.countByStatus(ReviewStatus.REPORTED))
                .hidden(reviewRepository.countByStatus(ReviewStatus.HIDDEN))
                .star5(reviewRepository.countByRating(5))
                .star4(reviewRepository.countByRating(4))
                .star3(reviewRepository.countByRating(3))
                .star2(reviewRepository.countByRating(2))
                .star1(reviewRepository.countByRating(1))
                .build();
    }

    private void updateBookRating(BookEntity book) {
        List<ReviewEntity> reviews = reviewRepository.findByBookIdAndStatusIn(book.getId(), Arrays.asList(ReviewStatus.VISIBLE, ReviewStatus.REPORTED));
        
        int totalReviews = reviews.size();
        if (totalReviews == 0) {
            book.setRating(0.0);
            book.setReviewCount(0);
        } else {
            double average = reviews.stream()
                    .mapToInt(ReviewEntity::getRating)
                    .average()
                    .orElse(0.0);
            // Round to 1 decimal place
            book.setRating(Math.round(average * 10.0) / 10.0);
            book.setReviewCount(totalReviews);
        }
        
        bookRepository.save(book);
    }

    private ReviewResponse mapToResponse(ReviewEntity entity) {
        return ReviewResponse.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .userName(entity.getUser().getFullName())
                .avatarUrl("https://ui-avatars.com/api/?name=" + entity.getUser().getFullName().replace(" ", "+") + "&background=random")
                .rating(entity.getRating())
                .comment(entity.getComment())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
