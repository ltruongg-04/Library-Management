package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.admin.AdminMembershipTierDto;
import library.entity.MembershipTierEntity;
import library.repository.MembershipTierRepository;
import library.service.AdminMembershipTierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminMembershipTierServiceImpl implements AdminMembershipTierService {

    private final MembershipTierRepository tierRepository;

    @Override
    public List<AdminMembershipTierDto> getAllTiers() {
        return tierRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public AdminMembershipTierDto createTier(AdminMembershipTierDto request) {
        MembershipTierEntity tier = MembershipTierEntity.builder()
                .name(request.getName())
                .minPoints(request.getMinPoints() != null ? request.getMinPoints() : 0)
                .discountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : 0)
                .maxBorrowDays(request.getMaxBorrowDays() != null ? request.getMaxBorrowDays() : 14)
                .maxBorrowBooks(request.getMaxBorrowBooks() != null ? request.getMaxBorrowBooks() : 5)
                .build();
        return mapToDto(tierRepository.save(tier));
    }

    @Override
    public AdminMembershipTierDto updateTier(Integer id, AdminMembershipTierDto request) {
        MembershipTierEntity tier = tierRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy hạng thành viên", HttpStatus.NOT_FOUND));
        
        tier.setName(request.getName());
        if (request.getMinPoints() != null) tier.setMinPoints(request.getMinPoints());
        if (request.getDiscountPercent() != null) tier.setDiscountPercent(request.getDiscountPercent());
        if (request.getMaxBorrowDays() != null) tier.setMaxBorrowDays(request.getMaxBorrowDays());
        if (request.getMaxBorrowBooks() != null) tier.setMaxBorrowBooks(request.getMaxBorrowBooks());
        
        return mapToDto(tierRepository.save(tier));
    }

    @Override
    public void deleteTier(Integer id) {
        if (!tierRepository.existsById(id)) {
            throw new CustomBusinessException("Không tìm thấy hạng thành viên", HttpStatus.NOT_FOUND);
        }
        tierRepository.deleteById(id);
    }

    private AdminMembershipTierDto mapToDto(MembershipTierEntity entity) {
        return AdminMembershipTierDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .minPoints(entity.getMinPoints())
                .discountPercent(entity.getDiscountPercent())
                .maxBorrowDays(entity.getMaxBorrowDays())
                .maxBorrowBooks(entity.getMaxBorrowBooks())
                .build();
    }
}
