package library.service;

import library.dto.reservation.ReservationRequest;
import library.dto.reservation.ReservationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequest request, Integer customerId);
    Page<ReservationResponse> getMyReservations(Integer customerId, Pageable pageable);
    void cancelReservation(Integer reservationId, Integer customerId);
}
