package library.service.impl;

import library.common.exception.CustomBusinessException;

import library.dto.response.BookResponse;
import library.entity.BookEntity;
import library.repository.BookRepository;
import library.service.CacheInvalidationService;
import library.service.BookCopyService;
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
    private final library.repository.TagRepository tagRepository;
    private final SystemLogService systemLogService;
    private final BookCopyService bookCopyService;
    private final library.repository.BookCopyRepository bookCopyRepository;
    private final CacheInvalidationService cacheInvalidationService;
    private final library.mapper.BookMapper bookMapper;



    @Override
    @Transactional
    public BookResponse createBook(library.dto.request.BookCreateRequest request) {
        validateUniqueTitle(request.getTitle(), null);
        String normalizedIsbn = normalizeOptionalText(request.getIsbn());

        if (normalizedIsbn != null) {
            if (bookRepository.existsByIsbn(normalizedIsbn)) {
                throw new CustomBusinessException("Sách với mã ISBN này đã tồn tại trong thư viện", HttpStatus.BAD_REQUEST);
            }
        }

        BookEntity book = BookEntity.builder()
                .title(request.getTitle())
                .isbn(normalizedIsbn)
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
        book.setTags(processTags(request.getTagIds(), request.getNewTags()));

        BookEntity savedBook = bookRepository.save(book);
        
        if (request.getInitialQuantity() != null && request.getInitialQuantity() > 0) {
            bookCopyService.addCopies(savedBook.getId(), request.getInitialQuantity());
            // Update book's calculated properties temporarily for the response or reload if necessary
            // Note: Since @Formula values are evaluated on select, we don't strictly need to do anything here for the DB,
            // but the response might show 0 unless re-fetched. This is fine for admin creation response.
        }
        
        systemLogService.logAction("Thêm sách mới", "Admin đã thêm sách mới: " + savedBook.getTitle());
        cacheInvalidationService.evictCatalogCaches();
        return bookMapper.toBookResponse(savedBook);
    }

    @Override
    @Transactional
    public BookResponse updateBook(Integer id, library.dto.request.BookUpdateRequest request) {
        BookEntity book = bookRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException(
                        "Không tìm thấy sách với ID: " + id,
                        HttpStatus.NOT_FOUND));

        if (request.getTitle() != null) {
            validateUniqueTitle(request.getTitle(), id);
            book.setTitle(request.getTitle());
        }
        if (request.getAuthorIds() != null || request.getNewAuthors() != null) {
            book.setAuthors(processAuthors(request.getAuthorIds(), request.getNewAuthors()));
        }
        if (request.getIsbn() != null) {
            String normalizedIsbn = normalizeOptionalText(request.getIsbn());
            if (normalizedIsbn != null
                    && !normalizedIsbn.equals(book.getIsbn())
                    && bookRepository.existsByIsbn(normalizedIsbn)) {
                throw new CustomBusinessException("Sách với mã ISBN này đã tồn tại trong thư viện", HttpStatus.BAD_REQUEST);
            }
            book.setIsbn(normalizedIsbn);
        }
        if (request.getCategoryIds() != null || request.getNewCategories() != null) {
            book.setCategories(processCategories(request.getCategoryIds(), request.getNewCategories()));
        }
        if (request.getTagIds() != null || request.getNewTags() != null) {
            book.setTags(processTags(request.getTagIds(), request.getNewTags()));
        }
        if (request.getShelfLocation() != null) book.setShelfLocation(request.getShelfLocation());
        if (request.getImageUrl() != null) book.setImageUrl(request.getImageUrl());

        bookRepository.save(book);
        systemLogService.logAction("Cập nhật sách", "Admin đã cập nhật thông tin sách: " + book.getTitle());
        cacheInvalidationService.evictCatalogCaches();
        return bookMapper.toBookResponse(book);
    }

    @Override
    @Transactional
    public void deleteBook(Integer id) {
        BookEntity book = bookRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException(
                        "Không tìm thấy sách với ID: " + id,
                        HttpStatus.NOT_FOUND));

        boolean hasActiveCopies = bookCopyRepository.existsByBookIdAndStatusIn(id, 
                java.util.Arrays.asList(library.entity.BookCopyStatus.BORROWED, library.entity.BookCopyStatus.RESERVED));

        if (hasActiveCopies) {
            throw new CustomBusinessException(
                    "Không thể xóa sách vì đang có bản sao được mượn hoặc đặt trước.",
                    HttpStatus.BAD_REQUEST);
        }

        bookCopyRepository.updateStatusByBookId(id, library.entity.BookCopyStatus.MAINTENANCE, "Sách đã bị ngừng lưu hành (xóa mềm)");
        
        bookRepository.softDeleteById(id);
        
        systemLogService.logAction("Xóa sách", "Admin đã xóa sách (xóa mềm): " + book.getTitle());
        cacheInvalidationService.evictBookCaches();
        cacheInvalidationService.evictCatalogCaches();
    }

    private void validateUniqueTitle(String title, Integer currentBookId) {
        if (title == null || title.trim().isEmpty()) {
            return;
        }

        boolean duplicated = currentBookId == null
                ? bookRepository.existsByNormalizedTitle(title)
                : bookRepository.existsByNormalizedTitleAndIdNot(title, currentBookId);

        if (duplicated) {
            throw new CustomBusinessException("Sách với tiêu đề này đã tồn tại. Vui lòng quản lý số lượng bằng bản sao sách thay vì tạo đầu sách trùng.", HttpStatus.BAD_REQUEST);
        }
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

    private java.util.Set<library.entity.TagEntity> processTags(java.util.List<Integer> tagIds, java.util.List<String> newTags) {
        java.util.Set<library.entity.TagEntity> tags = new java.util.HashSet<>();
        if (tagIds != null && !tagIds.isEmpty()) {
            java.util.List<Integer> distinctTagIds = tagIds.stream()
                    .filter(java.util.Objects::nonNull)
                    .distinct()
                    .toList();

            java.util.List<library.entity.TagEntity> existingTags = tagRepository.findAllById(distinctTagIds);
            if (existingTags.size() != distinctTagIds.size()) {
                java.util.Set<Integer> foundIds = existingTags.stream()
                        .map(library.entity.TagEntity::getId)
                        .collect(java.util.stream.Collectors.toSet());
                java.util.List<Integer> missingIds = distinctTagIds.stream()
                        .filter(tagId -> !foundIds.contains(tagId))
                        .toList();
                throw new CustomBusinessException("Không tìm thấy thẻ với ID: " + missingIds, HttpStatus.BAD_REQUEST);
            }

            tags.addAll(existingTags);
        }
        if (newTags != null && !newTags.isEmpty()) {
            java.util.Map<String, String> normalizedTagNames = new java.util.LinkedHashMap<>();
            for (String rawTagName : newTags) {
                String tagName = normalizeTagName(rawTagName);
                if (tagName != null) {
                    normalizedTagNames.putIfAbsent(tagName.toLowerCase(), tagName);
                }
            }

            for (String tagName : normalizedTagNames.values()) {
                if (tagName.length() > 100) {
                    throw new CustomBusinessException("Tên thẻ không được vượt quá 100 ký tự", HttpStatus.BAD_REQUEST);
                }

                java.util.Optional<library.entity.TagEntity> existing = tagRepository.findByNameIgnoreCase(tagName);
                if (existing.isPresent()) {
                    tags.add(existing.get());
                } else {
                    library.entity.TagEntity newTag = library.entity.TagEntity.builder().name(tagName).build();
                    tags.add(tagRepository.save(newTag));
                }
            }
        }
        return tags;
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String normalizeTagName(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim().replaceAll("\\s+", " ");
        return normalized.isEmpty() ? null : normalized;
    }
}
