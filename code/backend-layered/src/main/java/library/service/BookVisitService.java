package library.service;

import library.dto.request.BookVisitRequest;

public interface BookVisitService {
    void createBookVisit(BookVisitRequest request);
}
