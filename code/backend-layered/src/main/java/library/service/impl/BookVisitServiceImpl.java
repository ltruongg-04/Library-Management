package library.service.impl;

import library.dto.request.BookVisitRequest;
import library.entity.BookEntity;
import library.entity.BookVisitEntity;
import library.entity.UserEntity;
import library.repository.BookRepository;
import library.repository.BookVisitRepository;
import library.repository.UserRepository;
import library.service.BookVisitService;
import library.service.EmailService;
import library.service.ReCaptchaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookVisitServiceImpl implements BookVisitService {

    private final BookVisitRepository bookVisitRepository;
    private final BookRepository bookRepository;
    private final EmailService emailService;
    private final ReCaptchaService reCaptchaService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void createBookVisit(BookVisitRequest request) {
        // 1. Validate CAPTCHA
        if (request.getCaptchaToken() == null || request.getCaptchaToken().trim().isEmpty() || !reCaptchaService.verifyToken(request.getCaptchaToken())) {
            throw new RuntimeException("Xác thực CAPTCHA thất bại. Vui lòng thử lại.");
        }

        BookEntity book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));

        // 2. Handle User linking or creation
        UserEntity user = userRepository.findByEmail(request.getEmail()).orElseGet(() -> {
            // Generate random password
            String rawPassword = UUID.randomUUID().toString().substring(0, 8);
            UserEntity newUser = UserEntity.builder()
                    .email(request.getEmail())
                    .fullName(request.getFullName())
                    .phone(request.getPhone())
                    .password(passwordEncoder.encode(rawPassword))
                    .role(UserEntity.Role.USER)
                    .active(true)
                    .build();
            userRepository.save(newUser);
            
            // Send welcome email with password
            emailService.sendWelcomeEmail(request.getEmail(), request.getFullName(), rawPassword);
            log.info("Auto-registered new user and sent welcome email: {}", request.getEmail());
            
            return newUser;
        });

        // 3. Create BookVisit
        BookVisitEntity bookVisit = BookVisitEntity.builder()
                .book(book)
                .user(user)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .visitDate(request.getVisitDate())
                .visitTime(String.format("%s:%s %s", request.getVisitHour(), request.getVisitMinute(), request.getVisitPeriod()))
                .purpose(request.getPurpose())
                .confirmationCode(request.getConfirmationCode())
                .build();

        bookVisitRepository.save(bookVisit);

        // 4. Send Confirmation Email
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

    @Override
    public org.springframework.data.domain.Page<library.dto.response.BookVisitResponse> getAllVisits(org.springframework.data.domain.Pageable pageable) {
        return bookVisitRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public library.dto.response.BookVisitResponse updateStatus(Integer id, String status, String notes) {
        BookVisitEntity visit = bookVisitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lượt hẹn"));
        
        visit.setStatus(status);
        visit.setNotes(notes);
        
        visit = bookVisitRepository.save(visit);
        
        emailService.sendBookVisitStatusEmail(visit.getEmail(), visit.getFullName(), visit.getStatus(), visit.getNotes());
        
        return mapToResponse(visit);
    }

    private library.dto.response.BookVisitResponse mapToResponse(BookVisitEntity entity) {
        return library.dto.response.BookVisitResponse.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhone())
                .visitDate(entity.getVisitDate())
                .status(entity.getStatus())
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
