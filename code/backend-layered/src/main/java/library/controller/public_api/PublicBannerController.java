package library.controller.public_api;

import library.common.base.ApiResponse;
import library.dto.admin.AdminBannerDto;
import library.service.AdminBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/banners")
@RequiredArgsConstructor
public class PublicBannerController {

    private final AdminBannerService adminBannerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminBannerDto>>> getActiveBanners() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách banner thành công", adminBannerService.getActiveBanners()));
    }
}
