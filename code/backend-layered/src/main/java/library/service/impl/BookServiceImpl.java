package library.service.impl;

import library.dto.response.BookPageResponse;
import library.dto.response.BookResponse;
import library.entity.BookEntity;
import library.repository.BookRepository;
import library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Override
    @SuppressWarnings("null")
    public BookPageResponse getBooks(String keyword, String category, int page, int size, String sortBy) {
        Sort sort = resolveSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<BookEntity> bookPage;

        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean hasCategory = category != null && !category.trim().isEmpty();

        String kw = hasKeyword ? keyword.trim() : "";
        String cat = hasCategory ? category.trim() : "";

        if (hasKeyword && hasCategory) {
            bookPage = bookRepository.searchByKeywordAndCategory(kw, cat, pageable);
        } else if (hasKeyword) {
            bookPage = bookRepository.searchByKeyword(kw, pageable);
        } else if (hasCategory) {
            bookPage = bookRepository.findByCategory(cat, pageable);
        } else {
            bookPage = bookRepository.findAll(pageable);
        }

        return toPageResponse(bookPage);
    }

    @Override
    @SuppressWarnings("null")
    public BookResponse getBookById(Integer id) {
        BookEntity book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với id: " + id));
        return BookResponse.fromEntity(book);
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
                        .map(BookResponse::fromEntity)
                        .toList())
                .page(bookPage.getNumber())
                .size(bookPage.getSize())
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .last(bookPage.isLast())
                .build();
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        return switch (sortBy) {
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "title" -> Sort.by(Sort.Direction.ASC, "title");
            case "author" -> Sort.by(Sort.Direction.ASC, "author");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
