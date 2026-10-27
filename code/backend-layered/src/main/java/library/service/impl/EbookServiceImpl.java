package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.request.EbookUpdateRequest;
import library.dto.response.EbookResponse;
import library.entity.BookEntity;
import library.entity.CustomerEntity;
import library.entity.EbookEntity;
import library.entity.MembershipTierEntity;
import library.entity.UserEntity;
import library.repository.BookRepository;
import library.repository.CustomerRepository;
import library.repository.EbookRepository;
import library.repository.MembershipTierRepository;
import library.repository.UserRepository;
import library.service.EbookService;
import library.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EbookServiceImpl implements EbookService {

    private final EbookRepository ebookRepository;
    private final BookRepository bookRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final MembershipTierRepository membershipTierRepository;

    @Override
    @Transactional(readOnly = true)
    public EbookResponse getEbookByBookId(Integer bookId) {
        EbookEntity ebook = ebookRepository.findByBookId(bookId)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy sách mềm cho đầu sách này", HttpStatus.NOT_FOUND));

        if (!Boolean.TRUE.equals(ebook.getIsActive())) {
            // Kiểm tra xem có phải Admin/Librarian không để cho phép xem cấu hình
            if (!isAdminOrStaff()) {
                throw new CustomBusinessException("Sách mềm này hiện đang tạm ẩn", HttpStatus.FORBIDDEN);
            }
        }

        return mapToResponse(ebook);
    }

    @Override
    @Transactional(readOnly = true)
    public InputStream getEbookStream(Integer bookId) {
        EbookEntity ebook = ebookRepository.findByBookId(bookId)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy sách mềm cho đầu sách này", HttpStatus.NOT_FOUND));

        if (!Boolean.TRUE.equals(ebook.getIsActive()) && !isAdminOrStaff()) {
            throw new CustomBusinessException("Sách mềm này hiện đang tạm ẩn", HttpStatus.FORBIDDEN);
        }

        return fileStorageService.getFileStream(ebook.getFileKey());
    }

    @Override
    @Transactional
    public EbookResponse uploadEbook(Integer bookId, MultipartFile file, Integer previewPages, Boolean isFree, Integer minMembershipTierId, Integer totalPages) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy sách với ID: " + bookId, HttpStatus.NOT_FOUND));

        if (file == null || file.isEmpty()) {
            throw new CustomBusinessException("Vui lòng tải lên tệp sách mềm (PDF)", HttpStatus.BAD_REQUEST);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new CustomBusinessException("Chỉ chấp nhận tệp định dạng PDF", HttpStatus.BAD_REQUEST);
        }

        // Tải lên MinIO
        String objectKey = fileStorageService.uploadFile(file);

        // Kiểm tra xem đã có Ebook cũ chưa
        Optional<EbookEntity> existingOpt = ebookRepository.findByBookId(bookId);
        EbookEntity ebook;
        if (existingOpt.isPresent()) {
            ebook = existingOpt.get();
            // Xóa file cũ
            try {
                fileStorageService.deleteFile(ebook.getFileKey());
            } catch (Exception e) {
                log.warn("Không thể xóa file cũ: {}", ebook.getFileKey());
            }
        } else {
            ebook = new EbookEntity();
            ebook.setBook(book);
        }

        ebook.setFileKey(objectKey);
        ebook.setFileName(originalFilename);
        ebook.setFileFormat("PDF");
        ebook.setFileSizeBytes(file.getSize());

        int pages = (totalPages != null && totalPages > 0) ? totalPages : (book.getPages() != null && book.getPages() > 0 ? book.getPages() : 1);
        ebook.setTotalPages(pages);
        if (book.getPages() == null || book.getPages() == 0) {
            book.setPages(pages);
            bookRepository.save(book);
        }

        ebook.setPreviewPages(previewPages != null && previewPages >= 0 ? previewPages : 5);
        ebook.setIsFree(Boolean.TRUE.equals(isFree));
        ebook.setMinMembershipTierId(minMembershipTierId);
        ebook.setIsActive(true);

        EbookEntity saved = ebookRepository.save(ebook);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public EbookResponse updateEbook(Integer bookId, EbookUpdateRequest request) {
        EbookEntity ebook = ebookRepository.findByBookId(bookId)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy sách mềm", HttpStatus.NOT_FOUND));

        if (request.getPreviewPages() != null) {
            ebook.setPreviewPages(request.getPreviewPages());
        }
        if (request.getIsFree() != null) {
            ebook.setIsFree(request.getIsFree());
        }
        if (request.getMinMembershipTierId() != null) {
            ebook.setMinMembershipTierId(request.getMinMembershipTierId() == 0 ? null : request.getMinMembershipTierId());
        }
        if (request.getIsActive() != null) {
            ebook.setIsActive(request.getIsActive());
        }

        EbookEntity saved = ebookRepository.save(ebook);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteEbook(Integer bookId) {
        EbookEntity ebook = ebookRepository.findByBookId(bookId)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy sách mềm", HttpStatus.NOT_FOUND));

        fileStorageService.deleteFile(ebook.getFileKey());
        ebookRepository.delete(ebook);
    }

    private boolean isAdminOrStaff() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        return auth.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_ADMIN") ||
                a.getAuthority().equals("ROLE_LIBRARIAN") ||
                a.getAuthority().equals("ROLE_ASSISTANT"));
    }

    private EbookResponse mapToResponse(EbookEntity ebook) {
        String tierName = null;
        if (ebook.getMinMembershipTierId() != null) {
            tierName = membershipTierRepository.findById(ebook.getMinMembershipTierId())
                    .map(MembershipTierEntity::getName)
                    .orElse(null);
        }

        boolean canReadFull = false;
        String accessReason = "PREVIEW_GUEST";

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser");

        if (isAdminOrStaff()) {
            canReadFull = true;
            accessReason = "ADMIN_ACCESS";
        } else if (Boolean.TRUE.equals(ebook.getIsFree())) {
            canReadFull = true;
            accessReason = "FREE_FOR_ALL";
        } else if (isAuthenticated) {
            String email = auth.getName();
            Optional<UserEntity> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                if (ebook.getMinMembershipTierId() == null) {
                    // Mọi độc giả có tài khoản đăng nhập đều được đọc full
                    canReadFull = true;
                    accessReason = "REGISTERED_CUSTOMER";
                } else {
                    Optional<CustomerEntity> customerOpt = customerRepository.findByUserId(userOpt.get().getId());
                    if (customerOpt.isPresent() && customerOpt.get().getMembershipTierId() != null) {
                        Integer customerTierId = customerOpt.get().getMembershipTierId();
                        Optional<MembershipTierEntity> customerTierOpt = membershipTierRepository.findById(customerTierId);
                        Optional<MembershipTierEntity> requiredTierOpt = membershipTierRepository.findById(ebook.getMinMembershipTierId());

                        if (customerTierOpt.isPresent() && requiredTierOpt.isPresent()) {
                            if (customerTierOpt.get().getMinPoints() >= requiredTierOpt.get().getMinPoints()) {
                                canReadFull = true;
                                accessReason = "TIER_QUALIFIED";
                            } else {
                                canReadFull = false;
                                accessReason = "TIER_UPGRADE_REQUIRED";
                            }
                        } else if (customerTierId.equals(ebook.getMinMembershipTierId())) {
                            canReadFull = true;
                            accessReason = "TIER_QUALIFIED";
                        } else {
                            canReadFull = false;
                            accessReason = "TIER_UPGRADE_REQUIRED";
                        }
                    } else {
                        canReadFull = false;
                        accessReason = "TIER_UPGRADE_REQUIRED";
                    }
                }
            } else {
                canReadFull = false;
                accessReason = "PREVIEW_GUEST";
            }
        } else {
            canReadFull = false;
            accessReason = "PREVIEW_GUEST";
        }

        int totalPages = ebook.getTotalPages() != null && ebook.getTotalPages() > 0 ? ebook.getTotalPages() : 1;
        int previewPages = ebook.getPreviewPages() != null && ebook.getPreviewPages() > 0 ? ebook.getPreviewPages() : 5;
        int allowedPages = canReadFull ? totalPages : Math.min(previewPages, totalPages);

        return EbookResponse.builder()
                .id(ebook.getId())
                .bookId(ebook.getBook().getId())
                .bookTitle(ebook.getBook().getTitle())
                .fileName(ebook.getFileName())
                .fileFormat(ebook.getFileFormat())
                .fileSizeBytes(ebook.getFileSizeBytes())
                .totalPages(totalPages)
                .previewPages(previewPages)
                .isFree(ebook.getIsFree())
                .minMembershipTierId(ebook.getMinMembershipTierId())
                .minMembershipTierName(tierName)
                .isActive(ebook.getIsActive())
                .canReadFull(canReadFull)
                .previewOnly(!canReadFull)
                .allowedPages(allowedPages)
                .accessReason(accessReason)
                .createdAt(ebook.getCreatedAt())
                .updatedAt(ebook.getUpdatedAt())
                .build();
    }
}
