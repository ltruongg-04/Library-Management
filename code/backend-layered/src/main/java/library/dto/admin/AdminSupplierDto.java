package library.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminSupplierDto {
    private Integer id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private Boolean isActive;
}
