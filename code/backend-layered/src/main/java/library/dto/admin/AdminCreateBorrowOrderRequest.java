package library.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCreateBorrowOrderRequest {
    private String phone; // Bắt buộc
    private String fullName; // Tuỳ chọn, nếu tạo mới thì cần
    private String email; // Tuỳ chọn
    private List<String> bookBarcodes;
    private LocalDate dueDate;
}
