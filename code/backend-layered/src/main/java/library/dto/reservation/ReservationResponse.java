package library.dto.reservation;

import library.entity.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Integer id;
    private Integer bookId;
    private String bookTitle;
    private String coverImage;
    private LocalDateTime reservationDate;
    private ReservationStatus status;
    private Long queuePosition;
}
