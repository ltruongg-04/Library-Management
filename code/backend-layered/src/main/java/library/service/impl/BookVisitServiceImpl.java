package library.service.impl;

import library.dto.request.BookVisitRequest;
import library.entity.BookEntity;
import library.entity.BookVisitEntity;
import library.repository.BookRepository;
import library.repository.BookVisitRepository;
import library.service.BookVisitService;
import library.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookVisitServiceImpl implements BookVisitService {

    private final BookVisitRepository bookVisitRepository;
    private final BookRepository bookRepository;
    private final EmailService emailService;

    @Override
    public void createBookVisit(BookVisitRequest request) {
        BookEntity book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        BookVisitEntity bookVisit = BookVisitEntity.builder()
                .book(book)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .visitDate(request.getVisitDate())
                .visitTime(String.format("%s:%s %s", request.getVisitHour(), request.getVisitMinute(), request.getVisitPeriod()))
                .purpose(request.getPurpose())
                .confirmationCode(request.getConfirmationCode())
                .build();

        bookVisitRepository.save(bookVisit);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String formattedDate = request.getVisitDate().format(formatter);
        String formattedTime = bookVisit.getVisitTime();
        
        emailService.sendBookVisitConfirmationEmail(
                request.getEmail(),
                request.getFullName(),
                book.getTitle(),
                request.getConfirmationCode(),
                formattedDate,
                formattedTime,
                request.getPhone()
        );
        
        log.info("Created book visit and sent email for {}", request.getEmail());
    }
}
