package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.reservation.ReservationRequest;
import library.dto.reservation.ReservationResponse;
import library.entity.BookEntity;
import library.entity.CustomerEntity;
import library.entity.ReservationEntity;
import library.entity.ReservationStatus;
import library.repository.BookRepository;
import library.repository.CustomerRepository;
import library.repository.ReservationRepository;
import library.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public ReservationResponse createReservation(ReservationRequest request, Integer customerId) {
        BookEntity book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new CustomBusinessException("Book not found", HttpStatus.NOT_FOUND));

        if (book.getAvailableQuantity() > 0) {
            throw new IllegalArgumentException("Cannot reserve a book that is available. Please borrow it directly.");
        }

        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomBusinessException("Customer not found", HttpStatus.NOT_FOUND));

        boolean exists = reservationRepository.existsByCustomerIdAndBookIdAndStatus(customerId, book.getId(), ReservationStatus.PENDING);
        if (exists) {
            throw new IllegalArgumentException("You already have a pending reservation for this book");
        }

        LocalDateTime now = LocalDateTime.now();

        ReservationEntity reservation = ReservationEntity.builder()
                .customer(customer)
                .book(book)
                .reservationDate(now)
                .status(ReservationStatus.PENDING)
                .build();

        reservation = reservationRepository.save(reservation);

        long position = reservationRepository.countByBookIdAndStatusAndReservationDateBefore(book.getId(), ReservationStatus.PENDING, now) + 1;

        log.info("MOCK_NOTIFICATION: User {} successfully reserved book '{}'. Position in queue: {}", customer.getFullName(), book.getTitle(), position);

        return mapToResponse(reservation, position);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReservationResponse> getMyReservations(Integer customerId, Pageable pageable) {
        Page<ReservationEntity> reservations = reservationRepository.findByCustomerId(customerId, pageable);
        return reservations.map(r -> {
            long position = 0;
            if (r.getStatus() == ReservationStatus.PENDING) {
                position = reservationRepository.countByBookIdAndStatusAndReservationDateBefore(r.getBook().getId(), ReservationStatus.PENDING, r.getReservationDate()) + 1;
            }
            return mapToResponse(r, position);
        });
    }

    @Override
    @Transactional
    public void cancelReservation(Integer reservationId, Integer customerId) {
        ReservationEntity reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new CustomBusinessException("Reservation not found", HttpStatus.NOT_FOUND));

        if (!reservation.getCustomer().getId().equals(customerId)) {
            throw new IllegalArgumentException("You do not have permission to cancel this reservation");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING && reservation.getStatus() != ReservationStatus.NOTIFIED) {
            throw new IllegalArgumentException("Only pending or notified reservations can be cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
        log.info("MOCK_NOTIFICATION: User {} cancelled reservation for book '{}'", reservation.getCustomer().getFullName(), reservation.getBook().getTitle());
    }

    private ReservationResponse mapToResponse(ReservationEntity reservation, long queuePosition) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .bookId(reservation.getBook().getId())
                .bookTitle(reservation.getBook().getTitle())
                .coverImage(reservation.getBook().getImageUrl())
                .reservationDate(reservation.getReservationDate())
                .status(reservation.getStatus())
                .queuePosition(queuePosition)
                .build();
    }
}
