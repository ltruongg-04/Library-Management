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
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationServiceImpl implements ReservationService {

        private final ReservationRepository reservationRepository;
        private final BookRepository bookRepository;
        private final CustomerRepository customerRepository;
        private final SystemLogService systemLogService;
        private final library.mapper.ReservationMapper reservationMapper;
        private static final List<ReservationStatus> ACTIVE_QUEUE_STATUSES = List.of(ReservationStatus.PENDING,
                        ReservationStatus.NOTIFIED);

        @Override
        @Transactional
        public ReservationResponse createReservation(ReservationRequest request, Integer customerId) {
                BookEntity book = bookRepository.findById(request.getBookId())
                                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy sách",
                                                HttpStatus.NOT_FOUND));

                if (book.getAvailableQuantity() > 0) {
                        throw new IllegalArgumentException("Sách hiện còn bản có thể mượn. Vui lòng mượn trực tiếp.");
                }

                CustomerEntity customer = customerRepository.findById(customerId)
                                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy khách hàng",
                                                HttpStatus.NOT_FOUND));

                boolean exists = reservationRepository.existsByCustomerIdAndBookIdAndStatusIn(customerId, book.getId(),
                                ACTIVE_QUEUE_STATUSES);
                if (exists) {
                        throw new IllegalArgumentException("Bạn đã có lượt đặt giữ sách đang hoạt động cho sách này");
                }

                LocalDateTime now = LocalDateTime.now();

                ReservationEntity reservation = ReservationEntity.builder()
                                .customer(customer)
                                .book(book)
                                .reservationDate(now)
                                .status(ReservationStatus.PENDING)
                                .build();

                reservation = reservationRepository.save(reservation);

                long position = reservationRepository.countByBookIdAndStatusInAndReservationDateBefore(book.getId(),
                                ACTIVE_QUEUE_STATUSES, now) + 1;

                systemLogService.logAction("Đặt trước sách",
                                "Người dùng " + customer.getFullName() + " đã đặt trước sách: " + book.getTitle());
                log.info("MOCK_NOTIFICATION: User {} successfully reserved book '{}'. Position in queue: {}",
                                customer.getFullName(), book.getTitle(), position);

                return reservationMapper.toReservationResponse(reservation, position);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ReservationResponse> getMyReservations(Integer customerId, Pageable pageable) {
                Page<ReservationEntity> reservations = reservationRepository.findByCustomerId(customerId, pageable);
                return reservations.map(r -> {
                        long position = 0;
                        if (r.getStatus() == ReservationStatus.PENDING) {
                                position = reservationRepository.countByBookIdAndStatusInAndReservationDateBefore(
                                                r.getBook().getId(),
                                                ACTIVE_QUEUE_STATUSES, r.getReservationDate()) + 1;
                        }
                        return reservationMapper.toReservationResponse(r, position);
                });
        }

        @Override
        @Transactional
        public void cancelReservation(Integer reservationId, Integer customerId) {
                ReservationEntity reservation = reservationRepository.findById(reservationId)
                                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy đặt giữ sách",
                                                HttpStatus.NOT_FOUND));

                if (!reservation.getCustomer().getId().equals(customerId)) {
                        throw new IllegalArgumentException("Bạn không có quyền hủy đặt giữ sách này");
                }

                if (reservation.getStatus() != ReservationStatus.PENDING
                                && reservation.getStatus() != ReservationStatus.NOTIFIED) {
                        throw new IllegalArgumentException(
                                        "Chỉ có thể hủy đặt giữ sách đang chờ lấy hoặc đã được thông báo");
                }

                reservation.setStatus(ReservationStatus.CANCELLED);
                reservationRepository.save(reservation);

                systemLogService.logAction("Hủy đặt trước sách", "Người dùng " + reservation.getCustomer().getFullName()
                                + " đã hủy đặt trước sách: " + reservation.getBook().getTitle());
                log.info("MOCK_NOTIFICATION: User {} cancelled reservation for book '{}'",
                                reservation.getCustomer().getFullName(), reservation.getBook().getTitle());
        }

}
