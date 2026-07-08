package library.service;

import library.dto.request.BookVisitRequest;
import library.dto.response.BookVisitResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookVisitService {
    void createBookVisit(BookVisitRequest request);

    Page<BookVisitResponse> getAllVisits(Pageable pageable);

    BookVisitResponse updateStatus(Integer id, String status, String notes);
}
