package library.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCustomerLookupResponseDto {
    private Integer id;
    private String fullName;
    private String phone;
    private String email;
    private String libraryCardNo;
    private Boolean isGuest;
}
