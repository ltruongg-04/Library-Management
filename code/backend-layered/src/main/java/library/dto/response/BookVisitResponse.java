package library.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BookVisitResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate visitDate;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
}
