package library.service;

import library.dto.request.EbookUpdateRequest;
import library.dto.response.EbookResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface EbookService {
    EbookResponse getEbookByBookId(Integer bookId);
    InputStream getEbookStream(Integer bookId);
    EbookResponse uploadEbook(Integer bookId, MultipartFile file, Integer previewPages, Boolean isFree, Integer minMembershipTierId, Integer totalPages);
    EbookResponse updateEbook(Integer bookId, EbookUpdateRequest request);
    void deleteEbook(Integer bookId);
}
