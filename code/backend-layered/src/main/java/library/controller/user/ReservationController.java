package library.controller.user;

import library.common.exception.CustomBusinessException;
import library.dto.reservation.ReservationRequest;
import library.dto.reservation.ReservationResponse;
import library.entity.CustomerEntity;
import library.entity.UserEntity;
import library.repository.CustomerRepository;
import library.repository.UserRepository;
import library.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    private CustomerEntity getCurrentCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomBusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String email = authentication.getPrincipal().toString();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomBusinessException("User not found", HttpStatus.NOT_FOUND));

        return customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new CustomBusinessException("Customer profile not found", HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ReservationResponse createReservation(@Valid @RequestBody ReservationRequest request) {
        CustomerEntity customer = getCurrentCustomer();
        return reservationService.createReservation(request, customer.getId());
    }

    @GetMapping("/me")
    public Page<ReservationResponse> getMyReservations(Pageable pageable) {
        CustomerEntity customer = getCurrentCustomer();
        return reservationService.getMyReservations(customer.getId(), pageable);
    }

    @DeleteMapping("/{id}")
    public void cancelReservation(@PathVariable Integer id) {
        CustomerEntity customer = getCurrentCustomer();
        reservationService.cancelReservation(id, customer.getId());
    }
}
