package library.service;

import library.dto.request.BookCopyRequest;
import library.dto.response.BookCopyResponse;

import java.util.List;

public interface BookCopyService {
    List<BookCopyResponse> getCopiesByBookId(Integer bookId);
    BookCopyResponse addCopy(Integer bookId);
    List<BookCopyResponse> addCopies(Integer bookId, int quantity);
    BookCopyResponse updateCopy(Integer copyId, BookCopyRequest request);
    void deleteCopy(Integer copyId);
}
