package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminCustomerLookupResponseDto;
import library.entity.CustomerEntity;
import library.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasAuthority('borrow.approve')")
public class AdminCustomerController {

    private final CustomerRepository customerRepository;

    @GetMapping("/lookup")
    public ResponseEntity<ApiResponse<AdminCustomerLookupResponseDto>> lookupCustomer(@RequestParam String query) {
        Optional<CustomerEntity> customerOpt = customerRepository.findByLibraryCardNoOrPhone(query);
        
        if (customerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy độc giả với mã hoặc số điện thoại: " + query));
        }
        
        CustomerEntity customer = customerOpt.get();
        boolean isGuest = customer.getUser() == null;
        
        AdminCustomerLookupResponseDto dto = AdminCustomerLookupResponseDto.builder()
                .id(customer.getId())
                .fullName(customer.getFullName())
                .phone(customer.getPhone())
                .email(customer.getUser() != null ? customer.getUser().getEmail() : null)
                .libraryCardNo(customer.getLibraryCardNo())
                .isGuest(isGuest)
                .build();
                
        return ResponseEntity.ok(ApiResponse.success("Tìm thấy độc giả", dto));
    }
}
