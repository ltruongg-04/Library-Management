package library.controller.admin;

import library.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewService reviewService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<org.springframework.data.domain.Page<library.dto.response.AdminReviewResponse>> getAllReviews(
            @RequestParam(required = false) library.entity.ReviewStatus status,
            @RequestParam(required = false) String search,
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsForAdmin(status, search, pageable));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> updateReviewStatus(
            @PathVariable Integer id,
            @RequestParam library.entity.ReviewStatus status,
            @RequestParam(required = false) String hideReason) {
        reviewService.updateReviewStatus(id, status, hideReason);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<library.dto.response.ReviewSummaryResponse> getReviewSummary() {
        return ResponseEntity.ok(reviewService.getReviewSummary());
    }
}
