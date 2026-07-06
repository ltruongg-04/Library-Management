package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.response.BookListResponse;
import library.dto.response.BookPageResponse;
import library.dto.response.BookResponse;
import library.entity.BookEntity;
import library.repository.BookRepository;
import library.service.BookService;
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final library.repository.CategoryRepository categoryRepository;
    private final library.repository.AuthorRepository authorRepository;
    private final SystemLogService systemLogService;

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
    public BookResponse createBook(library.dto.request.BookCreateRequest request) {
        if (request.getIsbn() != null && !request.getIsbn().trim().isEmpty()) {
            if (bookRepository.existsByIsbn(request.getIsbn().trim())) {
                throw new CustomBusinessException("Sách với mã ISBN này đã tồn tại trong thư viện", HttpStatus.BAD_REQUEST);
            }
        }

        BookEntity book = BookEntity.builder()
                .title(request.getTitle())
                .isbn(request.getIsbn() != null && request.getIsbn().trim().isEmpty() ? null : request.getIsbn())
                .publisher(request.getPublisher())
                .publicationDate(request.getPublicationDate())
                .pages(request.getPages())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .shelfLocation(request.getShelfLocation())
                .depositPrice(request.getDepositPrice())
                .quantity(0)
                .availableQuantity(0)
                .rating(0.0)
                .reviewCount(0)
                .build();

        java.util.Set<library.entity.AuthorEntity> authors = new java.util.HashSet<>();
        if (request.getAuthorIds() != null && !request.getAuthorIds().isEmpty()) {
            authors.addAll(authorRepository.findAllById(request.getAuthorIds()));
        }
        if (request.getNewAuthors() != null && !request.getNewAuthors().isEmpty()) {
            for (String authorName : request.getNewAuthors()) {
                java.util.Optional<library.entity.AuthorEntity> existing = authorRepository.findByName(authorName);
                if (existing.isPresent()) {
                    authors.add(existing.get());
                } else {
                    library.entity.AuthorEntity newAuthor = library.entity.AuthorEntity.builder().name(authorName).build();
                    authors.add(authorRepository.save(newAuthor));
                }
            }
        }
        book.setAuthors(authors);

        java.util.Set<library.entity.CategoryEntity> categories = new java.util.HashSet<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories.addAll(categoryRepository.findAllById(request.getCategoryIds()));
        }
        if (request.getNewCategories() != null && !request.getNewCategories().isEmpty()) {
            for (String categoryName : request.getNewCategories()) {
                java.util.Optional<library.entity.CategoryEntity> existing = categoryRepository.findByName(categoryName);
                if (existing.isPresent()) {
                    categories.add(existing.get());
                } else {
                    library.entity.CategoryEntity newCategory = library.entity.CategoryEntity.builder().name(categoryName).build();
                    categories.add(categoryRepository.save(newCategory));
                }
            }
        }
        book.setCategories(categories);

        BookEntity savedBook = bookRepository.save(book);
        systemLogService.logAction("Thêm sách mới", "Admin đã thêm sách mới: " + savedBook.getTitle());
        return toBookResponse(savedBook);
    }

    @Override
    @Transactional
    public BookResponse updateBook(Integer id, library.dto.request.BookUpdateRequest request) {
        BookEntity book = bookRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException(
                        "Không tìm thấy sách với ID: " + id,
                        HttpStatus.NOT_FOUND));

        if (request.getTitle() != null) book.setTitle(request.getTitle());
        if (request.getAuthorIds() != null || request.getNewAuthors() != null) {
            java.util.Set<library.entity.AuthorEntity> authors = new java.util.HashSet<>();
            if (request.getAuthorIds() != null) {
                authors.addAll(authorRepository.findAllById(request.getAuthorIds()));
            }
            if (request.getNewAuthors() != null) {
                for (String authorName : request.getNewAuthors()) {
                    java.util.Optional<library.entity.AuthorEntity> existing = authorRepository.findByName(authorName);
                    if (existing.isPresent()) {
                        authors.add(existing.get());
                    } else {
                        library.entity.AuthorEntity newAuthor = library.entity.AuthorEntity.builder().name(authorName).build();
                        authors.add(authorRepository.save(newAuthor));
                    }
                }
            }
            book.setAuthors(authors);
        }
        if (request.getIsbn() != null) {
            book.setIsbn(request.getIsbn().trim().isEmpty() ? null : request.getIsbn());
        }
        if (request.getCategoryIds() != null || request.getNewCategories() != null) {
            java.util.Set<library.entity.CategoryEntity> categories = new java.util.HashSet<>();
            if (request.getCategoryIds() != null) {
                categories.addAll(categoryRepository.findAllById(request.getCategoryIds()));
            }
            if (request.getNewCategories() != null) {
                for (String categoryName : request.getNewCategories()) {
                    java.util.Optional<library.entity.CategoryEntity> existing = categoryRepository.findByName(categoryName);
                    if (existing.isPresent()) {
                        categories.add(existing.get());
                    } else {
                        library.entity.CategoryEntity newCategory = library.entity.CategoryEntity.builder().name(categoryName).build();
                        categories.add(categoryRepository.save(newCategory));
                    }
                }
            }
            book.setCategories(categories);
        }
        if (request.getShelfLocation() != null) book.setShelfLocation(request.getShelfLocation());
        if (request.getImageUrl() != null) book.setImageUrl(request.getImageUrl());

        bookRepository.save(book);
        systemLogService.logAction("Cập nhật sách", "Admin đã cập nhật thông tin sách: " + book.getTitle());
        return toBookResponse(book);
    }

    @Override
    @SuppressWarnings("null")
    public BookPageResponse getBooks(String keyword, Integer categoryId, Integer authorId, String publisher, int page, int size, String sortBy, Double minRating, Boolean isAvailable) {
        Sort sort = resolveSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String pub = (publisher != null && !publisher.trim().isEmpty()) ? publisher.trim() : null;

        Page<BookEntity> bookPage = bookRepository.findWithFilters(kw, categoryId, authorId, pub, minRating, isAvailable, pageable);

        List<BookResponse> responses = bookPage.getContent().stream()
                .map(this::toBookResponse)
                .collect(Collectors.toList());

        return new BookPageResponse(
                responses,
                bookPage.getNumber(),
                bookPage.getSize(),
                bookPage.getTotalElements(),
                bookPage.getTotalPages(),
                bookPage.isLast()
        );
    }

    @Override
    public BookPageResponse getTrendingBooks(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<BookEntity> bookPage = bookRepository.findAll(pageable);
        return toPageResponse(bookPage);
    }

    private BookPageResponse toPageResponse(Page<BookEntity> bookPage) {
        return BookPageResponse.builder()
                .content(bookPage.getContent().stream()
                        .map(this::toBookResponse)
                        .collect(Collectors.toList()))
                .page(bookPage.getNumber())
                .size(bookPage.getSize())
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .last(bookPage.isLast())
                .build();
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null) {
            return Sort.by(Sort.Direction.DESC, "id");
        }

        return switch (sortBy) {
            case "newest" -> Sort.by(Sort.Direction.DESC, "id");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "id");
            case "title" -> Sort.by(Sort.Direction.ASC, "title");
            case "titleDesc" -> Sort.by(Sort.Direction.DESC, "title");
            case "author" -> Sort.by(Sort.Direction.ASC, "author");
            case "authorDesc" -> Sort.by(Sort.Direction.DESC, "author");
            case "mostRead" -> Sort.by(Sort.Direction.DESC, "borrowCount");
            case "leastRead" -> Sort.by(Sort.Direction.ASC, "borrowCount");
            default -> Sort.by(Sort.Direction.DESC, "id");
        };
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
