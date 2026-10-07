package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminSupplierDto;
import library.service.AdminSupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/suppliers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasAuthority('inventory.manage')")
public class AdminSupplierController {

    private final AdminSupplierService adminSupplierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminSupplierDto>>> getAllSuppliers() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách nhà cung cấp", adminSupplierService.getAllSuppliers()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminSupplierDto>> createSupplier(@RequestBody AdminSupplierDto request) {
        return ResponseEntity.ok(ApiResponse.success("Thêm nhà cung cấp", adminSupplierService.createSupplier(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminSupplierDto>> updateSupplier(@PathVariable Integer id, @RequestBody AdminSupplierDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật nhà cung cấp", adminSupplierService.updateSupplier(id, request)));
    }
}
