package library.mapper;

import library.dto.reservation.ReservationResponse;
import library.entity.ReservationEntity;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public ReservationResponse toReservationResponse(ReservationEntity reservation, long queuePosition) {
        if (reservation == null) return null;

        return ReservationResponse.builder()
                .id(reservation.getId())
                .bookId(reservation.getBook() != null ? reservation.getBook().getId() : null)
                .bookTitle(reservation.getBook() != null ? reservation.getBook().getTitle() : null)
                .coverImage(reservation.getBook() != null ? reservation.getBook().getImageUrl() : null)
                .reservationDate(reservation.getReservationDate())
                .status(reservation.getStatus())
                .queuePosition(queuePosition)
                .build();
    }
}
