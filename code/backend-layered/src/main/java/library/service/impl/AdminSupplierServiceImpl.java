package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.admin.AdminSupplierDto;
import library.entity.SupplierEntity;
import library.repository.SupplierRepository;
import library.service.AdminSupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminSupplierServiceImpl implements AdminSupplierService {

    private final SupplierRepository supplierRepository;

    @Override
    public List<AdminSupplierDto> getAllSuppliers() {
        return supplierRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public AdminSupplierDto createSupplier(AdminSupplierDto request) {
        SupplierEntity supplier = SupplierEntity.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        return mapToDto(supplierRepository.save(supplier));
    }

    @Override
    public AdminSupplierDto updateSupplier(Integer id, AdminSupplierDto request) {
        SupplierEntity supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy nhà cung cấp", HttpStatus.NOT_FOUND));
        
        supplier.setName(request.getName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        if (request.getIsActive() != null) supplier.setIsActive(request.getIsActive());
        
        return mapToDto(supplierRepository.save(supplier));
    }

    private AdminSupplierDto mapToDto(SupplierEntity entity) {
        return AdminSupplierDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .address(entity.getAddress())
                .isActive(entity.getIsActive())
                .build();
    }
}
