package library.service.impl;

import library.dto.request.BookCopyRequest;
import library.dto.response.BookCopyResponse;
import library.entity.BookCopyEntity;
import library.entity.BookCopyStatus;
import library.entity.BookEntity;
import library.repository.BookCopyRepository;
import library.repository.BookRepository;
import library.service.BookCopyService;
import library.service.CacheInvalidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookCopyServiceImpl implements BookCopyService {

    private final BookCopyRepository bookCopyRepository;
    private final BookRepository bookRepository;
    private final CacheInvalidationService cacheInvalidationService;

    @Override
    public List<BookCopyResponse> getCopiesByBookId(Integer bookId) {
        return bookCopyRepository.findByBookId(bookId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookCopyResponse addCopy(Integer bookId) {
        return addCopies(bookId, 1).get(0);
    }

    @Override
    @Transactional
    public List<BookCopyResponse> addCopies(Integer bookId, int quantity) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));

        List<BookCopyEntity> newCopies = new java.util.ArrayList<>();
        for (int i = 0; i < quantity; i++) {
            String barcode = "B" + bookId + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            while (bookCopyRepository.existsByBarcode(barcode)) {
                barcode = "B" + bookId + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            }

            BookCopyEntity copy = BookCopyEntity.builder()
                    .book(book)
                    .barcode(barcode)
                    .status(BookCopyStatus.AVAILABLE)
                    .build();
            newCopies.add(copy);
        }

        List<BookCopyEntity> savedCopies = bookCopyRepository.saveAll(newCopies);
        cacheInvalidationService.evictBookCaches();
        return savedCopies.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookCopyResponse updateCopy(Integer copyId, BookCopyRequest request) {
        BookCopyEntity copy = bookCopyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản sao sách"));


        BookCopyStatus oldStatus = copy.getStatus();
        BookCopyStatus newStatus = request.getStatus();

        if (request.getConditionNote() != null) {
            copy.setConditionNote(request.getConditionNote());
        }

        if (oldStatus != newStatus) {
            copy.setStatus(newStatus);
        }

        copy = bookCopyRepository.save(copy);
        cacheInvalidationService.evictBookCaches();
        return mapToResponse(copy);
    }

    @Override
    @Transactional
    public void deleteCopy(Integer copyId) {
        BookCopyEntity copy = bookCopyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản sao sách"));
        bookCopyRepository.delete(copy);
        cacheInvalidationService.evictBookCaches();
    }

    private BookCopyResponse mapToResponse(BookCopyEntity entity) {
        return BookCopyResponse.builder()
                .id(entity.getId())
                .bookId(entity.getBook().getId())
                .barcode(entity.getBarcode())
                .status(entity.getStatus())
                .conditionNote(entity.getConditionNote())
                .build();
    }
}
