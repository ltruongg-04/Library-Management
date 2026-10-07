package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminBannerDto;
import library.service.AdminBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBannerController {

    private final AdminBannerService adminBannerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminBannerDto>>> getAllBanners() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách banner thành công", adminBannerService.getAllBanners()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminBannerDto>> createBanner(@RequestBody AdminBannerDto request) {
        return ResponseEntity.ok(ApiResponse.success("Thêm banner thành công", adminBannerService.createBanner(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminBannerDto>> updateBanner(@PathVariable Integer id, @RequestBody AdminBannerDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật banner thành công", adminBannerService.updateBanner(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBanner(@PathVariable Integer id) {
        adminBannerService.deleteBanner(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa banner thành công", null));
    }
}
