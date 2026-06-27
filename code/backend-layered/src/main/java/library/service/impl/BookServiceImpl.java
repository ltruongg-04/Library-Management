package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.response.BookListResponse;
import library.dto.response.BookResponse;
import library.entity.BookEntity;
import library.repository.BookRepository;
import library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookServiceImpl implements BookService {

        private final BookRepository bookRepository;
        private final library.repository.CategoryRepository categoryRepository;
        private final library.repository.AuthorRepository authorRepository;

        @Override
        public List<BookListResponse> getAllBooks() {
                return bookRepository.findAll().stream()
                                .map(this::toBookListResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<BookListResponse> getTopRatedBooks() {
                return bookRepository.findTop10ByOrderByRatingDesc().stream()
                                .map(this::toBookListResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public BookResponse getBookById(Integer id) {
                BookEntity book = bookRepository.findById(id)
                                .orElseThrow(() -> new CustomBusinessException(
                                                "Không tìm thấy sách với ID: " + id,
                                                HttpStatus.NOT_FOUND));
                return toBookResponse(book);
        }

        @Override
        public org.springframework.data.domain.Page<BookListResponse> getAdminBookInventory(
                String keyword,
                Integer categoryId,
                int page,
                int size) {
                org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
                return bookRepository.findForAdminInventory(keyword, categoryId, pageable)
                        .map(this::toBookListResponse);
        }

        @Override
        @Transactional
        public BookResponse updateBook(Integer id, library.dto.request.BookUpdateRequest request) {
                BookEntity book = bookRepository.findById(id)
                                .orElseThrow(() -> new CustomBusinessException(
                                                "Không tìm thấy sách với ID: " + id,
                                                HttpStatus.NOT_FOUND));

                if (request.getTitle() != null) book.setTitle(request.getTitle());
                if (request.getAuthorIds() != null) {
                        java.util.List<library.entity.AuthorEntity> authorEntities = authorRepository.findAllById(request.getAuthorIds());
                        book.setAuthors(new java.util.HashSet<>(authorEntities));
                }
                if (request.getIsbn() != null) book.setIsbn(request.getIsbn());
                if (request.getCategoryIds() != null) {
                        java.util.List<library.entity.CategoryEntity> categoryEntities = categoryRepository.findAllById(request.getCategoryIds());
                        book.setCategories(new java.util.HashSet<>(categoryEntities));
                }
                if (request.getShelfLocation() != null) book.setShelfLocation(request.getShelfLocation());
                if (request.getImageUrl() != null) book.setImageUrl(request.getImageUrl());


                bookRepository.save(book);
                return toBookResponse(book);
        }

        private BookListResponse toBookListResponse(BookEntity entity) {
                return BookListResponse.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .authors(mapAuthors(entity.getAuthors()))
                                .categories(mapCategories(entity.getCategories()))
                                .imageUrl(entity.getImageUrl())
                                .rating(entity.getRating())
                                .availableQuantity(entity.getAvailableQuantity())
                                .quantity(entity.getQuantity())
                                .isbn(entity.getIsbn())
                                .shelfLocation(entity.getShelfLocation())
                                .build();
        }

        private BookResponse toBookResponse(BookEntity entity) {


                return BookResponse.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .authors(mapAuthors(entity.getAuthors()))
                                .publisher(entity.getPublisher())
                                .publicationDate(entity.getPublicationDate())
                                .pages(entity.getPages())
                                .isbn(entity.getIsbn())
                                .description(entity.getDescription())
                                .imageUrl(entity.getImageUrl())
                                .rating(entity.getRating())
                                .reviewCount(entity.getReviewCount())
                                .availableQuantity(entity.getAvailableQuantity())
                                .quantity(entity.getQuantity())
                                .shelfLocation(entity.getShelfLocation())
                                .depositPrice(entity.getDepositPrice())
                                .categories(mapCategories(entity.getCategories()))
                                .build();
        }

        private List<library.dto.response.CategoryResponse> mapCategories(java.util.Set<library.entity.CategoryEntity> categories) {
                if (categories == null) return Collections.emptyList();
                return categories.stream()
                        .map(c -> library.dto.response.CategoryResponse.builder()
                                .id(c.getId())
                                .name(c.getName())
                                .description(c.getDescription())
                                .build())
                        .collect(Collectors.toList());
        }

        private List<library.dto.response.AuthorResponse> mapAuthors(java.util.Set<library.entity.AuthorEntity> authors) {
                if (authors == null) return Collections.emptyList();
                return authors.stream()
                        .map(a -> library.dto.response.AuthorResponse.builder()
                                .id(a.getId())
                                .name(a.getName())
                                .biography(a.getBiography())
                                .build())
                        .collect(Collectors.toList());
        }
}
