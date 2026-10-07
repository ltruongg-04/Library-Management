package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.admin.AdminBannerDto;
import library.entity.BannerEntity;
import library.repository.BannerRepository;
import library.service.AdminBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminBannerServiceImpl implements AdminBannerService {

    private final BannerRepository bannerRepository;

    @Override
    public List<AdminBannerDto> getAllBanners() {
        return bannerRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<AdminBannerDto> getActiveBanners() {
        return bannerRepository.findByIsActiveOrderByDisplayOrderAsc(true)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public AdminBannerDto createBanner(AdminBannerDto request) {
        BannerEntity banner = BannerEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .linkUrl(request.getLinkUrl())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        return mapToDto(bannerRepository.save(banner));
    }

    @Override
    public AdminBannerDto updateBanner(Integer id, AdminBannerDto request) {
        BannerEntity banner = bannerRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy banner", HttpStatus.NOT_FOUND));
        
        banner.setTitle(request.getTitle());
        banner.setDescription(request.getDescription());
        banner.setImageUrl(request.getImageUrl());
        banner.setLinkUrl(request.getLinkUrl());
        if (request.getDisplayOrder() != null) banner.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsActive() != null) banner.setIsActive(request.getIsActive());
        
        return mapToDto(bannerRepository.save(banner));
    }

    @Override
    public void deleteBanner(Integer id) {
        if (!bannerRepository.existsById(id)) {
            throw new CustomBusinessException("Không tìm thấy banner", HttpStatus.NOT_FOUND);
        }
        bannerRepository.deleteById(id);
    }

    private AdminBannerDto mapToDto(BannerEntity entity) {
        return AdminBannerDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .linkUrl(entity.getLinkUrl())
                .displayOrder(entity.getDisplayOrder())
                .isActive(entity.getIsActive())
                .build();
    }
}
