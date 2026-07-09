package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.common.constant.CacheNames;
import library.dto.response.BookListResponse;
import library.dto.response.BookPageResponse;
import library.dto.response.BookResponse;
import library.entity.BookEntity;
import library.repository.BookRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;


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
public class BookQueryServiceImpl implements library.service.BookQueryService {

    private final BookRepository bookRepository;

    private final library.mapper.BookMapper bookMapper;

    @Override
    public List<BookListResponse> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(bookMapper::toBookListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = CacheNames.BOOKS_TOP_RATED, key = "'top10'")
    public List<BookListResponse> getTopRatedBooks() {
        return bookRepository.findTop10ByOrderByRatingDesc().stream()
                .map(bookMapper::toBookListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = CacheNames.BOOKS_DETAIL, key = "#id")
    public BookResponse getBookById(Integer id) {
        BookEntity book = bookRepository.findByIdIncludingDeleted(id)
                .orElseThrow(() -> new CustomBusinessException(
                        "Không tìm thấy sách với ID: " + id,
                        HttpStatus.NOT_FOUND));
        return bookMapper.toBookResponse(book);
    }

    @Override
    public org.springframework.data.domain.Page<BookListResponse> getAdminBookInventory(
            String keyword,
            Integer categoryId,
            int page,
            int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return bookRepository.findForAdminInventory(keyword, categoryId, pageable)
                .map(bookMapper::toBookListResponse);
    }

    @Override
    @SuppressWarnings("null")
    @Cacheable(
            value = CacheNames.BOOKS_LIST,
            key = "T(java.util.Objects).hash(#keyword, #categoryId, #authorId, #publisher, #page, #size, #sortBy, #minRating, #isAvailable)"
    )
    public BookPageResponse getBooks(String keyword, Integer categoryId, Integer authorId, String publisher, int page,
            int size, String sortBy, Double minRating, Boolean isAvailable) {
        Sort sort = resolveSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String pub = (publisher != null && !publisher.trim().isEmpty()) ? publisher.trim() : null;

        Page<BookEntity> bookPage = bookRepository.findWithFilters(kw, categoryId, authorId, pub, minRating,
                isAvailable, pageable);

        List<BookResponse> responses = bookPage.getContent().stream()
                .map(bookMapper::toBookResponse)
                .collect(Collectors.toList());

        return new BookPageResponse(
                responses,
                bookPage.getNumber(),
                bookPage.getSize(),
                bookPage.getTotalElements(),
                bookPage.getTotalPages(),
                bookPage.isLast());
    }

    @Override
    @Cacheable(value = CacheNames.BOOKS_TRENDING, key = "#limit")
    public BookPageResponse getTrendingBooks(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<BookEntity> bookPage = bookRepository.findAll(pageable);
        return toPageResponse(bookPage);
    }

    private BookPageResponse toPageResponse(Page<BookEntity> bookPage) {
        return BookPageResponse.builder()
                .content(bookPage.getContent().stream()
                        .map(bookMapper::toBookResponse)
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

}
