package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminMembershipTierDto;
import library.service.AdminMembershipTierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/membership-tiers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMembershipTierController {

    private final AdminMembershipTierService tierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminMembershipTierDto>>> getAllTiers() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách hạng thành viên thành công", tierService.getAllTiers()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminMembershipTierDto>> createTier(@RequestBody AdminMembershipTierDto request) {
        return ResponseEntity.ok(ApiResponse.success("Thêm hạng thành viên thành công", tierService.createTier(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminMembershipTierDto>> updateTier(@PathVariable Integer id, @RequestBody AdminMembershipTierDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hạng thành viên thành công", tierService.updateTier(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTier(@PathVariable Integer id) {
        tierService.deleteTier(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa hạng thành viên thành công", null));
    }
}
