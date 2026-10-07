package library.service;

import library.dto.admin.AdminSupplierDto;
import java.util.List;

public interface AdminSupplierService {
    List<AdminSupplierDto> getAllSuppliers();
    AdminSupplierDto createSupplier(AdminSupplierDto request);
    AdminSupplierDto updateSupplier(Integer id, AdminSupplierDto request);
}
