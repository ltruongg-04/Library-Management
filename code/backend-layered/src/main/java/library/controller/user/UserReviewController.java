package library.controller.user;

import jakarta.validation.Valid;
import library.dto.request.ReviewRequest;
import library.dto.response.ReviewResponse;
import library.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books/{bookId}/reviews")
@RequiredArgsConstructor
public class UserReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Integer bookId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(bookId, request));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Integer bookId,
            @PathVariable Integer reviewId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(reviewId, request));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Integer bookId,
            @PathVariable Integer reviewId) {
        reviewService.deleteMyReview(reviewId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{reviewId}/report")
    public ResponseEntity<Void> reportReview(
            @PathVariable Integer bookId,
            @PathVariable Integer reviewId,
            @RequestParam(required = false) String reason) {
        reviewService.reportReview(reviewId, reason);
        return ResponseEntity.ok().build();
    }
}
