package library.service.impl;

import library.common.exception.CustomBusinessException;

import library.dto.response.BookResponse;
import library.entity.BookEntity;
import library.repository.BookRepository;
import library.service.CacheInvalidationService;
import library.service.BookCopyService;
import library.service.FileStorageService;
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    private final CacheInvalidationService cacheInvalidationService;
    private final library.mapper.BookMapper bookMapper;
    private final FileStorageService fileStorageService;

    @Value("${minio.url}")
    private String storageUrl;

    @Value("${minio.bucket-name}")
    private String storageBucketName;

    @Override
    @Transactional
    public BookResponse createBook(library.dto.request.BookCreateRequest request) {
        validateUniqueTitle(request.getTitle(), null);

        if (request.getIsbn() != null && !request.getIsbn().trim().isEmpty()) {
            if (bookRepository.existsByIsbn(request.getIsbn().trim())) {
                throw new CustomBusinessException("Sách với mã ISBN này đã tồn tại trong thư viện",
                        HttpStatus.BAD_REQUEST);
            }
        }

        BookEntity book = BookEntity.builder()
                .title(request.getTitle())
                .isbn(request.getIsbn() != null && request.getIsbn().trim().isEmpty() ? null : request.getIsbn())
                .publisher(request.getPublisher())
                .publicationDate(request.getPublicationDate())
                .pages(request.getPages())
                .description(request.getDescription())
                .imageUrl(resolveCreateBookImageUrl(request.getImageUrl()))
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
            // Update book's calculated properties temporarily for the response or reload if
            // necessary
            // Note: Since @Formula values are evaluated on select, we don't strictly need
            // to do anything here for the DB,
            // but the response might show 0 unless re-fetched. This is fine for admin
            // creation response.
        }

        systemLogService.logAction("Thêm sách mới", "Admin đã thêm sách mới: " + savedBook.getTitle());
        cacheInvalidationService.evictCatalogCaches();
        return bookMapper.toBookResponse(savedBook);
    }

    private String resolveCreateBookImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return null;
        }

        String trimmedImageUrl = imageUrl.trim();

        // Nếu không phải URL http → đã là object key rồi, giữ nguyên
        if (!isExternalHttpUrl(trimmedImageUrl)) {
            return trimmedImageUrl;
        }

        // Nếu là URL đã nằm trên storage → strip prefix lấy object key
        if (isStoredImageUrl(trimmedImageUrl)) {
            return extractObjectKey(trimmedImageUrl);
        }

        // Là URL bên ngoài → upload lên MinIO, trả về object key
        return fileStorageService.uploadFileFromUrl(trimmedImageUrl);
    }

    private boolean isExternalHttpUrl(String imageUrl) {
        return imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
    }

    private boolean isStoredImageUrl(String imageUrl) {
        String normalizedStorageUrl = trimTrailingSlash(storageUrl);
        return imageUrl.startsWith(normalizedStorageUrl + "/" + storageBucketName + "/");
    }

    /**
     * Trích xuất object key từ full storage URL.
     * Ví dụ: "http://84.247.131.42:9000/library/abc.jpg" → "abc.jpg"
     */
    private String extractObjectKey(String fullUrl) {
        String prefix = trimTrailingSlash(storageUrl) + "/" + storageBucketName + "/";
        if (fullUrl.startsWith(prefix)) {
            return fullUrl.substring(prefix.length());
        }
        return fullUrl;
    }

    private String trimTrailingSlash(String value) {
        if (value == null) {
            return "";
        }
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
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
            book.setIsbn(request.getIsbn().trim().isEmpty() ? null : request.getIsbn());
        }
        if (request.getCategoryIds() != null || request.getNewCategories() != null) {
            book.setCategories(processCategories(request.getCategoryIds(), request.getNewCategories()));
        }
        if (request.getTagIds() != null || request.getNewTags() != null) {
            book.setTags(processTags(request.getTagIds(), request.getNewTags()));
        }
        if (request.getShelfLocation() != null)
            book.setShelfLocation(request.getShelfLocation());
        if (request.getImageUrl() != null)
            book.setImageUrl(resolveCreateBookImageUrl(request.getImageUrl()));

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

        bookRepository.delete(book);
        systemLogService.logAction("Xóa sách", "Admin đã xóa sách: " + book.getTitle());
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
            throw new CustomBusinessException(
                    "Sách với tiêu đề này đã tồn tại. Vui lòng quản lý số lượng bằng bản sao sách thay vì tạo đầu sách trùng.",
                    HttpStatus.BAD_REQUEST);
        }
    }

    private java.util.Set<library.entity.AuthorEntity> processAuthors(java.util.List<Integer> authorIds,
            java.util.List<String> newAuthors) {
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
                    library.entity.AuthorEntity newAuthor = library.entity.AuthorEntity.builder().name(authorName)
                            .build();
                    authors.add(authorRepository.save(newAuthor));
                }
            }
        }
        return authors;
    }

    private java.util.Set<library.entity.CategoryEntity> processCategories(java.util.List<Integer> categoryIds,
            java.util.List<String> newCategories) {
        java.util.Set<library.entity.CategoryEntity> categories = new java.util.HashSet<>();
        if (categoryIds != null && !categoryIds.isEmpty()) {
            categories.addAll(categoryRepository.findAllById(categoryIds));
        }
        if (newCategories != null && !newCategories.isEmpty()) {
            for (String categoryName : newCategories) {
                java.util.Optional<library.entity.CategoryEntity> existing = categoryRepository
                        .findByName(categoryName);
                if (existing.isPresent()) {
                    categories.add(existing.get());
                } else {
                    library.entity.CategoryEntity newCategory = library.entity.CategoryEntity.builder()
                            .name(categoryName).build();
                    categories.add(categoryRepository.save(newCategory));
                }
            }
        }
        return categories;
    }

    private java.util.Set<library.entity.TagEntity> processTags(java.util.List<Integer> tagIds,
            java.util.List<String> newTags) {
        java.util.Set<library.entity.TagEntity> tags = new java.util.HashSet<>();
        if (tagIds != null && !tagIds.isEmpty()) {
            tags.addAll(tagRepository.findAllById(tagIds));
        }
        if (newTags != null && !newTags.isEmpty()) {
            for (String tagName : newTags) {
                java.util.Optional<library.entity.TagEntity> existing = tagRepository.findByName(tagName);
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
}
