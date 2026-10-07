package library.service;

import library.dto.admin.AdminBannerDto;
import java.util.List;

public interface AdminBannerService {
    List<AdminBannerDto> getAllBanners();
    List<AdminBannerDto> getActiveBanners();
    AdminBannerDto createBanner(AdminBannerDto request);
    AdminBannerDto updateBanner(Integer id, AdminBannerDto request);
    void deleteBanner(Integer id);
}
