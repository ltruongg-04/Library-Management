package library.controller.admin;

import jakarta.validation.Valid;
import library.common.base.ApiResponse;
import library.dto.request.EbookUpdateRequest;
import library.dto.response.EbookResponse;
import library.service.EbookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/books/{bookId}/ebook")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN') or hasAuthority('books.edit-book')")
public class AdminEbookController {

    private final EbookService ebookService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<EbookResponse>> uploadEbook(
            @PathVariable Integer bookId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "previewPages", required = false, defaultValue = "5") Integer previewPages,
            @RequestParam(value = "isFree", required = false, defaultValue = "false") Boolean isFree,
            @RequestParam(value = "minMembershipTierId", required = false) Integer minMembershipTierId,
            @RequestParam(value = "totalPages", required = false) Integer totalPages) {

        EbookResponse response = ebookService.uploadEbook(bookId, file, previewPages, isFree, minMembershipTierId, totalPages);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tải lên sách mềm thành công", response));
    }

    @PostMapping("/auto-sample")
    public ResponseEntity<ApiResponse<EbookResponse>> createSampleEbook(
            @PathVariable Integer bookId,
            @RequestParam(value = "previewPages", required = false, defaultValue = "5") Integer previewPages,
            @RequestParam(value = "isFree", required = false, defaultValue = "false") Boolean isFree,
            @RequestParam(value = "minMembershipTierId", required = false) Integer minMembershipTierId) {

        EbookResponse response = ebookService.createSampleEbook(bookId, previewPages, isFree, minMembershipTierId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tự động gán sách mềm mẫu thành công", response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<EbookResponse>> updateEbook(
            @PathVariable Integer bookId,
            @Valid @RequestBody EbookUpdateRequest request) {

        EbookResponse response = ebookService.updateEbook(bookId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin sách mềm thành công", response));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteEbook(@PathVariable Integer bookId) {
        ebookService.deleteEbook(bookId);
        return ResponseEntity.ok(ApiResponse.success("Xóa sách mềm thành công", null));
    }
}
