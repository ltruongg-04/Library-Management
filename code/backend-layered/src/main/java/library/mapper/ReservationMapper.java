package library.mapper;

import library.dto.reservation.ReservationResponse;
import library.entity.ReservationEntity;
import library.service.FileStorageService;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    private final FileStorageService fileStorageService;

    public ReservationMapper(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    public ReservationResponse toReservationResponse(ReservationEntity reservation, long queuePosition) {
        if (reservation == null) return null;

        return ReservationResponse.builder()
                .id(reservation.getId())
                .bookId(reservation.getBook() != null ? reservation.getBook().getId() : null)
                .bookTitle(reservation.getBook() != null ? reservation.getBook().getTitle() : null)
                .coverImage(reservation.getBook() != null ? fileStorageService.resolveFullUrl(reservation.getBook().getImageUrl()) : null)
                .reservationDate(reservation.getReservationDate())
                .status(reservation.getStatus())
                .queuePosition(queuePosition)
                .build();
    }
}
