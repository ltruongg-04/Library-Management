package library.controller.user;

import library.common.exception.CustomBusinessException;
import library.dto.response.BookListResponse;
import library.entity.CustomerEntity;
import library.entity.UserEntity;
import library.repository.CustomerRepository;
import library.repository.UserRepository;
import library.service.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favourites")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;
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

    @PostMapping("/{bookId}")
    public void addFavourite(@PathVariable Integer bookId) {
        CustomerEntity customer = getCurrentCustomer();
        favouriteService.addFavourite(customer.getId(), bookId);
    }

    @DeleteMapping("/{bookId}")
    public void removeFavourite(@PathVariable Integer bookId) {
        CustomerEntity customer = getCurrentCustomer();
        favouriteService.removeFavourite(customer.getId(), bookId);
    }

    @GetMapping("/{bookId}/check")
    public boolean checkFavourite(@PathVariable Integer bookId) {
        try {
            CustomerEntity customer = getCurrentCustomer();
            return favouriteService.isFavourite(customer.getId(), bookId);
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping
    public Page<BookListResponse> getFavourites(Pageable pageable) {
        CustomerEntity customer = getCurrentCustomer();
        return favouriteService.getFavouritesByCustomer(customer.getId(), pageable);
    }
}
