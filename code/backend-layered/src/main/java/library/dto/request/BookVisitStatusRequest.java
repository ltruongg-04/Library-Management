package library.dto.request;

import lombok.Data;

@Data
public class BookVisitStatusRequest {
    private String status;
    private String notes;
}
