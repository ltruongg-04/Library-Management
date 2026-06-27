package library.service;

import library.dto.request.BookCopyRequest;
import library.dto.response.BookCopyResponse;
import library.entity.BookCopyEntity;
import library.entity.BookCopyStatus;
import library.entity.BookEntity;
import library.repository.BookCopyRepository;
import library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookCopyService {

    private final BookCopyRepository bookCopyRepository;
    private final BookRepository bookRepository;

    public List<BookCopyResponse> getCopiesByBookId(Integer bookId) {
        return bookCopyRepository.findByBookId(bookId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookCopyResponse addCopy(Integer bookId) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // Generate a unique barcode
        String barcode = "B" + bookId + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        while (bookCopyRepository.existsByBarcode(barcode)) {
            barcode = "B" + bookId + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }

        BookCopyEntity copy = BookCopyEntity.builder()
                .book(book)
                .barcode(barcode)
                .status(BookCopyStatus.AVAILABLE)
                .build();

        copy = bookCopyRepository.save(copy);
        return mapToResponse(copy);
    }

    @Transactional
    public BookCopyResponse updateCopy(Integer copyId, BookCopyRequest request) {
        BookCopyEntity copy = bookCopyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Book copy not found"));

        BookEntity book = copy.getBook();
        BookCopyStatus oldStatus = copy.getStatus();
        BookCopyStatus newStatus = request.getStatus();

        // Update condition note
        if (request.getConditionNote() != null) {
            copy.setConditionNote(request.getConditionNote());
        }

        // Handle status change
        if (oldStatus != newStatus) {
            copy.setStatus(newStatus);
        }

        copy = bookCopyRepository.save(copy);
        return mapToResponse(copy);
    }

    @Transactional
    public void deleteCopy(Integer copyId) {
        BookCopyEntity copy = bookCopyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Book copy not found"));

        BookEntity book = copy.getBook();
        bookCopyRepository.delete(copy);
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
