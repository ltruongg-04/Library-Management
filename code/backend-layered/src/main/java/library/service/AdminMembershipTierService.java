package library.service;

import library.dto.admin.AdminMembershipTierDto;
import java.util.List;

public interface AdminMembershipTierService {
    List<AdminMembershipTierDto> getAllTiers();
    AdminMembershipTierDto createTier(AdminMembershipTierDto request);
    AdminMembershipTierDto updateTier(Integer id, AdminMembershipTierDto request);
    void deleteTier(Integer id);
}
