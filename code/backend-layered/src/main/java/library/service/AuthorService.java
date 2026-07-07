package library.service;

import library.dto.request.AuthorRequest;
import library.dto.response.AuthorResponse;
import org.springframework.lang.NonNull;

import java.util.List;

public interface AuthorService {
    List<AuthorResponse> getAllAuthors();
    AuthorResponse createAuthor(AuthorRequest request);
    AuthorResponse updateAuthor(@NonNull Integer id, AuthorRequest request);
    void deleteAuthor(@NonNull Integer id);
}
