package library.service.impl;

import library.common.exception.CustomBusinessException;

import library.dto.response.BookResponse;
import library.entity.BookEntity;
import library.repository.BookRepository;

import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;




import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookCommandServiceImpl implements library.service.BookCommandService {

    private final BookRepository bookRepository;
    private final library.repository.CategoryRepository categoryRepository;
    private final library.repository.AuthorRepository authorRepository;
    private final SystemLogService systemLogService;
    private final library.mapper.BookMapper bookMapper;



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

        book.setAuthors(processAuthors(request.getAuthorIds(), request.getNewAuthors()));
        book.setCategories(processCategories(request.getCategoryIds(), request.getNewCategories()));

        BookEntity savedBook = bookRepository.save(book);
        systemLogService.logAction("Thêm sách mới", "Admin đã thêm sách mới: " + savedBook.getTitle());
        return bookMapper.toBookResponse(savedBook);
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
            book.setAuthors(processAuthors(request.getAuthorIds(), request.getNewAuthors()));
        }
        if (request.getIsbn() != null) {
            book.setIsbn(request.getIsbn().trim().isEmpty() ? null : request.getIsbn());
        }
        if (request.getCategoryIds() != null || request.getNewCategories() != null) {
            book.setCategories(processCategories(request.getCategoryIds(), request.getNewCategories()));
        }
        if (request.getShelfLocation() != null) book.setShelfLocation(request.getShelfLocation());
        if (request.getImageUrl() != null) book.setImageUrl(request.getImageUrl());

        bookRepository.save(book);
        systemLogService.logAction("Cập nhật sách", "Admin đã cập nhật thông tin sách: " + book.getTitle());
        return bookMapper.toBookResponse(book);
    }



    private java.util.Set<library.entity.AuthorEntity> processAuthors(java.util.List<Integer> authorIds, java.util.List<String> newAuthors) {
        java.util.Set<library.entity.AuthorEntity> authors = new java.util.HashSet<>();
        if (authorIds != null && !authorIds.isEmpty()) {
            authors.addAll(authorRepository.findAllById(authorIds));
        }
        if (newAuthors != null && !newAuthors.isEmpty()) {
            for (String authorName : newAuthors) {
                java.util.Optional<library.entity.AuthorEntity> existing = authorRepository.findByName(authorName);
                if (existing.isPresent()) {
                    authors.add(existing.get());
                } else {
                    library.entity.AuthorEntity newAuthor = library.entity.AuthorEntity.builder().name(authorName).build();
                    authors.add(authorRepository.save(newAuthor));
                }
            }
        }
        return authors;
    }

    private java.util.Set<library.entity.CategoryEntity> processCategories(java.util.List<Integer> categoryIds, java.util.List<String> newCategories) {
        java.util.Set<library.entity.CategoryEntity> categories = new java.util.HashSet<>();
        if (categoryIds != null && !categoryIds.isEmpty()) {
            categories.addAll(categoryRepository.findAllById(categoryIds));
        }
        if (newCategories != null && !newCategories.isEmpty()) {
            for (String categoryName : newCategories) {
                java.util.Optional<library.entity.CategoryEntity> existing = categoryRepository.findByName(categoryName);
                if (existing.isPresent()) {
                    categories.add(existing.get());
                } else {
                    library.entity.CategoryEntity newCategory = library.entity.CategoryEntity.builder().name(categoryName).build();
                    categories.add(categoryRepository.save(newCategory));
                }
            }
        }
        return categories;
    }
}
