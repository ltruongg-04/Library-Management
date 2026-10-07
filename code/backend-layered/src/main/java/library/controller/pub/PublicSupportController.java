package library.controller.pub;

import jakarta.validation.Valid;
import library.common.base.ApiResponse;
import library.dto.request.SupportRequestDto;
import library.entity.SupportRequestEntity;
import library.repository.SupportRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

@Validated
@RestController
@RequestMapping("/api/public/support-requests")
@RequiredArgsConstructor
public class PublicSupportController {

    private final SupportRequestRepository supportRequestRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createSupportRequest(@Valid @RequestBody SupportRequestDto request) {
        SupportRequestEntity entity = SupportRequestEntity.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        
        supportRequestRepository.save(entity);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Yêu cầu hỗ trợ đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất qua email.", null));
    }
}
