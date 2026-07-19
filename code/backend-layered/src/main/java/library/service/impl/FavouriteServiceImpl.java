package library.service.impl;

import library.common.exception.CustomBusinessException;

import library.dto.response.BookListResponse;

import library.entity.BookEntity;

import library.entity.CustomerEntity;
import library.entity.FavouriteEntity;
import library.entity.FavouriteId;
import library.repository.BookRepository;
import library.repository.CustomerRepository;
import library.repository.FavouriteRepository;
import library.service.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@RequiredArgsConstructor
public class FavouriteServiceImpl implements FavouriteService {

    private final FavouriteRepository favouriteRepository;
    private final CustomerRepository customerRepository;
    private final BookRepository bookRepository;
    private final library.mapper.BookMapper bookMapper;

    @Override
    @Transactional
    public void addFavourite(Integer customerId, Integer bookId) {
        if (favouriteRepository.existsByIdCustomerIdAndIdBookId(customerId, bookId)) {
            return; // Already favorited
        }

        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy khách hàng", HttpStatus.NOT_FOUND));
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy sách", HttpStatus.NOT_FOUND));

        FavouriteId favouriteId = new FavouriteId(customer.getId(), book.getId());

        FavouriteEntity favourite = FavouriteEntity.builder()
                .id(favouriteId)
                .customer(customer)
                .book(book)
                .build();

        favouriteRepository.save(favourite);
    }

    @Override
    @Transactional
    public void removeFavourite(Integer customerId, Integer bookId) {
        FavouriteEntity favourite = favouriteRepository.findByIdCustomerIdAndIdBookId(customerId, bookId)
                .orElse(null);
        if (favourite != null) {
            favouriteRepository.delete(favourite);
        }
    }

    @Override
    public boolean isFavourite(Integer customerId, Integer bookId) {
        return favouriteRepository.existsByIdCustomerIdAndIdBookId(customerId, bookId);
    }

    @Override
    public Page<BookListResponse> getFavouritesByCustomer(Integer customerId, Pageable pageable) {
        Page<FavouriteEntity> favourites = favouriteRepository.findByIdCustomerId(customerId, pageable);
        return favourites.map(fav -> bookMapper.toBookListResponse(fav.getBook()));
    }

}
